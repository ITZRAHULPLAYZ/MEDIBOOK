import React from 'react';
import { MapPin, Star } from 'lucide-react';

export default function DoctorCard({ doctor, onClick }) {
  function getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function renderStars(rating) {
    const r = rating || 0;
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={`full-${i}`} size={14} fill="#f59e0b" color="#f59e0b" />);
    }
    if (half) stars.push(<Star key="half" size={14} color="#f59e0b" />);
    return <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>{stars}</span>;
  }

  const fullName = doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();

  return (
    <div
      className="doctor-card"
      onClick={() => onClick && onClick(doctor)}
      style={{ animationDelay: `${(doctor._index || 0) * 0.08}s` }}
    >
      <div className="doctor-card-header">
        <div className="doctor-card-avatar">
          {getInitials(fullName)}
        </div>
        <div className="doctor-card-info">
          <h3>{fullName}</h3>
          <span className="badge badge-primary doctor-card-specialty">
            {doctor.specialty || doctor.specialization || 'General'}
          </span>
          <div className="doctor-card-location">
            <MapPin size={16} />
            <span>{doctor.location || doctor.city || 'Not specified'}</span>
          </div>
        </div>
      </div>

      <div className="doctor-card-stats">
        <div className="doctor-card-stat">
          <span className="doctor-card-rating">
            {renderStars(doctor.rating)} {(doctor.rating || 0).toFixed(1)}
          </span>
          <span className="doctor-card-stat-label">Rating</span>
        </div>
        <div className="doctor-card-stat">
          <span className="doctor-card-stat-value">
            {doctor.experience || 0} yrs
          </span>
          <span className="doctor-card-stat-label">Experience</span>
        </div>
        <div className="doctor-card-stat">
          <span className="doctor-card-stat-value">
            ${doctor.fee || doctor.consultationFee || 0}
          </span>
          <span className="doctor-card-stat-label">Fee</span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(doctor);
          }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
