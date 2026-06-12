// App.jsx — The main app file.
//
// This file does two things:
//   1. Keeps track of who is logged in (the "user" variable)
//   2. Decides which page to show based on the URL (routing)
//
// "user" is saved to localStorage so it stays even if you refresh.
// When the user logs out, we clear it.

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DoctorSearch from './pages/DoctorSearch';
import DoctorProfile from './pages/DoctorProfile';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  // ── Auth state ──────────────────────────────────────────────
  // Try to load a saved user from localStorage on first render.
  // If nothing is saved, user starts as null (not logged in).
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medibook_user');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Appointments state ───────────────────────────────────────
  // Appointments are stored in memory only.
  // They reset when you refresh — no backend needed!
  const [appointments, setAppointments] = useState([]);

  // Called from DoctorProfile when user books an appointment
  function handleBook(appointment) {
    setAppointments((prev) => [appointment, ...prev]);
  }



  // Called from Register page when registration succeeds
  function handleRegister(newUser) {
    localStorage.setItem('medibook_user', JSON.stringify(newUser));
    setUser(newUser);
  }

  // Called from Navbar logout button
  function handleLogout() {
    localStorage.removeItem('medibook_user');
    setUser(null);
  }

  return (
    <>
      {/* Navbar is shown on every page */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="page-content">
        <Routes>
          {/* Public pages — anyone can visit */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorSearch />} />
          <Route
            path="/doctors/:id"
            element={<DoctorProfile user={user} onBook={handleBook} />}
          />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />

          {/* Dashboard — only if logged in */}
          <Route
            path="/dashboard"
            element={
              user
                ? <Dashboard user={user} appointments={appointments} />
                : <Navigate to="/register" />
            }
          />

          {/* Catch-all: redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer is shown on every page */}
      <Footer />
    </>
  );
}
