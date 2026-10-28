const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor selection is required'],
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientAge: {
      type: Number,
      min: 0,
      max: 130,
    },
    patientGender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone is required'],
      trim: true,
    },
    patientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    date: {
      type: String, // Format YYYY-MM-DD
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      default: '10:00 AM',
      trim: true,
    },
    symptoms: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
