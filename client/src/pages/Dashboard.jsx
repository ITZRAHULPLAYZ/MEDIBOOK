// Dashboard.jsx — The user's personal dashboard.
//
// Props from App.jsx:
//   user         — the logged-in user object (name, email, etc.)
//   appointments — the list of appointments booked this session
//
// What this page shows:
//   1. A welcome message
//   2. Stats: how many appointments total, upcoming, completed
//   3. The list of appointments (each one as a simple card)
//   4. A "Find a Doctor" button if no appointments yet
//
// Appointments reset when you refresh — they live in App's state, not localStorage.
// That's intentional: no backend = no permanent storage needed.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, CalendarDays, CheckCircle, Search, Calendar, Clock, FileText } from 'lucide-react';

export default function Dashboard({ user, appointments }) {
  const navigate = useNavigate();

  // Count how many appointments are in each category
  const upcoming  = appointments.filter((a) => a.status === 'Upcoming').length;
  const completed = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* ── Welcome message ─────────────────────────────── */}
        <div className="dashboard-welcome">
          <h1>
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>
          </h1>
          <p>Here&apos;s an overview of your appointments</p>
        </div>

        {/* ── Stats row ───────────────────────────────────── */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon total"><ClipboardList size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon upcoming"><CalendarDays size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{upcoming}</h3>
              <p>Upcoming</p>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon completed"><CheckCircle size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* ── Appointments list ───────────────────────────── */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Your Appointments</h2>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          ) : (
            // Empty state — shown when no appointments have been booked
            <div className="empty-state">
              <div className="empty-state-icon"><CalendarDays size={48} color="#3a3532" /></div>
              <h3>No appointments yet</h3>
              <p>Book an appointment with a doctor to get started</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => navigate('/doctors')}
              >
                Find a Doctor
              </button>
            </div>
          )}
        </div>

        {/* ── Quick actions ───────────────────────────────── */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => navigate('/doctors')}>
              <Search size={16} style={{ marginRight: 6 }} /> Find a Doctor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AppointmentCard — a small card showing one appointment's details.
// Defined in the same file to keep things simple.
// ─────────────────────────────────────────────────────────────────
function AppointmentCard({ appointment }) {
  const { doctor, date, time, reason, status } = appointment;

  // Format the date nicely e.g. "Monday, June 15, 2025"
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  // Dark grey for upcoming, green for completed
  const statusColor = status === 'Upcoming' ? '#3a3532' : '#1a7a4a';

  return (
    <div className="card-static" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>

      {/* Doctor avatar + info */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, background: '#3a3532', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
          {doctor.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <p style={{ fontWeight: 700, marginBottom: 2 }}>{doctor.name}</p>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>{doctor.specialty}</p>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Calendar size={13} style={{ verticalAlign: 'middle' }} /> {formattedDate} &nbsp;
            <Clock size={13} style={{ verticalAlign: 'middle', marginLeft: 8 }} /> {time}
          </p>
          {reason && (
            <p style={{ color: '#888', fontSize: '0.8rem', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <FileText size={13} style={{ verticalAlign: 'middle' }} /> {reason}
            </p>
          )}
        </div>
      </div>

      {/* Status badge */}
      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: statusColor + '22', color: statusColor, whiteSpace: 'nowrap' }}>
        {status}
      </span>
    </div>
  );
}
