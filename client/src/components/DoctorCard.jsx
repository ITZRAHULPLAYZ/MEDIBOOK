// DoctorCard.jsx — A card showing a single doctor's summary.
//
// Props:
//   doctor  — a doctor object from data/doctors.js
//   onClick — function called when the card or button is clicked

import React from 'react';
import { MapPin } from 'lucide-react';

export default function DoctorCard({ doctor, onClick }) {
  // Turn "Sarah Johnson" → "SJ" for the avatar circle
  function getInitials(name) {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div
      className="doctor-card"
      onClick={() => onClick && onClick(doctor)}
    >
      <div className="doctor-card-header">
        <div className="doctor-card-avatar">{getInitials(doctor.name)}</div>
        <div className="doctor-card-info">
          <h3>{doctor.name}</h3>
          <span className="badge badge-primary doctor-card-specialty">
            {doctor.specialty}
          </span>
          <div className="doctor-card-location">
            <MapPin size={16} />
            <span>{doctor.location}</span>
          </div>
        </div>
      </div>

      <div className="doctor-card-stats">
        <div className="doctor-card-stat">
          <span className="doctor-card-rating" style={{ color: '#f59e0b', fontWeight: 600 }}>
            ★ {doctor.rating.toFixed(1)}
          </span>
          <span className="doctor-card-stat-label">Rating</span>
        </div>
        <div className="doctor-card-stat">
          <span className="doctor-card-stat-value">{doctor.experience} yrs</span>
          <span className="doctor-card-stat-label">Experience</span>
        </div>
        <div className="doctor-card-stat">
          <span className="doctor-card-stat-value">${doctor.fee}</span>
          <span className="doctor-card-stat-label">Fee</span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation(); // prevent double-firing the card's onClick
            onClick && onClick(doctor);
          }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
