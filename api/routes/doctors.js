const express = require('express');
const { store } = require('../data/store');

const router = express.Router();

/**
 * GET /api/doctors
 * List all doctors with optional filtering.
 * Query params: specialty, location, search (name)
 * Returns doctors without schedule details.
 */
router.get('/', (req, res) => {
  try {
    const { specialty, location, search } = req.query;
    let doctors = [...store.doctors];

    // Filter by specialty (case-insensitive partial match)
    if (specialty) {
      const specialtyLower = specialty.toLowerCase();
      doctors = doctors.filter((d) =>
        d.specialty.toLowerCase().includes(specialtyLower)
      );
    }

    // Filter by location (case-insensitive partial match)
    if (location) {
      const locationLower = location.toLowerCase();
      doctors = doctors.filter((d) =>
        d.location.toLowerCase().includes(locationLower)
      );
    }

    // Filter by name search (case-insensitive partial match)
    if (search) {
      const searchLower = search.toLowerCase();
      doctors = doctors.filter((d) =>
        d.name.toLowerCase().includes(searchLower)
      );
    }

    // Return doctors without schedule details for list view
    const doctorsWithoutSchedule = doctors.map(({ schedule, ...rest }) => rest);

    res.status(200).json({
      count: doctorsWithoutSchedule.length,
      doctors: doctorsWithoutSchedule
    });
  } catch (err) {
    console.error('List doctors error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/doctors/:id
 * Get a single doctor with full details including schedule.
 */
router.get('/:id', (req, res) => {
  try {
    const doctor = store.doctors.find((d) => d.id === req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    res.status(200).json({ doctor });
  } catch (err) {
    console.error('Get doctor error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/doctors/:id/slots
 * Get available time slots for a doctor on a specific date.
 * Query param: date (YYYY-MM-DD format)
 * Returns available slots (doctor schedule minus already-booked appointments).
 */
router.get('/:id/slots', (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD).' });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const doctor = store.doctors.find((d) => d.id === req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Calculate day of week from the date
    const dateObj = new Date(date + 'T00:00:00');
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = daysOfWeek[dateObj.getUTCDay()];

    // Get doctor's schedule for that day
    const daySchedule = doctor.schedule[dayName];

    if (!daySchedule || daySchedule.length === 0) {
      return res.status(200).json({
        doctorId: doctor.id,
        doctorName: doctor.name,
        date,
        dayOfWeek: dayName,
        availableSlots: [],
        message: 'Doctor is not available on this day.'
      });
    }

    // Find already-booked appointments for this doctor on this date
    const bookedSlots = store.appointments
      .filter(
        (apt) =>
          apt.doctorId === doctor.id &&
          apt.date === date &&
          apt.status !== 'cancelled'
      )
      .map((apt) => apt.time);

    // Calculate available slots
    const availableSlots = daySchedule.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json({
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      dayOfWeek: dayName,
      totalSlots: daySchedule.length,
      bookedSlots: bookedSlots.length,
      availableSlots
    });
  } catch (err) {
    console.error('Get slots error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
