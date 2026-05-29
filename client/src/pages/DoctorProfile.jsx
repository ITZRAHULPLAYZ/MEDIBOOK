import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Calendar from '../components/Calendar';
import SlotPicker from '../components/SlotPicker';
import { getDoctor, getDoctorSlots, bookAppointment } from '../services/api';
import { MapPin, Clock, CircleDollarSign, CalendarDays } from 'lucide-react';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useApp();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    async function fetchDoctor() {
      setLoading(true);
      try {
        const res = await getDoctor(id);
        setDoctor(res.data.doctor || res.data);
      } catch (err) {
        addToast('Failed to load doctor profile', 'error');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id, navigate, addToast]);

  useEffect(() => {
    if (!selectedDate || !id) return;
    async function fetchSlots() {
      setSlotsLoading(true);
      setSelectedSlot('');
      try {
        const res = await getDoctorSlots(id, selectedDate);
        const data = res.data.availableSlots || res.data.slots || res.data || [];
        setSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDate, id]);

  async function handleBooking() {
    if (!selectedDate || !selectedSlot || !reason.trim()) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }
    setBooking(true);
    try {
      await bookAppointment({
        doctor: id,
        doctorId: id,
        date: selectedDate,
        time: selectedSlot,
        slot: selectedSlot,
        reason: reason.trim(),
        notes: notes.trim(),
      });
      addToast('Appointment booked successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment';
      addToast(msg, 'error');
    } finally {
      setBooking(false);
    }
  }

  function getInitials(name) {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function renderStars(rating) {
    const r = rating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= Math.round(r) ? 'var(--warning)' : 'var(--text-tertiary)' }}>
          ★
        </span>
      );
    }
    return stars;
  }

  if (loading) {
    return (
      <div className="doctor-profile-page">
        <div className="container">
          <div className="skeleton" style={{ height: 200, borderRadius: 24, marginBottom: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
            <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  const fullName = doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();

  return (
    <div className="doctor-profile-page">
      <div className="container">
        {/* Doctor Profile Hero */}
        <div className="doctor-profile-hero">
          <div className="doctor-profile-avatar">
            {getInitials(fullName)}
          </div>
          <div className="doctor-profile-info">
            <h1>{fullName}</h1>
            <span className="badge badge-primary" style={{ fontSize: '0.875rem' }}>
              {doctor.specialty || doctor.specialization || 'Specialist'}
            </span>
            <div className="doctor-profile-meta">
              <div className="doctor-profile-meta-item">
                <span>{renderStars(doctor.rating)}</span>
                <span style={{ fontWeight: 700 }}>
                  {(doctor.rating || 0).toFixed(1)}
                </span>
              </div>
              <div className="doctor-profile-meta-item">
                <span>🏥</span>
                <span>{doctor.hospital || doctor.clinic || 'Private Practice'}</span>
              </div>
              <div className="doctor-profile-meta-item">
                <MapPin size={16} />
                <span>{doctor.location || doctor.city || 'Not specified'}</span>
              </div>
              <div className="doctor-profile-meta-item">
                <Clock size={16} />
                <span>{doctor.experience || 0} years experience</span>
              </div>
              <div className="doctor-profile-meta-item">
                <CircleDollarSign size={16} />
                <span>${doctor.fee || doctor.consultationFee || 0} consultation fee</span>
              </div>
            </div>
            {doctor.bio && (
              <p className="doctor-profile-bio">{doctor.bio}</p>
            )}
          </div>
        </div>

        {/* Booking Section */}
        <h2 className="booking-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarDays size={24} color="#0066ff" /> Book an Appointment
        </h2>

        {!isAuthenticated ? (
          <div className="card-static" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3 style={{ marginBottom: 8 }}>Login to Book an Appointment</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              You need to be logged in to book an appointment with this doctor.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/login')}
            >
              Login to Book
            </button>
          </div>
        ) : (
          <div className="booking-section">
            <div>
              <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>
                Select a Date
              </h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            <div>
              <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>
                {selectedDate ? 'Select a Time Slot' : 'Choose a date first'}
              </h3>

              {selectedDate ? (
                <>
                  <SlotPicker
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    loading={slotsLoading}
                  />

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
                          placeholder="Any additional information for the doctor..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="booking-summary">
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Doctor</span>
                          <span className="booking-summary-value">{fullName}</span>
                        </div>
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Date</span>
                          <span className="booking-summary-value">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Time</span>
                          <span className="booking-summary-value">{selectedSlot}</span>
                        </div>
                        <div className="booking-summary-row">
                          <span className="booking-summary-label">Fee</span>
                          <span className="booking-summary-value">
                            ${doctor.fee || doctor.consultationFee || 0}
                          </span>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-lg btn-full"
                        style={{ marginTop: 20 }}
                        disabled={!reason.trim() || booking}
                        onClick={handleBooking}
                      >
                        {booking ? (
                          <>
                            <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />
                            Booking...
                          </>
                        ) : (
                          'Confirm Booking'
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="card-static"
                  style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)' }}
                >
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
