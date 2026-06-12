// DoctorProfile.jsx — The page for a single doctor's details + booking.
//
// Props from App.jsx:
//   user    — logged-in user (or null)
//   onBook  — function to add the new appointment to App's state

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, CircleDollarSign, CalendarDays, CheckCircle2, GraduationCap, Globe } from 'lucide-react';
import DOCTORS, { TIME_SLOTS } from '../data/doctors';

export default function DoctorProfile({ user, onBook }) {
  const { id } = useParams();       // get the :id from the URL
  const navigate = useNavigate();

  // Find the doctor with the matching id
  const doctor = DOCTORS.find((d) => d.id === id);

  // Booking form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason,       setReason]       = useState('');
  const [notes,        setNotes]        = useState('');
  const [booked,       setBooked]       = useState(false); // shows a success message

  // If the doctor ID in the URL doesn't match anyone, show a simple message
  if (!doctor) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Doctor not found</h2>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/doctors')}>
          Back to Search
        </button>
      </div>
    );
  }

  // When a new date is picked, reset the slot selection
  function handleDateSelect(date) {
    setSelectedDate(date);
    setSelectedSlot('');
  }

  // Called when user clicks "Confirm Booking"
  function handleBooking() {
    if (!selectedDate || !selectedSlot || !reason.trim()) {
      alert('Please fill in all required fields (date, time slot, and reason).');
      return;
    }

    // Build the appointment object
    const appointment = {
      id: Date.now(),          // unique ID using current timestamp
      doctor: doctor,
      date: selectedDate,
      time: selectedSlot,
      reason: reason.trim(),
      notes: notes.trim(),
      status: 'Upcoming',
    };

    onBook(appointment);       // add it to App's appointments list
    setBooked(true);           // show success message
  }

  // Helper: turn "Sarah Johnson" → "SJ" for the avatar
  function getInitials(name) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // Helper: render rating as a star
  function renderStars(rating) {
    return <span style={{ color: 'var(--warning)', fontWeight: 600 }}>★ {rating.toFixed(1)}</span>;
  }

  // ── Show a success screen after booking ───────────────────
  if (booked) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <CheckCircle2 size={64} color="#1a7a4a" strokeWidth={1.5} style={{ margin: '0 auto 16px', display: 'block' }} />
        <h2 style={{ marginBottom: 8 }}>Appointment Booked!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Your appointment with <strong>{doctor.name}</strong> on{' '}
          <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>{' '}
          at <strong>{selectedSlot}</strong> is confirmed.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-profile-page">
      <div className="container">

        {/* ── Doctor info card ────────────────────────────── */}
        <div className="doctor-profile-hero">
          <div className="doctor-profile-avatar">{getInitials(doctor.name)}</div>
          <div className="doctor-profile-info">
            <h1>{doctor.name}</h1>
            <span className="badge badge-primary" style={{ marginBottom: 12 }}>
              {doctor.specialty}
            </span>

            <div className="doctor-profile-meta">
              <div className="doctor-profile-meta-item">
                <MapPin size={16} />
                <span>{doctor.location}</span>
              </div>
              <div className="doctor-profile-meta-item">
                {renderStars(doctor.rating)}
                <span style={{ color: 'var(--text-tertiary)' }}>({doctor.reviewCount} reviews)</span>
              </div>
              <div className="doctor-profile-meta-item">
                <Clock size={16} />
                <span>{doctor.experience} years experience</span>
              </div>
              <div className="doctor-profile-meta-item">
                <CircleDollarSign size={16} />
                <span>${doctor.fee} consultation fee</span>
              </div>
            </div>

            <p className="doctor-profile-bio">{doctor.bio}</p>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <GraduationCap size={16} style={{ verticalAlign: 'middle' }} /> {doctor.education}
              <span style={{ margin: '0 8px', color: 'var(--border-color)' }}>|</span>
              <Globe size={16} style={{ verticalAlign: 'middle' }} /> {doctor.languages.join(', ')}
            </p>
          </div>
        </div>

        {/* ── Booking section ─────────────────────────────── */}
        <h2 className="booking-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarDays size={24} color="#3a3532" /> Book an Appointment
        </h2>

        {/* If user is not logged in, show a prompt to login */}
        {!user ? (
          <div className="card-static" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3 style={{ marginBottom: 8 }}>Register to Book an Appointment</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              You need to create an account to book an appointment with this doctor.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Register to Book
            </button>
          </div>
        ) : (
          <div className="booking-section">

            {/* Left: Date picker */}
            <div>
              <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>Select a Date</h3>
              <input
                type="date"
                className="input"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                style={{ width: '100%', maxWidth: '300px' }}
              />
            </div>

            {/* Right: Time slot + reason form */}
            <div>
              <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>
                {selectedDate ? 'Select a Time Slot' : 'Choose a date first'}
              </h3>

              {selectedDate ? (
                <>
                  {/* Time slots buttons list */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`slot-btn${selectedSlot === slot ? ' selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* Show reason + notes form once a slot is picked */}
                  {selectedSlot && (
                    <div className="booking-form" style={{ marginTop: 24 }}>
                      <div className="form-group">
                        <label className="form-label">Reason for visit *</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., Regular checkup, headache, follow-up..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Additional Notes</label>
                        <textarea
                          className="textarea"
                          placeholder="Any extra info for the doctor..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* Booking summary */}
                      <div className="booking-summary">
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Doctor</span>
                          <span className="booking-summary-value">{doctor.name}</span>
                        </div>
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Date</span>
                          <span className="booking-summary-value">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Time</span>
                          <span className="booking-summary-value">{selectedSlot}</span>
                        </div>
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Fee</span>
                          <span className="booking-summary-value">${doctor.fee}</span>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-lg btn-full"
                        style={{ marginTop: 20 }}
                        disabled={!reason.trim()}
                        onClick={handleBooking}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="card-static" style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)' }}>
                  <div style={{ marginBottom: 16 }}><CalendarDays size={64} color="#9ca3af" /></div>
                  <p>Select a date from the calendar to view available slots</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
