// DoctorSearch.jsx — The "Find a Doctor" page.
//
// The user can:
//   - Type in the search box to filter by name or specialty
//   - Pick a specialty from the dropdown
//   - Sort results by rating, experience, or fee
//
// All filtering is done with plain JavaScript on the DOCTORS array.
// No API calls needed!

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import DOCTORS from '../data/doctors';

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'General Medicine',
];

const SORT_OPTIONS = [
  { value: '',          label: 'Default' },
  { value: 'rating',   label: 'Top Rated' },
  { value: 'exp',      label: 'Most Experienced' },
  { value: 'fee_asc',  label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
];

export default function DoctorSearch() {
  const navigate = useNavigate();
  // useSearchParams lets us pre-fill the specialty from the URL
  // e.g. /doctors?specialty=Cardiology (from clicking a specialty card on Home)
  const [searchParams] = useSearchParams();

  const [search,    setSearch]    = useState('');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [sort,      setSort]      = useState('');

  // ── Filter + sort the doctors array ─────────────────────────
  let results = [...DOCTORS];

  // 1. Filter by search text (checks name and specialty)
  if (search.trim()) {
    const q = search.toLowerCase();
    results = results.filter(
      (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
    );
  }

  // 2. Filter by specialty dropdown
  if (specialty && specialty !== 'All Specialties') {
    results = results.filter((d) => d.specialty === specialty);
  }

  // 3. Sort
  if (sort === 'rating')   results.sort((a, b) => b.rating - a.rating);
  if (sort === 'exp')      results.sort((a, b) => b.experience - a.experience);
  if (sort === 'fee_asc')  results.sort((a, b) => a.fee - b.fee);
  if (sort === 'fee_desc') results.sort((a, b) => b.fee - a.fee);

  return (
    <div className="doctor-search-page">
      <div className="container">

        {/* ── Search header ─────────────────────────── */}
        <div className="search-header">
          <h1 className="section-title">
            Find a <span className="gradient-text">Doctor</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            Search through our network of verified specialists
          </p>

          {/* Search input */}
          <div className="search-bar">
            <span className="search-bar-icon"><Search size={20} color="#9ca3af" /></span>
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter row: specialty + sort */}
          <div className="filter-row">
            <select
              className="select"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s === 'All Specialties' ? '' : s}>{s}</option>
              ))}
            </select>

            <select
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>Sort: {o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Results count ─────────────────────────── */}
        <div className="search-results-header">
          <span className="search-results-count">
            Showing {results.length} doctor{results.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Doctor cards ──────────────────────────── */}
        {results.length > 0 ? (
          <div className="doctors-grid">
            {results.map((doc, i) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
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
