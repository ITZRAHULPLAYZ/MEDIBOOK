import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { getDoctors } from '../services/api';

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'General Medicine',
  'Ophthalmology',
  'ENT',
  'Psychiatry',
  'Gynecology',
];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
];

export default function DoctorSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialty && specialty !== 'All Specialties') params.specialty = specialty;
      if (location) params.location = location;
      if (sort) params.sort = sort;

      const res = await getDoctors(params);
      const data = res.data.doctors || res.data || [];
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [search, specialty, location, sort]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (specialty && specialty !== 'All Specialties') params.specialty = specialty;
    if (location) params.location = location;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, specialty, location, sort, setSearchParams]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchDoctors();
  }

  return (
    <div className="doctor-search-page">
      <div className="container">
        <div className="search-header">
          <h1 className="section-title">
            Find a <span className="gradient-text">Doctor</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            Search through our network of verified specialists
          </p>

          <form onSubmit={handleSearchSubmit}>
            <div className="search-bar">
              <span className="search-bar-icon"><Search size={20} color="#9ca3af" /></span>
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div className="filter-row">
            <select
              className="select"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s === 'All Specialties' ? '' : s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="input"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ maxWidth: 200 }}
            />

            <select
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-results-header">
          <span className="search-results-count">
            {loading ? 'Searching...' : `Showing ${doctors.length} doctor${doctors.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="doctors-grid">
            {doctors.map((doc, i) => (
              <DoctorCard
                key={doc.id || i}
                doctor={{ ...doc, _index: i }}
                onClick={() => navigate(`/doctors/${doc.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="search-empty">
            <div className="search-empty-icon"><Search size={48} color="#9ca3af" opacity={0.5} /></div>
            <h3>No doctors found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
