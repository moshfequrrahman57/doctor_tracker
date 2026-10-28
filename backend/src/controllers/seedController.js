const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const sampleDoctors = [
  {
    name: 'Dr. Sarah Mitchell',
    specialty: 'Cardiology',
    degrees: 'MBBS, MD, FACC',
    email: 'sarah.mitchell@medcare.org',
    phone: '+1 (555) 234-5678',
    hospital: 'St. Jude Heart Institute',
    chamber: 'Room 304, West Wing',
    experienceYears: 14,
    consultationFee: 120,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    visitingHours: '09:00 AM - 01:00 PM',
    status: 'Active',
    bio: 'Board-certified cardiologist specializing in preventive cardiology and heart rhythm disorders.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Robert Chen',
    specialty: 'Neurology',
    degrees: 'MD, PhD, FAAN',
    email: 'robert.chen@neurohealth.com',
    phone: '+1 (555) 345-6789',
    hospital: 'Apex Neurosciences Center',
    chamber: 'Suite 512, Block A',
    experienceYears: 18,
    consultationFee: 150,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    visitingHours: '10:00 AM - 02:00 PM',
    status: 'Active',
    bio: 'Specialist in stroke recovery, migraine management, and neuromuscular diagnostics.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Emily Watson',
    specialty: 'Pediatrics',
    degrees: 'MBBS, DCH, FAAP',
    email: 'emily.watson@littlecare.org',
    phone: '+1 (555) 456-7890',
    hospital: "Children's Central Hospital",
    chamber: 'Pediatric Clinic #12',
    experienceYears: 10,
    consultationFee: 90,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    visitingHours: '02:00 PM - 06:00 PM',
    status: 'Active',
    bio: 'Compassionate pediatrician focusing on developmental milestones and childhood immunization.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813576-238d9f187a54?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Marcus Vance',
    specialty: 'Orthopedics',
    degrees: 'MS (Ortho), FRCS',
    email: 'marcus.vance@jointcare.net',
    phone: '+1 (555) 567-8901',
    hospital: 'Metropolitan Bone & Joint Clinic',
    chamber: 'OPD-2, 1st Floor',
    experienceYears: 12,
    consultationFee: 110,
    availableDays: ['Monday', 'Thursday', 'Saturday'],
    visitingHours: '04:00 PM - 08:00 PM',
    status: 'Active',
    bio: 'Expert in sports injuries, knee arthroscopy, and spine rehabilitation.',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Aaliyah Patel',
    specialty: 'Dermatology',
    degrees: 'MD, DVD, FAAD',
    email: 'aaliyah.patel@dermaclinic.io',
    phone: '+1 (555) 678-9012',
    hospital: 'DermaGlow Specialty Care',
    chamber: 'Aesthetic Suite 201',
    experienceYears: 8,
    consultationFee: 85,
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    visitingHours: '11:00 AM - 03:00 PM',
    status: 'Active',
    bio: 'Clinical and cosmetic dermatologist specializing in chronic skin conditions and laser therapy.',
    avatarUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. James Harrison',
    specialty: 'General Medicine',
    degrees: 'MBBS, MRCGP',
    email: 'james.harrison@citycare.org',
    phone: '+1 (555) 789-0123',
    hospital: 'City Care Community Hospital',
    chamber: 'Consultation Room 105',
    experienceYears: 16,
    consultationFee: 70,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    visitingHours: '08:00 AM - 12:00 PM',
    status: 'Active',
    bio: 'Primary care physician committed to holistic health management and disease prevention.',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
  },
];

