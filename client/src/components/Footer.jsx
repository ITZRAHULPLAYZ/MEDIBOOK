import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">
              <span style={{
                width: 32,
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#3a3532',
                borderRadius: 8,
                fontSize: 16,
                color: 'white',
              }}>
                <Activity size={20} />
              </span>
              <span>MediBook</span>
            </div>
            <p className="footer-brand-desc">
              Your trusted platform for booking doctor appointments online.
              Find top specialists, check availability, and schedule
              consultations with ease.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-col-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Specialties</h4>
            <ul className="footer-col-links">
              <li><Link to="/doctors?specialty=Cardiology">Cardiology</Link></li>
              <li><Link to="/doctors?specialty=Dermatology">Dermatology</Link></li>
              <li><Link to="/doctors?specialty=Orthopedics">Orthopedics</Link></li>
              <li><Link to="/doctors?specialty=Pediatrics">Pediatrics</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} MediBook. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">⌘</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
