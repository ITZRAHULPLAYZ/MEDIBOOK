const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { store } = require('../data/store');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All appointment routes require authentication
router.use(authenticate);

/**
 * POST /api/appointments
 * Book a new appointment.
 * Body: { doctorId, date, time, reason, notes }
 */
router.post('/', (req, res) => {
  try {
    const { doctorId, date, time, reason, notes } = req.body;
    const patientId = req.user.id;

    // Validate required fields
    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'Doctor ID, date, and time are required.' });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Validate the doctor exists
    const doctor = store.doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Check that the date is not in the past
    const appointmentDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ error: 'Cannot book an appointment in the past.' });
    }

    // Check that the time slot exists in the doctor's schedule for that day
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = daysOfWeek[appointmentDate.getUTCDay()];
    const daySchedule = doctor.schedule[dayName];

    if (!daySchedule || !daySchedule.includes(time)) {
      return res.status(400).json({ error: 'This time slot is not available in the doctor\'s schedule.' });
    }

    // Check if the slot is already booked
    const isSlotBooked = store.appointments.some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.time === time &&
        apt.status !== 'cancelled'
    );

    if (isSlotBooked) {
      return res.status(409).json({ error: 'This time slot is already booked. Please choose another slot.' });
    }

    // Check if the patient already has an appointment at the same date and time
    const hasConflict = store.appointments.some(
      (apt) =>
        apt.patientId === patientId &&
        apt.date === date &&
        apt.time === time &&
        apt.status !== 'cancelled'
    );

    if (hasConflict) {
      return res.status(409).json({ error: 'You already have an appointment at this date and time.' });
    }

    // Create the appointment
    const newAppointment = {
      id: uuidv4(),
      patientId,
      doctorId,
      date,
      time,
      reason: reason || '',
      notes: notes || '',
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    store.appointments.push(newAppointment);

    // Create notification for the patient
    const notification = {
      id: uuidv4(),
      patientId,
      message: `Your appointment with ${doctor.name} on ${date} at ${time} has been confirmed.`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString()
    };

    store.notifications.push(notification);

    res.status(201).json({
      message: 'Appointment booked successfully.',
      appointment: newAppointment
    });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/appointments
 * Get current patient's upcoming appointments, sorted by date ascending.
 */
router.get('/', (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = store.appointments
      .filter((apt) => apt.patientId === patientId && apt.status === 'upcoming')
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      })
      .map((apt) => {
        const doctor = store.doctors.find((d) => d.id === apt.doctorId);
        return {
          ...apt,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          doctorSpecialty: doctor ? doctor.specialty : 'Unknown',
          doctorLocation: doctor ? doctor.location : 'Unknown',
          doctorFee: doctor ? doctor.fee : 0
        };
      });

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/appointments/history
 * Get all of the current patient's appointments (all statuses), sorted by date descending.
 */
router.get('/history', (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = store.appointments
      .filter((apt) => apt.patientId === patientId)
      .sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      })
      .map((apt) => {
        const doctor = store.doctors.find((d) => d.id === apt.doctorId);
        return {
          ...apt,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          doctorSpecialty: doctor ? doctor.specialty : 'Unknown',
          doctorLocation: doctor ? doctor.location : 'Unknown',
          doctorFee: doctor ? doctor.fee : 0
        };
      });

    res.status(200).json({
      count: appointments.length,
      appointments
    });
  } catch (err) {
    console.error('Get appointment history error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * PUT /api/appointments/:id
 * Reschedule an appointment.
 * Body: { date, time }
 */
router.put('/:id', (req, res) => {
  try {
    const appointmentId = req.params.id;
    const patientId = req.user.id;
    const { date, time } = req.body;

    // Validate required fields
    if (!date || !time) {
      return res.status(400).json({ error: 'New date and time are required.' });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Find the appointment
    const appointmentIndex = store.appointments.findIndex((apt) => apt.id === appointmentId);
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const appointment = store.appointments[appointmentIndex];

    // Validate ownership
    if (appointment.patientId !== patientId) {
      return res.status(403).json({ error: 'You can only reschedule your own appointments.' });
    }

    // Can only reschedule upcoming appointments
    if (appointment.status !== 'upcoming') {
      return res.status(400).json({ error: 'Only upcoming appointments can be rescheduled.' });
    }

    // Check that the date is not in the past
    const appointmentDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ error: 'Cannot reschedule to a past date.' });
    }

    // Validate the doctor's availability for the new slot
    const doctor = store.doctors.find((d) => d.id === appointment.doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = daysOfWeek[appointmentDate.getUTCDay()];
    const daySchedule = doctor.schedule[dayName];

    if (!daySchedule || !daySchedule.includes(time)) {
      return res.status(400).json({ error: 'This time slot is not available in the doctor\'s schedule.' });
    }

    // Check if the new slot is already booked (excluding current appointment)
    const isSlotBooked = store.appointments.some(
      (apt) =>
        apt.id !== appointmentId &&
        apt.doctorId === appointment.doctorId &&
        apt.date === date &&
        apt.time === time &&
        apt.status !== 'cancelled'
    );

    if (isSlotBooked) {
      return res.status(409).json({ error: 'The new time slot is already booked. Please choose another slot.' });
    }

    // Store old date/time for notification
    const oldDate = appointment.date;
    const oldTime = appointment.time;

    // Update the appointment
    store.appointments[appointmentIndex] = {
      ...appointment,
      date,
      time,
      updatedAt: new Date().toISOString()
    };

    // Create notification
    const notification = {
      id: uuidv4(),
      patientId,
      message: `Your appointment with ${doctor.name} has been rescheduled from ${oldDate} at ${oldTime} to ${date} at ${time}.`,
      type: 'reschedule',
      read: false,
      createdAt: new Date().toISOString()
    };

    store.notifications.push(notification);

    res.status(200).json({
      message: 'Appointment rescheduled successfully.',
      appointment: store.appointments[appointmentIndex]
    });
  } catch (err) {
    console.error('Reschedule appointment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * DELETE /api/appointments/:id
 * Cancel an appointment.
 */
router.delete('/:id', (req, res) => {
  try {
    const appointmentId = req.params.id;
    const patientId = req.user.id;

    // Find the appointment
    const appointmentIndex = store.appointments.findIndex((apt) => apt.id === appointmentId);
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const appointment = store.appointments[appointmentIndex];

    // Validate ownership
    if (appointment.patientId !== patientId) {
      return res.status(403).json({ error: 'You can only cancel your own appointments.' });
    }

    // Can only cancel upcoming appointments
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ error: 'This appointment is already cancelled.' });
    }

    // Update status to cancelled
    store.appointments[appointmentIndex] = {
      ...appointment,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };

    // Create notification
    const doctor = store.doctors.find((d) => d.id === appointment.doctorId);
    const notification = {
      id: uuidv4(),
      patientId,
      message: `Your appointment with ${doctor ? doctor.name : 'the doctor'} on ${appointment.date} at ${appointment.time} has been cancelled.`,
      type: 'cancellation',
      read: false,
      createdAt: new Date().toISOString()
    };

    store.notifications.push(notification);

    res.status(200).json({
      message: 'Appointment cancelled successfully.',
      appointment: store.appointments[appointmentIndex]
    });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
