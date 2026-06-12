// Register.jsx — The create-account page.
//
// Props from App.jsx:
//   onRegister — function to call when registration is done.
//               It saves the new user to App state + localStorage.
//
// We collect: name, email, password, phone.
// No real account is created anywhere — it's just stored in memory.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Register({ onRegister }) {
  const navigate = useNavigate();

  // All form fields in one object
  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
    phone:           '',
  });
  const [errors, setErrors] = useState({});

  // Update a single field by name when the user types
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  // Check all fields before submitting
  function validate() {
    const errs = {};
    if (!form.name.trim())  errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password)     errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Create a new user object
    const newUser = {
      id:    String(Date.now()),
      name:  form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role:  'patient',
    };

    onRegister(newUser);      // tell App.jsx to save this user
    navigate('/dashboard');   // go to the dashboard
  }

  return (
    <div className="auth-page">


      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-header">
          <Link to="/" className="auth-header-logo">
            <span style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#3a3532', borderRadius: 10, color: 'white' }}>
              <Activity size={20} />
            </span>
            <span className="gradient-text">MediBook</span>
          </Link>
          <h1>Create Account</h1>
          <p>Join MediBook and book appointments easily</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text" className="input" name="name"
              placeholder="John Doe"
              value={form.name} onChange={handleChange}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" className="input" name="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password + Confirm side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="input" name="password"
                placeholder="Min 6 characters"
                value={form.password} onChange={handleChange}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password" className="input" name="confirmPassword"
                placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel" className="input" name="phone"
              placeholder="(555) 123-4567"
              value={form.phone} onChange={handleChange}
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
