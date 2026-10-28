'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon } from './Icons';

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  doctors,
  initialData,
}) {
  const [formData, setFormData] = useState({
    doctor: '',
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    patientPhone: '',
    patientEmail: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    symptoms: '',
    status: 'Scheduled',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        doctor: initialData.doctor?._id || initialData.doctor || '',
        patientName: initialData.patientName || '',
        patientAge: initialData.patientAge || '',
        patientGender: initialData.patientGender || 'Male',
        patientPhone: initialData.patientPhone || '',
        patientEmail: initialData.patientEmail || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        timeSlot: initialData.timeSlot || '10:00 AM',
        symptoms: initialData.symptoms || '',
        status: initialData.status || 'Scheduled',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        doctor: doctors[0]?._id || '',
        patientName: '',
        patientAge: '',
        patientGender: 'Male',
        patientPhone: '',
        patientEmail: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '10:00 AM',
        symptoms: '',
        status: 'Scheduled',
        notes: '',
      });
    }
    setError('');
  }, [initialData, isOpen, doctors]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.doctor) {
      setError('Please select a doctor');
      return;
    }
    if (!formData.patientName) {
      setError('Patient name is required');
      return;
    }
    if (!formData.patientPhone) {
      setError('Patient phone number is required');
      return;
    }
    if (!formData.date) {
      setError('Appointment date is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {initialData ? 'Edit Appointment' : 'Book New Appointment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
              {error}
            </div>
          )}


          {/* Doctor Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Specialist / Doctor *
            </label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              required
            >
              <option value="" disabled>
                Select a doctor
              </option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} — {doc.specialty} (${doc.consultationFee})
                </option>
              ))}
            </select>
          </div>

          {/* Patient Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 000-0000"
                value={formData.patientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, patientPhone: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>
          </div>

          {/* Age & Gender & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="30"
                value={formData.patientAge}
                onChange={(e) =>
                  setFormData({ ...formData, patientAge: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                value={formData.patientGender}
                onChange={(e) =>
                  setFormData({ ...formData, patientGender: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time Slot *
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) =>
                  setFormData({ ...formData, timeSlot: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Symptoms / Reason for Visit
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mild fever, persistent cough, regular blood pressure checkup..."
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Doctor / Clinic Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bring fasting lab test report"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              {submitting
                ? 'Saving...'
                : initialData
                ? 'Update Appointment'
                : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
