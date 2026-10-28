'use client';

import {
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StethoscopeIcon,
  PlusIcon,
  SparklesIcon,
} from './Icons';

export default function Dashboard({
  stats,
  loading,
  onNavigateTab,
  onOpenAppointmentModal,
  onOpenDoctorModal,
  onSeedData,
  isSeeding,
}) {
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-72 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const {
    totalDoctors = 0,
    activeDoctors = 0,
    totalAppointments = 0,
    todayAppointments = 0,
    confirmedAppointments = 0,
    completedAppointments = 0,
    statusCounts = {},
    recentAppointments = [],
    specialties = [],
  } = stats || {};

  const cards = [
    {
      title: 'Total Doctors',
      value: totalDoctors,
      subtitle: `${activeDoctors} active currently`,
      icon: StethoscopeIcon,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
      tab: 'doctors',
    },
    {
      title: 'Total Appointments',
      value: totalAppointments,
      subtitle: `${confirmedAppointments} confirmed bookings`,
      icon: CalendarIcon,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50 text-teal-700 border-teal-200',
      tab: 'appointments',
    },
    {
      title: "Today's Schedule",
      value: todayAppointments,
      subtitle: 'Scheduled for today',
      icon: ClockIcon,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
      tab: 'appointments',
    },
    {
      title: 'Completed Visits',
      value: completedAppointments,
      subtitle: `${
        totalAppointments > 0
          ? Math.round((completedAppointments / totalAppointments) * 100)
          : 0
      }% completion rate`,
      icon: CheckCircleIcon,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tab: 'appointments',
    },
  ];

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
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(c.tab)}
              className="group bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                    {c.title}
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-slate-900 mt-0.5 sm:mt-1">
                    {c.value}
                  </p>
                </div>
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border shrink-0 ${c.bgColor} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-2 sm:mt-3 flex items-center gap-1 line-clamp-1">
                <span>{c.subtitle}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Welcome Hero */}
      <div className="bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <span className="inline-block px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider mb-2">
            Practice Management
          </span>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">
            Doctor & Appointment Tracker
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Streamline patient appointments, manage doctor visiting hours, and monitor hospital chamber schedules in real time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenAppointmentModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-98 cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Book Patient</span>
          </button>
          <button
            onClick={onOpenDoctorModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-medium rounded-xl text-xs sm:text-sm border border-white/10 transition-all active:scale-98 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
          {totalDoctors === 0 && (
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs sm:text-sm transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>{isSeeding ? 'Seeding...' : 'Load Sample Data'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Column Section: Recent Appointments & Specialties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Recent Appointments
              </h3>
              <p className="text-xs text-slate-500">
                Latest booked patient visits and statuses
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-10 sm:py-12 border border-dashed border-slate-200 rounded-xl">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">
                No appointments booked yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click &ldquo;Book Patient&rdquo; or load demo data to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Patient</th>
                      <th className="py-2.5 px-3">Doctor</th>
                      <th className="py-2.5 px-3">Date & Slot</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAppointments.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">
                            {app.patientName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {app.patientPhone}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">
                            {app.doctor?.name || 'Assigned Doctor'}
                          </div>
                          <div className="text-xs text-teal-600">
                            {app.doctor?.specialty}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-700 font-medium">{app.date}</div>
                          <div className="text-xs text-slate-400">{app.timeSlot}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View (sm:hidden) */}
              <div className="sm:hidden space-y-2.5">
                {recentAppointments.map((app) => (
                  <div
                    key={app._id}
                    className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">
                          {app.patientName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {app.patientPhone}
                        </div>
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 text-slate-600">
                      <div>
                        <span className="font-medium text-slate-800">
                          {app.doctor?.name || 'Doctor'}
                        </span>{' '}
                        <span className="text-teal-600 text-[11px]">
                          ({app.doctor?.specialty})
                        </span>
                      </div>
                      <div className="text-right text-slate-500 font-medium text-[11px]">
                        {app.date} • {app.timeSlot}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>


        {/* Specialties & Status Summary (1 col) */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-3">
              Status Breakdown
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Scheduled', count: statusCounts.Scheduled || 0, color: 'bg-amber-500' },
                { label: 'Confirmed', count: statusCounts.Confirmed || 0, color: 'bg-blue-500' },
                { label: 'Completed', count: statusCounts.Completed || 0, color: 'bg-emerald-500' },
                { label: 'Cancelled', count: statusCounts.Cancelled || 0, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Specialties
              </h3>
              <button
                onClick={() => onNavigateTab('doctors')}
                className="text-xs text-teal-600 font-semibold"
              >
                Browse &rarr;
              </button>
            </div>
            {specialties.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No specialists listed yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <span
                    key={s.specialty}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <span>{s.specialty}</span>
                    <span className="w-4 h-4 rounded-full bg-white text-slate-900 text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {s.count}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
