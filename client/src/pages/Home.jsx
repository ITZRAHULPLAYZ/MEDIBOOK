import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Droplet, Bone, Baby, Brain, Stethoscope } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { getDoctors } from '../services/api';

const SPECIALTIES = [
  { name: 'Cardiology', icon: HeartPulse, desc: 'Heart and cardiovascular system specialists' },
  { name: 'Dermatology', icon: Droplet, desc: 'Skin, hair, and nail care experts' },
  { name: 'Orthopedics', icon: Bone, desc: 'Bone, joint, and muscle specialists' },
  { name: 'Pediatrics', icon: Baby, desc: 'Healthcare for infants and children' },
  { name: 'Neurology', icon: Brain, desc: 'Brain and nervous system experts' },
  { name: 'General Medicine', icon: Stethoscope, desc: 'Primary care and wellness checkups' },
];

const STATS = [
  { target: 500, label: 'Doctors', suffix: '+' },
  { target: 10000, label: 'Appointments', suffix: '+' },
  { target: 50, label: 'Specialties', suffix: '+' },
  { target: 4.9, label: 'Rating', suffix: '', isDecimal: true },
];

function AnimatedCounter({ target, suffix, isDecimal, delay }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = isDecimal
              ? parseFloat((eased * target).toFixed(1))
              : Math.floor(eased * target);
            setCount(current);
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          setTimeout(() => requestAnimationFrame(step), delay || 0);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, isDecimal, delay]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    async function fetchTopDoctors() {
      try {
        const res = await getDoctors({ sort: 'rating', limit: 4 });
        const docs = res.data.doctors || res.data || [];
        setTopDoctors(docs.slice(0, 4));
      } catch (err) {
        setTopDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    }
    fetchTopDoctors();
  }, []);

  return (
    <div>
      {/* === HERO === */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-orb"></div>
          <div className="hero-bg-orb"></div>
          <div className="hero-bg-orb"></div>
        </div>
        <div className="container">
          <div className="hero-content" style={{ animation: 'slideUp 0.8s ease' }}>
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
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/doctors')}
              >
                Find a Doctor
              </button>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => {
                  document.getElementById('specialties')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-stats">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="hero-stat"
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              >
                <div className="hero-stat-value gradient-text">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    isDecimal={stat.isDecimal}
                    delay={300 + i * 150}
                  />
                </div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SPECIALTIES === */}
      <section className="specialties-section" id="specialties">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">
              Browse by <span className="gradient-text">Specialty</span>
            </h2>
            <p className="section-subtitle">
              Find the right specialist for your health needs
            </p>
          </div>

          <div className="specialties-grid">
            {SPECIALTIES.map((spec, i) => (
              <div
                key={spec.name}
                className="specialty-card"
                onClick={() => navigate(`/doctors?specialty=${spec.name}`)}
                style={{ animation: `slideUp 0.5s ease ${i * 0.1}s forwards`, opacity: 0 }}
              >
                <span className="specialty-card-icon">
                  <spec.icon size={36} color="#0066ff" strokeWidth={1.5} />
                </span>
                <h3 className="specialty-card-name">{spec.name}</h3>
                <p className="specialty-card-desc">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">
              Get started in three simple steps
            </p>
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

      {/* === TOP DOCTORS === */}
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
            <button
              className="btn btn-ghost"
              onClick={() => navigate('/doctors')}
            >
              View All Doctors →
            </button>
          </div>

          {doctorsLoading ? (
            <div className="doctors-scroll">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton skeleton-card" />
              ))}
            </div>
          ) : topDoctors.length > 0 ? (
            <div className="doctors-scroll">
              {topDoctors.map((doc, i) => (
                <DoctorCard
                  key={doc.id || i}
                  doctor={{ ...doc, _index: i }}
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👨‍⚕️</div>
              <h3>No doctors available yet</h3>
              <p>Check back soon for top-rated specialists</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
