const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

/**
 * GET /api/admin/doctors
 * Get all doctors (admin view).
 */
router.get('/doctors', (req, res) => {
  try {
    res.status(200).json({
      count: store.doctors.length,
      doctors: store.doctors
    });
  } catch (err) {
    console.error('Admin get doctors error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/admin/doctors
 * Add a new doctor.
 * Body: { name, specialty, location, hospital, experience, rating, fee, bio, schedule }
 */
router.post('/doctors', (req, res) => {
  try {
    const { name, specialty, location, hospital, experience, rating, fee, bio, schedule } = req.body;

    // Validate required fields
    if (!name || !specialty || !location || !hospital) {
      return res.status(400).json({ error: 'Name, specialty, location, and hospital are required.' });
    }

    if (experience === undefined || fee === undefined) {
      return res.status(400).json({ error: 'Experience and fee are required.' });
    }

    const newDoctor = {
      id: uuidv4(),
      name,
      specialty,
      location,
      hospital,
      experience: Number(experience),
      rating: rating !== undefined ? Number(rating) : 0,
      fee: Number(fee),
      bio: bio || '',
      schedule: schedule || {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
      }
    };

    store.doctors.push(newDoctor);

    res.status(201).json({
      message: 'Doctor added successfully.',
      doctor: newDoctor
    });
  } catch (err) {
    console.error('Admin add doctor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/admin/doctors/:id
 * Update doctor fields.
 */
router.put('/doctors/:id', (req, res) => {
  try {
    const doctorIndex = store.doctors.findIndex((d) => d.id === req.params.id);

    if (doctorIndex === -1) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const doctor = store.doctors[doctorIndex];
    const { name, specialty, location, hospital, experience, rating, fee, bio, schedule } = req.body;

    // Update only provided fields
    if (name !== undefined) doctor.name = name;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (location !== undefined) doctor.location = location;
    if (hospital !== undefined) doctor.hospital = hospital;
    if (experience !== undefined) doctor.experience = Number(experience);
    if (rating !== undefined) doctor.rating = Number(rating);
    if (fee !== undefined) doctor.fee = Number(fee);
    if (bio !== undefined) doctor.bio = bio;
    if (schedule !== undefined) doctor.schedule = schedule;

    store.doctors[doctorIndex] = doctor;

    res.status(200).json({
      message: 'Doctor updated successfully.',
      doctor
    });
  } catch (err) {
    console.error('Admin update doctor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * DELETE /api/admin/doctors/:id
 * Remove a doctor from the store.
 */
router.delete('/doctors/:id', (req, res) => {
  try {
    const doctorIndex = store.doctors.findIndex((d) => d.id === req.params.id);

    if (doctorIndex === -1) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const removedDoctor = store.doctors.splice(doctorIndex, 1)[0];

    res.status(200).json({
      message: 'Doctor removed successfully.',
      doctor: removedDoctor
    });
  } catch (err) {
    console.error('Admin delete doctor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/admin/appointments
 * Get all appointments in the system with patient and doctor names populated.
 */
router.get('/appointments', (req, res) => {
  try {
    const appointments = store.appointments.map((apt) => {
      const doctor = store.doctors.find((d) => d.id === apt.doctorId);
      const patient = store.patients.find((p) => p.id === apt.patientId);

      return {
        ...apt,
        doctorName: doctor ? doctor.name : 'Unknown Doctor',
        doctorSpecialty: doctor ? doctor.specialty : 'Unknown',
        patientName: patient ? patient.name : 'Unknown Patient',
        patientEmail: patient ? patient.email : 'Unknown'
      };
    });

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (err) {
    console.error('Admin get appointments error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/admin/analytics
 * Get system analytics and statistics.
 */
router.get('/analytics', (req, res) => {
  try {
    const totalDoctors = store.doctors.length;
    const totalPatients = store.patients.length;
    const totalAppointments = store.appointments.length;

    const upcomingAppointments = store.appointments.filter(
      (apt) => apt.status === 'upcoming'
    ).length;

    const completedAppointments = store.appointments.filter(
      (apt) => apt.status === 'completed'
    ).length;

    const cancelledAppointments = store.appointments.filter(
      (apt) => apt.status === 'cancelled'
    ).length;

    // Specialty breakdown
    const specialtyMap = {};
    store.doctors.forEach((doctor) => {
      if (specialtyMap[doctor.specialty]) {
        specialtyMap[doctor.specialty]++;
      } else {
        specialtyMap[doctor.specialty] = 1;
      }
    });

    const specialties = Object.entries(specialtyMap).map(([name, count]) => ({
      name,
      count
    }));

    // Recent appointments (last 5, sorted by createdAt desc)
    const recentAppointments = [...store.appointments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((apt) => {
        const doctor = store.doctors.find((d) => d.id === apt.doctorId);
        const patient = store.patients.find((p) => p.id === apt.patientId);
        return {
          ...apt,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          patientName: patient ? patient.name : 'Unknown Patient'
        };
      });

    res.status(200).json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      specialties,
      recentAppointments
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
