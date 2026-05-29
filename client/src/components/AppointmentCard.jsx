import React from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

export default function AppointmentCard({ appointment, onReschedule, onCancel }) {
  const doctor = appointment.doctor || {};
  const doctorName = doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || 'Doctor';

  function getInitials(name) {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatCreatedDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case 'upcoming':
      case 'confirmed':
      case 'scheduled':
        return 'badge-primary';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-primary';
    }
  }

  function getStatusLabel(status) {
    if (!status) return 'Upcoming';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const isUpcoming = ['upcoming', 'confirmed', 'scheduled'].includes(
    appointment.status?.toLowerCase()
  );

  return (
    <div className="appointment-card" style={{ animationDelay: `${(appointment._index || 0) * 0.08}s` }}>
      <div className="appointment-card-header">
        <div className="appointment-card-doctor">
          <div className="appointment-card-avatar">
            {getInitials(doctorName)}
          </div>
          <div className="appointment-card-doctor-info">
            <h4>{doctorName}</h4>
            <p>{doctor.specialty || doctor.specialization || 'Specialist'}</p>
          </div>
        </div>
        <span className={`badge ${getStatusClass(appointment.status)}`}>
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <div className="appointment-card-body">
        <div className="appointment-card-detail">
          <CalendarDays size={16} />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="appointment-card-detail">
          <Clock size={16} />
          <span>{appointment.time || appointment.slot || 'N/A'}</span>
        </div>
        {(doctor.location || doctor.city) && (
          <div className="appointment-card-detail">
            <MapPin size={16} />
            <span>{doctor.location || doctor.city}</span>
          </div>
        )}
      </div>

      {appointment.reason && (
        <div className="appointment-card-reason">
          {appointment.reason}
        </div>
      )}

      <div className="appointment-card-footer">
        <span className="appointment-card-date">
          Booked: {formatCreatedDate(appointment.createdAt)}
        </span>
        {isUpcoming && (
          <div className="appointment-card-actions">
            {onReschedule && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onReschedule(appointment)}
              >
                Reschedule
              </button>
            )}
            {onCancel && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onCancel(appointment)}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
