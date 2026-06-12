// ─────────────────────────────────────────────────────────────
// doctors.js  —  All doctor data lives here as a plain array.
// To add a new doctor, just add an object to this list!
// ─────────────────────────────────────────────────────────────

const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewCount: 128,
    experience: 12,
    location: 'New York, NY',
    availability: 'Available Today',
    fee: 150,
    bio: 'Experienced cardiologist dedicated to heart health and patient well-being.',
    education: 'MD — Johns Hopkins University',
    languages: ['English', 'Spanish'],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    rating: 4.8,
    reviewCount: 95,
    experience: 8,
    location: 'Los Angeles, CA',
    availability: 'Available Today',
    fee: 120,
    bio: 'Skin care specialist with expertise in both medical and cosmetic dermatology.',
    education: 'MD — UCLA School of Medicine',
    languages: ['English', 'Mandarin'],
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    rating: 4.9,
    reviewCount: 210,
    experience: 15,
    location: 'Chicago, IL',
    availability: 'Tomorrow',
    fee: 100,
    bio: 'Compassionate pediatrician who loves helping children grow up healthy and happy.',
    education: 'MD — University of Chicago',
    languages: ['English', 'Spanish'],
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    rating: 4.7,
    reviewCount: 74,
    experience: 10,
    location: 'Houston, TX',
    availability: 'Available Today',
    fee: 180,
    bio: 'Bone and joint specialist with a focus on sports injuries and recovery.',
    education: 'MD — Baylor College of Medicine',
    languages: ['English'],
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    specialty: 'Neurology',
    rating: 4.8,
    reviewCount: 63,
    experience: 9,
    location: 'Phoenix, AZ',
    availability: 'Tomorrow',
    fee: 200,
    bio: 'Neurologist specializing in headaches, epilepsy, and nervous system disorders.',
    education: 'MD — Mayo Clinic School of Medicine',
    languages: ['English', 'Hindi'],
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    specialty: 'General Medicine',
    rating: 4.6,
    reviewCount: 180,
    experience: 20,
    location: 'Philadelphia, PA',
    availability: 'Available Today',
    fee: 80,
    bio: 'Family doctor with 20 years of experience providing primary care for all ages.',
    education: 'MD — University of Pennsylvania',
    languages: ['English', 'Korean'],
  },
];

// Available time slots — same list for every doctor
export const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '4:00 PM',
];

export default DOCTORS;
