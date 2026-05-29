import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import Calendar from '../components/Calendar';
import SlotPicker from '../components/SlotPicker';
import {
  getAppointmentHistory,
  rescheduleAppointment,
  cancelAppointment,
  getDoctorSlots,
} from '../services/api';
import { ClipboardList } from 'lucide-react';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function BookingHistory() {
  const { addToast } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Reschedule state
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Cancel state
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAppointmentHistory();
      const data = res.data.appointments || res.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'all') return true;
    const status = appt.status?.toLowerCase();
    if (activeTab === 'upcoming') {
      return ['upcoming', 'confirmed', 'scheduled'].includes(status);
    }
    return status === activeTab;
  });

  const tabCounts = {
    all: appointments.length,
    upcoming: appointments.filter((a) =>
      ['upcoming', 'confirmed', 'scheduled'].includes(a.status?.toLowerCase())
    ).length,
    completed: appointments.filter((a) => a.status?.toLowerCase() === 'completed').length,
    cancelled: appointments.filter((a) => a.status?.toLowerCase() === 'cancelled').length,
  };

  // Reschedule
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
      addToast('Appointment rescheduled', 'success');
      setRescheduleModal(false);
      fetchHistory();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reschedule', 'error');
    } finally {
      setRescheduling(false);
    }
  }

  // Cancel
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
      fetchHistory();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel', 'error');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="history-page">
      <div className="container">
        <h1>Booking History</h1>

        <div className="history-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`history-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="history-tab-count">{tabCounts[tab.key]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="appointments-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16, marginBottom: 16 }} />
            ))}
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="appointments-list">
            {filteredAppointments.map((appt, i) => (
              <AppointmentCard
                key={appt._id || i}
                appointment={{ ...appt, _index: i }}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <div className="history-empty-icon"><ClipboardList size={48} color="#0066ff" opacity={0.5} /></div>
            <h3>
              {activeTab === 'all'
                ? 'No appointments yet'
                : `No ${activeTab} appointments`}
            </h3>
            <p>
              {activeTab === 'all'
                ? 'Book your first appointment to see it here'
                : `You don't have any ${activeTab} appointments`}
            </p>
          </div>
        )}
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
          Are you sure you want to cancel this appointment?
        </p>
      </Modal>
    </div>
  );
}
