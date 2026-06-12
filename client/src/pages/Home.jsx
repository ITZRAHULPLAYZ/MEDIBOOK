// Home.jsx — The landing page of MediBook.
//
// Sections on this page:
//   1. Hero  — big headline + call-to-action buttons
//   2. Specialties — browse by medical specialty
//   3. How It Works — 3 simple steps
//   4. Top Doctors — show the 4 highest-rated doctors

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Droplet, Bone, Baby, Brain, Stethoscope } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import DOCTORS from '../data/doctors';

// The 6 medical specialties shown on the home page
const SPECIALTIES = [
  { name: 'Cardiology',       icon: HeartPulse, desc: 'Heart and cardiovascular system specialists' },
  { name: 'Dermatology',      icon: Droplet,    desc: 'Skin, hair, and nail care experts' },
  { name: 'Orthopedics',      icon: Bone,       desc: 'Bone, joint, and muscle specialists' },
  { name: 'Pediatrics',       icon: Baby,       desc: 'Healthcare for infants and children' },
  { name: 'Neurology',        icon: Brain,      desc: 'Brain and nervous system experts' },
  { name: 'General Medicine', icon: Stethoscope,desc: 'Primary care and wellness checkups' },
];

// Show the 4 top-rated doctors (sorted by rating, highest first)
const TOP_DOCTORS = [...DOCTORS].sort((a, b) => b.rating - a.rating).slice(0, 4);

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="hero">

        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Your Health,</span>
              <br />
              Our Priority
            </h1>
            <p className="hero-subtitle">
              Book appointments with top specialists in just a few clicks.
              Quality healthcare is now more accessible than ever.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/doctors')}>
                Find a Doctor
              </button>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => {
                  // Smoothly scroll to the specialties section below
                  document.getElementById('specialties')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES SECTION ──────────────────────────────── */}
      <section className="specialties-section" id="specialties">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">
              Browse by <span className="gradient-text">Specialty</span>
            </h2>
            <p className="section-subtitle">Find the right specialist for your health needs</p>
          </div>

          <div className="specialties-grid">
            {SPECIALTIES.map((spec, i) => (
              <div
                key={spec.name}
                className="specialty-card"
                onClick={() => navigate(`/doctors?specialty=${spec.name}`)}
              >
                <span className="specialty-card-icon">
                  <spec.icon size={36} color="#3a3532" strokeWidth={1.5} />
                </span>
                <h3 className="specialty-card-name">{spec.name}</h3>
                <p className="specialty-card-desc">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ─────────────────────────────── */}
      <section className="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="steps-row">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Search</h3>
              <p className="step-desc">
                Find doctors by specialty, location, or name. Browse ratings and reviews to make the best choice.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Book</h3>
              <p className="step-desc">
                Choose a convenient date and time slot. Fill in your details and confirm your appointment instantly.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Visit</h3>
              <p className="step-desc">
                Get reminders before your appointment. Visit the doctor and receive quality healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP DOCTORS SECTION ──────────────────────────────── */}
      <section className="top-doctors-section">
        <div className="container">
          <div className="top-doctors-header">
            <div>
              <h2 className="section-title">
                Meet Our <span className="gradient-text">Top Doctors</span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Highly rated specialists ready to help you
              </p>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('/doctors')}>
              View All Doctors →
            </button>
          </div>

          <div className="doctors-scroll">
            {TOP_DOCTORS.map((doc, i) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onClick={() => navigate(`/doctors/${doc.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
