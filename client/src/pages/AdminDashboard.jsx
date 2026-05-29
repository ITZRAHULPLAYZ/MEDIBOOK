import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { getAnalytics, getAdminAppointments } from '../services/api';

function AnimatedNumber({ target, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;
    const duration = 1500;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    setTimeout(() => requestAnimationFrame(step), delay);
  }, [target, delay]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [analyticsRes, apptRes] = await Promise.allSettled([
          getAnalytics(),
          getAdminAppointments({ limit: 5 }),
        ]);

        if (analyticsRes.status === 'fulfilled') {
          setAnalytics(analyticsRes.value.data.analytics || analyticsRes.value.data);
        }

        if (apptRes.status === 'fulfilled') {
          const data = apptRes.value.data.appointments || apptRes.value.data || [];
          setRecentAppointments(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch (err) {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = analytics || {
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    revenue: 0,
    specialtyBreakdown: [],
  };

  const specialties = stats.specialtyBreakdown || stats.specialties || [];
  const maxSpecialtyCount = Math.max(...specialties.map((s) => s.count || 0), 1);

  function getStatusBadge(status) {
    const s = status?.toLowerCase();
    if (['upcoming', 'confirmed', 'scheduled'].includes(s)) return 'badge-primary';
    if (s === 'completed') return 'badge-success';
    if (s === 'cancelled') return 'badge-error';
    return 'badge-primary';
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="skeleton" style={{ height: 40, width: 300, marginBottom: 24, borderRadius: 8 }} />
          <div className="admin-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 130, borderRadius: 16 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin <span className="gradient-text">Dashboard</span></h1>
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

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="admin-stat-card-icon" style={{ background: 'var(--info-bg)' }}>👨‍⚕️</div>
            <div className="admin-stat-card-value">
              <AnimatedNumber target={stats.totalDoctors || 0} delay={100} />
            </div>
            <div className="admin-stat-card-label">Total Doctors</div>
          </div>
          <div className="admin-stat-card" style={{ animationDelay: '0.2s' }}>
            <div className="admin-stat-card-icon" style={{ background: 'var(--success-bg)' }}>👥</div>
            <div className="admin-stat-card-value">
              <AnimatedNumber target={stats.totalPatients || 0} delay={200} />
            </div>
            <div className="admin-stat-card-label">Total Patients</div>
          </div>
          <div className="admin-stat-card" style={{ animationDelay: '0.3s' }}>
            <div className="admin-stat-card-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>📅</div>
            <div className="admin-stat-card-value">
              <AnimatedNumber target={stats.totalAppointments || 0} delay={300} />
            </div>
            <div className="admin-stat-card-label">Total Appointments</div>
          </div>
          <div className="admin-stat-card" style={{ animationDelay: '0.4s' }}>
            <div className="admin-stat-card-icon" style={{ background: 'var(--warning-bg)' }}>💰</div>
            <div className="admin-stat-card-value">
              $<AnimatedNumber target={stats.revenue || 0} delay={400} />
            </div>
            <div className="admin-stat-card-label">Revenue Estimate</div>
          </div>
        </div>

        {/* Specialty Breakdown */}
        {specialties.length > 0 && (
          <div className="specialty-chart">
            <h3>Specialty Breakdown</h3>
            {specialties.map((spec) => (
              <div key={spec.name || spec._id} className="specialty-bar-item">
                <div className="specialty-bar-label">{spec.name || spec._id}</div>
                <div className="specialty-bar-track">
                  <div
                    className="specialty-bar-fill"
                    style={{ width: `${((spec.count || 0) / maxSpecialtyCount) * 100}%` }}
                  >
                    {spec.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Appointments Table */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>
            Recent Appointments
          </h3>

          {recentAppointments.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appt, i) => {
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 32 }}>
              <p style={{ color: 'var(--text-tertiary)' }}>No recent appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
