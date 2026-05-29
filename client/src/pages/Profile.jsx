import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProfile, updateProfile } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const { addToast } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await getProfile();
        const profile = res.data.user || res.data;
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
            : '',
        });
      } catch (err) {
        // Fall back to auth user data
        if (user) {
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth
              ? new Date(user.dateOfBirth).toISOString().split('T')[0]
              : '',
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === 'phone') {
      value = formatPhoneNumber(value);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      addToast('Name is required', 'warning');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
      });
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }

  function getInitials(name) {
    if (!name || !name.trim()) return <User size={36} color="white" strokeWidth={2.5} />;
    return name
      .trim()
      .split(' ')
      .filter(n => n.length > 0)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="skeleton" style={{ height: 130, borderRadius: 24, marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 400, borderRadius: 24 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">{getInitials(form.name)}</div>
          <div className="profile-header-info">
            <h1>{form.name || 'User'}</h1>
            <p>{form.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form-section">
          <h2>Personal Information</h2>

          <form onSubmit={handleSave}>
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <span className="form-error" style={{ color: 'var(--text-tertiary)' }}>
                  Email cannot be changed
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="input"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="input"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
