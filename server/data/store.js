const bcrypt = require('bcryptjs');

// Pre-hash passwords for seed data
const patientPasswordHash = bcrypt.hashSync('password123', 10);
const adminPasswordHash = bcrypt.hashSync('admin123', 10);

const store = {
  doctors: [
    {
      id: 'd1',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Cardiology',
      location: 'New York, NY',
      hospital: 'City Heart Center',
      experience: 15,
      rating: 4.8,
      fee: 150,
      bio: 'Dr. Sarah Mitchell is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in interventional cardiology and preventive heart care. Her patient-centered approach has earned her recognition as one of New York\'s top heart specialists.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '15:00', '15:30', '16:00']
      }
    },
    {
      id: 'd2',
      name: 'Dr. James Rodriguez',
      specialty: 'Cardiology',
      location: 'Los Angeles, CA',
      hospital: 'Pacific Cardiac',
      experience: 12,
      rating: 4.6,
      fee: 140,
      bio: 'Dr. James Rodriguez is a highly skilled cardiologist practicing in Los Angeles with 12 years of clinical experience. He is an expert in echocardiography and cardiac rehabilitation. Dr. Rodriguez is passionate about educating patients on heart-healthy lifestyles.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30'],
        tuesday: ['09:00', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:30', '15:00', '15:30', '16:00', '16:30'],
        thursday: ['09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:30'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:30', '16:00']
      }
    },
    {
      id: 'd3',
      name: 'Dr. Emily Chen',
      specialty: 'Dermatology',
      location: 'San Francisco, CA',
      hospital: 'Bay Skin Clinic',
      experience: 10,
      rating: 4.9,
      fee: 120,
      bio: 'Dr. Emily Chen is a renowned dermatologist based in San Francisco with a decade of experience in medical and cosmetic dermatology. She is known for her expertise in treating complex skin conditions and performing advanced dermatological procedures. Her clinic is recognized for combining cutting-edge technology with compassionate care.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        wednesday: ['09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:30', '16:00'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30']
      }
    },
    {
      id: 'd4',
      name: 'Dr. Michael Patel',
      specialty: 'Dermatology',
      location: 'Chicago, IL',
      hospital: 'Metro Dermatology',
      experience: 8,
      rating: 4.5,
      fee: 110,
      bio: 'Dr. Michael Patel is a dedicated dermatologist serving the Chicago area with 8 years of professional experience. He specializes in acne treatment, skin cancer screening, and cosmetic enhancements. Dr. Patel is committed to helping patients achieve healthy and radiant skin.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '11:00', '11:30', '13:00', '13:30', '14:00', '15:00', '15:30', '16:00'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        friday: ['09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30']
      }
    },
    {
      id: 'd5',
      name: 'Dr. Olivia Thompson',
      specialty: 'Orthopedics',
      location: 'Houston, TX',
      hospital: 'Lone Star Ortho',
      experience: 20,
      rating: 4.7,
      fee: 180,
      bio: 'Dr. Olivia Thompson is a leading orthopedic surgeon in Houston with an impressive 20 years of experience in musculoskeletal medicine. She specializes in joint replacement surgery and sports medicine injuries. Her dedication to patient recovery has made her a trusted name in Texas orthopedics.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        thursday: ['09:00', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '15:00', '15:30']
      }
    },
    {
      id: 'd6',
      name: 'Dr. David Kim',
      specialty: 'Orthopedics',
      location: 'Seattle, WA',
      hospital: 'Northwest Bone & Joint',
      experience: 14,
      rating: 4.8,
      fee: 170,
      bio: 'Dr. David Kim is a board-certified orthopedic specialist in Seattle with 14 years of experience treating bone and joint disorders. He is an expert in minimally invasive surgical techniques and arthroscopic procedures. Dr. Kim combines surgical precision with a holistic approach to patient rehabilitation.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:30', '16:00', '16:30'],
        friday: ['09:00', '09:30', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
      }
    },
    {
      id: 'd7',
      name: 'Dr. Sophia Williams',
      specialty: 'Pediatrics',
      location: 'Boston, MA',
      hospital: "Children's Wellness",
      experience: 11,
      rating: 4.9,
      fee: 100,
      bio: 'Dr. Sophia Williams is a compassionate pediatrician in Boston with 11 years of experience caring for children of all ages. She specializes in developmental pediatrics and childhood immunizations. Parents trust her warm, patient-first approach and thorough attention to every child\'s unique needs.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        thursday: ['09:00', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:30', '15:00', '15:30', '16:00', '16:30']
      }
    },
    {
      id: 'd8',
      name: 'Dr. Alexander Brown',
      specialty: 'Pediatrics',
      location: 'Miami, FL',
      hospital: 'Sunshine Pediatrics',
      experience: 9,
      rating: 4.4,
      fee: 95,
      bio: 'Dr. Alexander Brown is an energetic pediatrician based in Miami with 9 years of experience in general and preventive pediatric medicine. He has a special interest in pediatric nutrition and childhood allergies. Dr. Brown is known for creating a fun, stress-free environment for young patients.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        thursday: ['09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:30', '16:00']
      }
    },
    {
      id: 'd9',
      name: 'Dr. Rachel Green',
      specialty: 'Neurology',
      location: 'Denver, CO',
      hospital: 'Mountain Neuro Clinic',
      experience: 18,
      rating: 4.7,
      fee: 200,
      bio: 'Dr. Rachel Green is a distinguished neurologist in Denver with 18 years of experience in treating neurological disorders. She specializes in migraine management, epilepsy treatment, and neurodegenerative diseases. Her research contributions and clinical excellence have earned her numerous accolades in the field.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30'],
        friday: ['09:00', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']
      }
    },
    {
      id: 'd10',
      name: 'Dr. Nathan Scott',
      specialty: 'Neurology',
      location: 'Phoenix, AZ',
      hospital: 'Desert Brain Center',
      experience: 13,
      rating: 4.6,
      fee: 190,
      bio: 'Dr. Nathan Scott is a skilled neurologist practicing in Phoenix with 13 years of expertise in brain and nervous system disorders. He specializes in stroke recovery, sleep disorders, and neurological diagnostics. Dr. Scott is dedicated to using the latest advances in neuroscience to improve patient outcomes.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '16:00'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']
      }
    },
    {
      id: 'd11',
      name: 'Dr. Lisa Park',
      specialty: 'General Medicine',
      location: 'Portland, OR',
      hospital: 'Evergreen Family Clinic',
      experience: 16,
      rating: 4.8,
      fee: 90,
      bio: 'Dr. Lisa Park is a trusted general practitioner in Portland with 16 years of experience in family and internal medicine. She provides comprehensive primary care including preventive health screenings and chronic disease management. Her holistic approach to wellness has built a loyal patient community.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        thursday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00', '16:30'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '15:00', '15:30']
      }
    },
    {
      id: 'd12',
      name: 'Dr. Robert Wilson',
      specialty: 'General Medicine',
      location: 'Atlanta, GA',
      hospital: 'Southern Health Center',
      experience: 22,
      rating: 4.5,
      fee: 85,
      bio: 'Dr. Robert Wilson is a veteran general medicine practitioner in Atlanta with 22 years of dedicated service to his community. He excels in managing a wide spectrum of health conditions from routine check-ups to complex multi-system disorders. His vast experience and calm demeanor make him a pillar of the Southern Health Center.',
      schedule: {
        monday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '16:00'],
        tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        wednesday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        thursday: ['09:00', '09:30', '10:00', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        friday: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '14:00', '14:30', '15:00', '15:30', '16:00']
      }
    }
  ],

  patients: [
    {
      id: 'p1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0100',
      dob: '1990-05-15',
      role: 'patient',
      password: patientPasswordHash
    },
    {
      id: 'p2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0200',
      dob: '1985-11-22',
      role: 'patient',
      password: patientPasswordHash
    }
  ],

  admin: {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@medibook.com',
    role: 'admin',
    password: adminPasswordHash
  },

  appointments: [
    {
      id: 'apt1',
      patientId: 'p1',
      doctorId: 'd1',
      date: '2026-06-05',
      time: '10:00',
      reason: 'Annual heart checkup',
      notes: 'Patient has family history of heart disease',
      status: 'upcoming',
      createdAt: '2026-05-28T10:30:00.000Z'
    },
    {
      id: 'apt2',
      patientId: 'p1',
      doctorId: 'd3',
      date: '2026-06-10',
      time: '14:00',
      reason: 'Skin rash consultation',
      notes: 'Rash appeared two weeks ago on forearms',
      status: 'upcoming',
      createdAt: '2026-05-27T14:15:00.000Z'
    },
    {
      id: 'apt3',
      patientId: 'p2',
      doctorId: 'd7',
      date: '2026-06-03',
      time: '09:30',
      reason: 'Child wellness visit',
      notes: 'Routine checkup for 5-year-old daughter',
      status: 'upcoming',
      createdAt: '2026-05-26T09:00:00.000Z'
    }
  ],

  notifications: [
    {
      id: 'n1',
      patientId: 'p1',
      message: 'Your appointment with Dr. Sarah Mitchell on June 5, 2026 at 10:00 AM has been confirmed.',
      type: 'booking',
      read: false,
      createdAt: '2026-05-28T10:30:00.000Z'
    },
    {
      id: 'n2',
      patientId: 'p1',
      message: 'Reminder: You have an upcoming appointment with Dr. Emily Chen on June 10, 2026 at 2:00 PM.',
      type: 'reminder',
      read: false,
      createdAt: '2026-05-29T08:00:00.000Z'
    }
  ]
};

module.exports = { store };
