'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  SearchIcon,
  PlusIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  PhoneIcon,
  UserGroupIcon,
} from './Icons';

export default function AppointmentsList({
  appointments,
  doctors,
  loading,
  onOpenAppointmentModal,
  onEditAppointment,
  onDeleteAppointment,
  onUpdateStatus,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = appointments.filter((app) => {
    const matchesSearch =
      !search ||
      app.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      app.patientPhone?.includes(search) ||
      app.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
      app.doctor?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter;

    const matchesDoctor =
      doctorFilter === 'All' || app.doctor?._id === doctorFilter;

    const matchesDate = !dateFilter || app.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Patient Appointments
            </h2>
            <p className="text-xs text-slate-500">
              Track appointments, time slots, patient symptoms, and booking statuses
            </p>
          </div>
          <button
            onClick={() => onOpenAppointmentModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/20 transition-all active:scale-98 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patient, phone, symptoms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Doctor Filter */}
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="All">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-slate-500 hover:text-slate-800 underline whitespace-nowrap cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-3 sm:space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-dashed border-slate-200 px-4">
          <CalendarIcon className="w-10 sm:w-12 h-10 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm sm:text-base font-semibold text-slate-800">
            No appointments found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || statusFilter !== 'All' || dateFilter
              ? 'Try resetting the filters to see all appointments.'
              : 'Book your first appointment or click "Load Demo Data".'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (md:hidden) */}
          <div className="md:hidden space-y-3">
            {filtered.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                {/* Header: Patient Name, Age/Gender, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {app.patientName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.patientGender || 'Male'},{' '}
                      {app.patientAge ? `${app.patientAge} yrs` : 'Age N/A'}
                    </p>
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app._id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Doctor:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {app.doctor?.name || 'Unassigned'} ({app.doctor?.specialty || 'General'})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="font-medium text-slate-700">
                      {app.date} • {app.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <a
                      href={`tel:${app.patientPhone}`}
                      className="font-medium text-teal-600 hover:underline flex items-center gap-1"
                    >
                      <PhoneIcon className="w-3 h-3" />
                      {app.patientPhone}
                    </a>
                  </div>
                  {app.symptoms && (
                    <div className="pt-1.5 border-t border-slate-200/60 mt-1">
                      <span className="text-slate-400 block text-[11px]">Symptoms:</span>
                      <p className="text-slate-700 mt-0.5 line-clamp-2">{app.symptoms}</p>
                    </div>
                  )}
                  {app.notes && (
                    <div className="text-[11px] text-slate-400 italic">
                      Note: {app.notes}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onEditAppointment(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all cursor-pointer"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteAppointment(app._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-95 rounded-lg transition-all cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden on md and down) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Symptoms / Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {app.patientName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{app.patientGender || 'Male'}, {app.patientAge || '—'} yrs</span>
                          <span>•</span>
                          <span>{app.patientPhone}</span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {app.doctor?.name || 'Unassigned'}
                        </div>
                        <div className="text-xs text-teal-600 font-medium">
                          {app.doctor?.specialty}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {app.doctor?.hospital}
                        </div>
                      </td>

                      {/* Date & Slot */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.date}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.timeSlot}</span>
                        </div>
                      </td>

                      {/* Symptoms */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-700 line-clamp-2">
                          {app.symptoms || 'General consultation'}
                        </p>
                        {app.notes && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">
                            Note: {app.notes}
                          </p>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app._id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditAppointment(app)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Appointment"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteAppointment(app._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Appointment"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

