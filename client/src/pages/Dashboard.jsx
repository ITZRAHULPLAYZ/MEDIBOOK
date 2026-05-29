import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import AppointmentCard from '../components/AppointmentCard';
import Calendar from '../components/Calendar';
import SlotPicker from '../components/SlotPicker';
import Modal from '../components/Modal';
import {
  getAppointments,
  getAppointmentHistory,
  getNotifications,
  markNotificationRead,
  rescheduleAppointment,
  cancelAppointment,
  getDoctorSlots,
} from '../services/api';
import { ClipboardList, CalendarDays, CheckCircle, XCircle, Bell, Search, User } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule modal state
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Cancel modal state
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, historyRes, notifRes] = await Promise.allSettled([
        getAppointments(),
        getAppointmentHistory(),
        getNotifications(),
      ]);

      if (apptRes.status === 'fulfilled') {
        const data = apptRes.value.data.appointments || apptRes.value.data || [];
        setAppointments(Array.isArray(data) ? data : []);
      }

      if (historyRes.status === 'fulfilled') {
        const data = historyRes.value.data.appointments || historyRes.value.data || [];
        setAllAppointments(Array.isArray(data) ? data : []);
      }

      if (notifRes.status === 'fulfilled') {
        const data = notifRes.value.data.notifications || notifRes.value.data || [];
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Stats
  const stats = {
    total: allAppointments.length || appointments.length,
    upcoming: allAppointments.filter((a) =>
      ['upcoming', 'confirmed', 'scheduled'].includes(a.status?.toLowerCase())
    ).length || appointments.length,
    completed: allAppointments.filter((a) => a.status?.toLowerCase() === 'completed').length,
    cancelled: allAppointments.filter((a) => a.status?.toLowerCase() === 'cancelled').length,
  };

  // Reschedule flow
  function handleReschedule(appointment) {
    setRescheduleTarget(appointment);
    setRescheduleDate('');
    setRescheduleSlots([]);
    setRescheduleSlot('');
    setRescheduleModal(true);
  }

  useEffect(() => {
    if (!rescheduleDate || !rescheduleTarget) return;
    const doctorId = rescheduleTarget.doctor?._id || rescheduleTarget.doctorId || rescheduleTarget.doctor;
    async function fetchSlots() {
      setRescheduleSlotsLoading(true);
      try {
        const res = await getDoctorSlots(doctorId, rescheduleDate);
        setRescheduleSlots(res.data.slots || res.data || []);
      } catch (err) {
        setRescheduleSlots([]);
      } finally {
        setRescheduleSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [rescheduleDate, rescheduleTarget]);

  async function confirmReschedule() {
    if (!rescheduleDate || !rescheduleSlot) {
      addToast('Please select a date and time slot', 'warning');
      return;
    }
    setRescheduling(true);
    try {
      await rescheduleAppointment(rescheduleTarget._id, {
        date: rescheduleDate,
        time: rescheduleSlot,
        slot: rescheduleSlot,
      });
      addToast('Appointment rescheduled successfully', 'success');
      setRescheduleModal(false);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reschedule', 'error');
    } finally {
      setRescheduling(false);
    }
  }

  // Cancel flow
  function handleCancel(appointment) {
    setCancelTarget(appointment);
    setCancelModal(true);
  }

  async function confirmCancel() {
    setCancelling(true);
    try {
      await cancelAppointment(cancelTarget._id);
      addToast('Appointment cancelled', 'success');
      setCancelModal(false);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel', 'error');
    } finally {
      setCancelling(false);
    }
  }

  async function handleNotificationClick(notif) {
    if (!notif.read) {
      try {
        await markNotificationRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      } catch (err) {
        // silently handle
      }
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="skeleton" style={{ height: 40, width: 300, marginBottom: 32, borderRadius: 8 }} />
          <div className="dashboard-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 150, borderRadius: 16, marginBottom: 16 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome */}
        <div className="dashboard-welcome">
          <h1>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p>Here&apos;s an overview of your appointments</p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="dashboard-stat-icon total"><ClipboardList size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{stats.total}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="dashboard-stat-card" style={{ animationDelay: '0.2s' }}>
            <div className="dashboard-stat-icon upcoming"><CalendarDays size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{stats.upcoming}</h3>
              <p>Upcoming</p>
            </div>
          </div>
          <div className="dashboard-stat-card" style={{ animationDelay: '0.3s' }}>
            <div className="dashboard-stat-icon completed"><CheckCircle size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="dashboard-stat-card" style={{ animationDelay: '0.4s' }}>
            <div className="dashboard-stat-icon cancelled"><XCircle size={24} /></div>
            <div className="dashboard-stat-info">
              <h3>{stats.cancelled}</h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Upcoming Appointments</h2>
            <Link to="/history" className="btn btn-ghost btn-sm">
              View All →
            </Link>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appt, i) => (
                <AppointmentCard
                  key={appt._id || i}
                  appointment={{ ...appt, _index: i }}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><CalendarDays size={48} color="#0066ff" /></div>
              <h3>No upcoming appointments</h3>
              <p>Book an appointment with a doctor to get started</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/doctors')}
                style={{ marginTop: 16 }}
              >
                Find a Doctor
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Notifications</h2>
          </div>

          {notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.slice(0, 5).map((notif, i) => (
                <div
                  key={notif._id || i}
                  className={`notification-item${notif.read ? '' : ' unread'}`}
                  onClick={() => handleNotificationClick(notif)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notification-item-icon"><Bell size={20} /></div>
                  <div className="notification-item-content">
                    <p className="notification-item-message">{notif.message}</p>
                    <p className="notification-item-time">
                      {notif.createdAt
                        ? new Date(notif.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <p style={{ color: 'var(--text-tertiary)' }}>No notifications yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => navigate('/doctors')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={16} /> Find a Doctor
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/history')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={16} /> View History
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> My Profile
            </button>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModal}
        onClose={() => setRescheduleModal(false)}
        title="Reschedule Appointment"
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setRescheduleModal(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={confirmReschedule}
              disabled={!rescheduleDate || !rescheduleSlot || rescheduling}
            >
              {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.875rem' }}>
          Select a new date and time for your appointment
        </p>
        <Calendar selectedDate={rescheduleDate} onDateSelect={setRescheduleDate} />
        {rescheduleDate && (
          <div style={{ marginTop: 16 }}>
            <SlotPicker
              slots={rescheduleSlots}
              selectedSlot={rescheduleSlot}
              onSlotSelect={setRescheduleSlot}
              loading={rescheduleSlotsLoading}
            />
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Cancel Appointment"
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setCancelModal(false)}>
              Keep Appointment
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Are you sure you want to cancel this appointment? This action cannot be undone.
        </p>
        {cancelTarget && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--glass)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              {cancelTarget.doctor?.name || 'Doctor'}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {cancelTarget.date && new Date(cancelTarget.date).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}{' '}
              at {cancelTarget.time || cancelTarget.slot}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
