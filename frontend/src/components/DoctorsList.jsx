'use client';

import { useState } from 'react';
import {
  SearchIcon,
  PlusIcon,
  HospitalIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
  StethoscopeIcon,
} from './Icons';

export default function DoctorsList({
  doctors,
  loading,
  onOpenDoctorModal,
  onEditDoctor,
  onDeleteDoctor,
  onBookWithDoctor,
}) {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Specialties list
  const specialties = [
    'All',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'General Medicine',
  ];

  // Filtering
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital?.toLowerCase().includes(search.toLowerCase()) ||
      doc.chamber?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

    const matchesStatus =
      selectedStatus === 'All' || doc.status === selectedStatus;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Doctors & Specialists
            </h2>
            <p className="text-xs text-slate-500">
              Manage doctor profiles, consultation fees, and visiting hours
            </p>
          </div>
          <button
            onClick={() => onOpenDoctorModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/20 transition-all active:scale-98 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by doctor name, hospital, or chamber..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-dashed border-slate-200 px-4">
          <StethoscopeIcon className="w-10 sm:w-12 h-10 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm sm:text-base font-semibold text-slate-800">No doctors found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || selectedSpecialty !== 'All'
              ? 'Try adjusting your search filters.'
              : 'Add your first doctor or click "Load Demo Data" to populate the list.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Top: Avatar, Name, Specialty, Status */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {doc.avatarUrl ? (
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-bold text-base sm:text-lg flex items-center justify-center shadow-xs shrink-0">
                        {doc.name.replace('Dr. ', '').charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500">{doc.degrees || 'MBBS'}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                        {doc.specialty}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${
                      doc.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : doc.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {/* Details list */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <HospitalIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate font-medium text-slate-800">
                      {doc.hospital} {doc.chamber ? `(${doc.chamber})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${doc.phone}`}
                      className="text-teal-700 hover:underline font-medium"
                    >
                      {doc.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doc.visitingHours}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">
                      Exp: <strong className="text-slate-800">{doc.experienceYears || 0} yrs</strong>
                    </span>
                    <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                      Fee: ${doc.consultationFee || 0}
                    </span>
                  </div>

                  {/* Available days badges */}
                  {doc.availableDays && doc.availableDays.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.availableDays.map((day) => (
                        <span
                          key={day}
                          className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onBookWithDoctor(doc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-3 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-700 text-xs font-semibold rounded-xl transition-all active:scale-98 cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>

                <button
                  onClick={() => onEditDoctor(doc)}
                  className="p-2 sm:p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 rounded-lg transition-all cursor-pointer"
                  title="Edit Doctor"
                >
                  <EditIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteDoctor(doc._id)}
                  className="p-2 sm:p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 active:scale-95 rounded-lg transition-all cursor-pointer"
                  title="Delete Doctor"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


