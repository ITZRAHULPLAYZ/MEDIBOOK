import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate('/');
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <div className="navbar-logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} /></div>
          <span className="gradient-text">MediBook</span>
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar-link${isActive ? ' active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `navbar-link${isActive ? ' active' : ''}`
            }
          >
            Find Doctors
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar-link${isActive ? ' active' : ''}`
              }
            >
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `navbar-link${isActive ? ' active' : ''}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="navbar-user">
                <div className="navbar-user-avatar">
                  {getInitials(user?.name)}
                </div>
                <span className="navbar-user-name">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className={`navbar-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`navbar-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" className="navbar-link" onClick={closeMobile}>
          Home
        </NavLink>
        <NavLink to="/doctors" className="navbar-link" onClick={closeMobile}>
          Find Doctors
        </NavLink>
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" className="navbar-link" onClick={closeMobile}>
              Dashboard
            </NavLink>
            <NavLink to="/history" className="navbar-link" onClick={closeMobile}>
              History
            </NavLink>
            <NavLink to="/profile" className="navbar-link" onClick={closeMobile}>
              Profile
            </NavLink>
          </>
        )}
        {isAdmin && (
          <NavLink to="/admin" className="navbar-link" onClick={closeMobile}>
            Admin
          </NavLink>
        )}
        {isAuthenticated ? (
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost" onClick={closeMobile}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" onClick={closeMobile}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
