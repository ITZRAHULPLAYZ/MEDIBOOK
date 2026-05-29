import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { getAdminAppointments } from '../services/api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (doctorFilter) params.doctor = doctorFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await getAdminAppointments(params);
      const data = res.data.appointments || res.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, doctorFilter, dateFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  function getStatusBadge(status) {
    const s = status?.toLowerCase();
    if (['upcoming', 'confirmed', 'scheduled'].includes(s)) return 'badge-primary';
    if (s === 'completed') return 'badge-success';
    if (s === 'cancelled') return 'badge-error';
    return 'badge-primary';
  }

  // Extract unique doctor names for filter
  const doctorNames = [...new Set(
    appointments.map((a) => a.doctor?.name || a.doctorName || '').filter(Boolean)
  )];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>All <span className="gradient-text">Appointments</span></h1>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/doctors" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            Manage Doctors
          </NavLink>
          <NavLink to="/admin/appointments" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            All Appointments
          </NavLink>
        </nav>

        {/* Filters */}
        <div className="filter-row" style={{ marginBottom: 24 }}>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="select"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="">All Doctors</option>
            {doctorNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ maxWidth: 200, colorScheme: 'dark' }}
          />

          {(statusFilter || doctorFilter || dateFilter) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setStatusFilter('');
                setDoctorFilter('');
                setDateFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
        ) : appointments.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, i) => {
                  const patientName = appt.patient?.name || appt.patientName || 'Patient';
                  const doctorName = appt.doctor?.name || appt.doctorName || 'Doctor';
                  return (
                    <tr key={appt._id || i}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {patientName}
                      </td>
                      <td>{doctorName}</td>
                      <td>
                        {appt.date
                          ? new Date(appt.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                      <td>{appt.time || appt.slot || 'N/A'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(appt.status)}`}>
                          {appt.status
                            ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1)
                            : 'Pending'}
                        </span>
                      </td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {appt.reason || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No appointments found</h3>
            <p>
              {statusFilter || doctorFilter || dateFilter
                ? 'Try adjusting your filters'
                : 'No appointments have been booked yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
