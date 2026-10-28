const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    degrees: {
      type: String,
      default: 'MBBS, MD',
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital or Clinic name is required'],
      trim: true,
    },
    chamber: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
      min: 0,
    },
    consultationFee: {
      type: Number,
      default: 50,
      min: 0,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    visitingHours: {
      type: String,
      default: '05:00 PM - 09:00 PM',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    bio: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
