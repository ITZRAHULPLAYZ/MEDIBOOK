const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new patient account.
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check for duplicate email among patients
    const existingPatient = store.patients.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );
    if (existingPatient) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Check admin email too
    if (store.admin.email.toLowerCase() === email.toLowerCase()) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password and create patient
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newPatient = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      dob: dob || '',
      role: 'patient',
      password: hashedPassword
    };

    store.patients.push(newPatient);

    // Generate JWT
    const token = jwt.sign(
      { id: newPatient.id, email: newPatient.email, role: newPatient.role, name: newPatient.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = newPatient;

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

/**
 * POST /api/auth/login
 * Login for patients and admin.
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check admin first
    if (store.admin.email.toLowerCase() === email.toLowerCase()) {
      const isValidPassword = bcrypt.compareSync(password, store.admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: store.admin.id, email: store.admin.email, role: store.admin.role, name: store.admin.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...adminWithoutPassword } = store.admin;

      return res.status(200).json({
        message: 'Login successful.',
        token,
        user: adminWithoutPassword
      });
    }

    // Check patients
    const patient = store.patients.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );

    if (!patient) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = bcrypt.compareSync(password, patient.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: patient.id, email: patient.email, role: patient.role, name: patient.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...patientWithoutPassword } = patient;

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: patientWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user's profile.
 */
router.get('/me', authenticate, (req, res) => {
  try {
    // Check if admin
    if (req.user.role === 'admin') {
      const { password, ...adminWithoutPassword } = store.admin;
      return res.status(200).json({ user: adminWithoutPassword });
    }

    // Find patient
    const patient = store.patients.find((p) => p.id === req.user.id);
    if (!patient) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password, ...patientWithoutPassword } = patient;
    res.status(200).json({ user: patientWithoutPassword });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