// @desc    Seed sample doctors and appointments
// @route   POST /api/seed
exports.seedDatabase = async (req, res) => {
  try {
    // Clear existing data
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});

    // Insert doctors
    const createdDoctors = await Doctor.insertMany(sampleDoctors);

    // Generate dynamic dates (today, tomorrow, yesterday, +2 days)
    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const sampleAppointments = [
      {
        doctor: createdDoctors[0]._id, // Cardiology
        patientName: 'Eleanor Davis',
        patientAge: 58,
        patientGender: 'Female',
        patientPhone: '+1 (555) 901-1122',
        patientEmail: 'eleanor.d@gmail.com',
        date: formatDate(0),
        timeSlot: '09:30 AM',
        symptoms: 'Occasional chest tightness and shortness of breath upon exertion.',
        status: 'Confirmed',
        notes: 'Follow-up ECG requested. Blood pressure to be monitored.',
      },
      {
        doctor: createdDoctors[1]._id, // Neurology
        patientName: 'David Miller',
        patientAge: 42,
        patientGender: 'Male',
        patientPhone: '+1 (555) 902-2233',
        patientEmail: 'd.miller@techcorp.com',
        date: formatDate(0),
        timeSlot: '10:45 AM',
        symptoms: 'Recurrent throbbing migraines on the left temple with light sensitivity.',
        status: 'Scheduled',
        notes: 'Advised to maintain a headache diary before the session.',
      },
      {
        doctor: createdDoctors[2]._id, // Pediatrics
        patientName: 'Liam Johnson',
        patientAge: 6,
        patientGender: 'Male',
        patientPhone: '+1 (555) 903-3344',
        patientEmail: 'sarah.j.mom@outlook.com',
        date: formatDate(0),
        timeSlot: '02:30 PM',
        symptoms: 'Mild dry cough and low-grade fever for 2 days.',
        status: 'Confirmed',
        notes: 'Child immunization schedule review also requested.',
      },
      {
        doctor: createdDoctors[3]._id, // Orthopedics
        patientName: 'Sophia Ramirez',
        patientAge: 29,
        patientGender: 'Female',
        patientPhone: '+1 (555) 904-4455',
        patientEmail: 'sophia.r@fitlife.org',
        date: formatDate(1),
        timeSlot: '04:15 PM',
        symptoms: 'Right knee pain after running a half-marathon last weekend.',
        status: 'Scheduled',
        notes: 'Bring previous knee MRI scan if available.',
      },
      {
        doctor: createdDoctors[4]._id, // Dermatology
        patientName: 'Michael Chang',
        patientAge: 35,
        patientGender: 'Male',
        patientPhone: '+1 (555) 905-5566',
        patientEmail: 'mchang@designhub.io',
        date: formatDate(1),
        timeSlot: '11:30 AM',
        symptoms: 'Eczema flare-up on both elbows and wrists.',
        status: 'Confirmed',
        notes: 'Check for topical steroid sensitivity.',
      },
      {
        doctor: createdDoctors[5]._id, // General Medicine
        patientName: 'Grace Robinson',
        patientAge: 64,
        patientGender: 'Female',
        patientPhone: '+1 (555) 906-6677',
        patientEmail: 'grace.robinson@home.org',
        date: formatDate(-1),
        timeSlot: '09:00 AM',
        symptoms: 'Annual executive health checkup and routine blood sugar evaluation.',
        status: 'Completed',
        notes: 'Fasting lipid profile reviewed. Prescription renewed for 6 months.',
      },
      {
        doctor: createdDoctors[0]._id, // Cardiology
        patientName: 'Arthur Wilson',
        patientAge: 71,
        patientGender: 'Male',
        patientPhone: '+1 (555) 907-7788',
        patientEmail: 'arthur.w@fastmail.com',
        date: formatDate(-2),
        timeSlot: '11:00 AM',
        symptoms: 'Post-pacemaker checkup and rhythm evaluation.',
        status: 'Completed',
        notes: 'Device operating normally. Next routine visit in 6 months.',
      },
      {
        doctor: createdDoctors[2]._id, // Pediatrics
        patientName: 'Chloe Bennett',
        patientAge: 4,
        patientGender: 'Female',
        patientPhone: '+1 (555) 908-8899',
        patientEmail: 'bennett.family@icloud.com',
        date: formatDate(2),
        timeSlot: '03:15 PM',
        symptoms: 'Ear tugging and mild irritability during nighttime.',
        status: 'Scheduled',
        notes: 'Suspected middle ear infection.',
      },
    ];

    const createdAppointments = await Appointment.insertMany(sampleAppointments);

    res.json({
      success: true,
      message: `Database successfully seeded with ${createdDoctors.length} doctors and ${createdAppointments.length} appointments.`,
      doctorsCount: createdDoctors.length,
      appointmentsCount: createdAppointments.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
