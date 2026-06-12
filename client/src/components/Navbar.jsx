// Navbar.jsx — The top navigation bar shown on every page.
//
// Props received from App.jsx:
//   user      — the logged-in user object (or null if not logged in)
//   onLogout  — function to call when user clicks "Logout"

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/');
  }

  // Returns the first letter(s) of the user's name for the avatar circle
  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ flexWrap: 'wrap', gap: '12px' }}>
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} />
          </div>
          <span>MediBook</span>
        </Link>

        {/* Navigation Links and Login Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
              Find Doctors
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
                Dashboard
              </NavLink>
            )}
          </div>

          <div className="navbar-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="navbar-user">
                  <div className="navbar-user-avatar">{getInitials(user.name)}</div>
                  <span className="navbar-user-name">{user.name.split(' ')[0]}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
