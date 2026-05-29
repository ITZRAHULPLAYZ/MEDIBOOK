import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { getAdminDoctors, addDoctor, updateDoctor, deleteDoctor } from '../services/api';

const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics',
  'Neurology', 'General Medicine', 'Ophthalmology', 'ENT',
  'Psychiatry', 'Gynecology', 'Urology', 'Oncology',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const emptyDoctorForm = {
  name: '',
  email: '',
  phone: '',
  specialty: '',
  location: '',
  hospital: '',
  experience: '',
  fee: '',
  bio: '',
  schedule: {},
};

export default function AdminDoctors() {
  const { addToast } = useApp();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit modal
  const [doctorModal, setDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState({ ...emptyDoctorForm });
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminDoctors();
      const data = res.data.doctors || res.data || [];
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleScheduleChange(day, field, value) {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...(prev.schedule[day] || {}),
          [field]: value,
        },
      },
    }));
  }

  function openAddModal() {
    setEditingDoctor(null);
    setForm({ ...emptyDoctorForm });
    setDoctorModal(true);
  }

  function openEditModal(doctor) {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialty: doctor.specialty || doctor.specialization || '',
      location: doctor.location || doctor.city || '',
      hospital: doctor.hospital || doctor.clinic || '',
      experience: doctor.experience || '',
      fee: doctor.fee || doctor.consultationFee || '',
      bio: doctor.bio || '',
      schedule: doctor.schedule || {},
    });
    setDoctorModal(true);
  }

  async function handleSaveDoctor() {
    if (!form.name.trim() || !form.specialty) {
      addToast('Name and specialty are required', 'warning');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      specialty: form.specialty,
      specialization: form.specialty,
      location: form.location.trim(),
      city: form.location.trim(),
      hospital: form.hospital.trim(),
      clinic: form.hospital.trim(),
      experience: parseInt(form.experience, 10) || 0,
      fee: parseInt(form.fee, 10) || 0,
      consultationFee: parseInt(form.fee, 10) || 0,
      bio: form.bio.trim(),
      schedule: form.schedule,
    };
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, payload);
        addToast('Doctor updated successfully', 'success');
      } else {
        await addDoctor(payload);
        addToast('Doctor added successfully', 'success');
      }
      setDoctorModal(false);
      fetchDoctors();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save doctor', 'error');
    } finally {
      setSaving(false);
    }
  }

  function openDeleteModal(doctor) {
    setDeleteTarget(doctor);
    setDeleteModal(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteDoctor(deleteTarget._id);
      addToast('Doctor deleted', 'success');
      setDeleteModal(false);
      fetchDoctors();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete doctor', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Manage <span className="gradient-text">Doctors</span></h1>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Doctor
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/doctors" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            Manage Doctors
          </NavLink>
          <NavLink to="/admin/appointments" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            All Appointments
          </NavLink>
        </nav>

        {loading ? (
          <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
        ) : doctors.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Location</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => {
                  const name = doc.name || `${doc.firstName || ''} ${doc.lastName || ''}`.trim();
                  return (
                    <tr key={doc._id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {name}
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {doc.specialty || doc.specialization || 'N/A'}
                        </span>
                      </td>
                      <td>{doc.location || doc.city || 'N/A'}</td>
                      <td>{doc.experience || 0} yrs</td>
                      <td>${doc.fee || doc.consultationFee || 0}</td>
                      <td>
                        <span style={{ color: 'var(--warning)' }}>★</span>{' '}
                        {(doc.rating || 0).toFixed(1)}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEditModal(doc)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openDeleteModal(doc)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍⚕️</div>
            <h3>No doctors yet</h3>
            <p>Add your first doctor to get started</p>
            <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: 16 }}>
              + Add Doctor
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={doctorModal}
        onClose={() => setDoctorModal(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setDoctorModal(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveDoctor}
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingDoctor
                ? 'Update Doctor'
                : 'Add Doctor'}
            </button>
          </>
        }
      >
        <div className="admin-form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Dr. John Smith"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555-123-4567"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Specialty *</label>
            <select
              className="select"
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="input"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="New York, NY"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hospital / Clinic</label>
            <input
              type="text"
              className="input"
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              placeholder="City Hospital"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years)</label>
            <input
              type="number"
              className="input"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="10"
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Consultation Fee ($)</label>
            <input
              type="number"
              className="input"
              name="fee"
              value={form.fee}
              onChange={handleChange}
              placeholder="150"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            className="textarea"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Brief description about the doctor..."
            rows={3}
          />
        </div>

        <div className="schedule-builder">
          <label className="form-label" style={{ marginBottom: 12 }}>Weekly Schedule</label>
          {DAYS.map((day) => (
            <div key={day} className="schedule-day">
              <label>{day}</label>
              <input
                type="time"
                value={form.schedule[day]?.start || ''}
                onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
              />
              <span style={{ color: 'var(--text-tertiary)' }}>to</span>
              <input
                type="time"
                value={form.schedule[day]?.end || ''}
                onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Doctor"
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteModal(false)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Doctor'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {deleteTarget?.name}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
