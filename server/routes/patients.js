const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All patient routes require authentication
router.use(authenticate);

/**
 * GET /api/patients/profile
 * Return current patient's profile (without password).
 */
router.get('/profile', (req, res) => {
  try {
    const patient = store.patients.find((p) => p.id === req.user.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    const { password, ...patientWithoutPassword } = patient;

    res.status(200).json({ patient: patientWithoutPassword });
  } catch (err) {
    console.error('Get patient profile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/patients/profile
 * Update patient profile fields (name, phone, dob).
 */
router.put('/profile', (req, res) => {
  try {
    const { name, phone, dob } = req.body;

    const patientIndex = store.patients.findIndex((p) => p.id === req.user.id);
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    const patient = store.patients[patientIndex];

    // Update only provided fields
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }
      patient.name = name.trim();
    }

    if (phone !== undefined) {
      patient.phone = phone;
    }

    if (dob !== undefined) {
      patient.dob = dob;
    }

    store.patients[patientIndex] = patient;

    const { password, ...patientWithoutPassword } = patient;

    res.status(200).json({
      message: 'Profile updated successfully.',
      patient: patientWithoutPassword
    });
  } catch (err) {
    console.error('Update patient profile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/patients/notifications
 * Return patient's notifications sorted by createdAt descending.
 */
router.get('/notifications', (req, res) => {
  try {
    const patientId = req.user.id;

    const notifications = store.notifications
      .filter((n) => n.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      count: notifications.length,
      notifications
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/patients/notifications/:id/read
 * Mark a notification as read.
 */
router.put('/notifications/:id/read', (req, res) => {
  try {
    const notificationId = req.params.id;
    const patientId = req.user.id;

    const notificationIndex = store.notifications.findIndex(
      (n) => n.id === notificationId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    const notification = store.notifications[notificationIndex];

    // Ensure the notification belongs to the current patient
    if (notification.patientId !== patientId) {
      return res.status(403).json({ error: 'You can only update your own notifications.' });
    }

    // Mark as read
    store.notifications[notificationIndex] = {
      ...notification,
      read: true
    };

    res.status(200).json({
      message: 'Notification marked as read.',
      notification: store.notifications[notificationIndex]
    });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
