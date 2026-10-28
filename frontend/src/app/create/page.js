'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { StethoscopeIcon, LockClosedIcon, CalendarIcon, PlusIcon } from '../../components/Icons';

export default function CreatePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // While resolving auth state, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── NOT LOGGED IN — show "Login First" gate ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">

          {/* Lock icon */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-3xl gradient-to-br from-teal-100 to-cyan-100 border border-teal-200 flex items-center justify-center shadow-sm">
              <LockClosedIcon className="w-10 h-10 text-teal-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-slate-500 text-base mb-2">
            You need to <span className="font-semibold text-teal-700">log in first</span> to access this page.
          </p>
          <p className="text-slate-400 text-sm mb-7">
            Please sign in to your DoctorTracker account to create appointments and manage records.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl shadow-md shadow-teal-500/25 transition-all active:scale-[0.98]"
            >
              <LockClosedIcon className="w-4 h-4" />
              Login to Continue
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm transition-all active:scale-[0.98]"
            >
              ← Back to Home
            </button>
          </div>

          {/* Decorative info card */}
          <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-left space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">After logging in you can:</h3>
            {[
              { icon: CalendarIcon, label: 'Book & manage appointments' },
              { icon: StethoscopeIcon, label: 'Add & update doctor records' },
              { icon: PlusIcon, label: 'Create new healthcare entries' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-teal-600" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LOGGED IN — actual Create page ──
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* Simple top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <StethoscopeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Doctor<span className="text-teal-600">Tracker</span>
              </span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-600 hover:text-teal-700 font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create New Entry</h1>
          <p className="text-slate-500 mt-1 text-sm">Add a new appointment or doctor record to the system.</p>
        </div>

        {/* Quick-action cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Book Appointment */}
          <button
            onClick={() => router.push('/')}
            className="group text-left bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md rounded-2xl p-6 transition-all active:scale-[0.98] shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center mb-4 transition-colors">
              <CalendarIcon className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Book Appointment</h2>
            <p className="text-sm text-slate-500">Schedule a new appointment with a doctor.</p>
            <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
              Get started →
            </span>
          </button>

          {/* Add Doctor */}
          <button
            onClick={() => router.push('/')}
            className="group text-left bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md rounded-2xl p-6 transition-all active:scale-[0.98] shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 group-hover:bg-cyan-100 flex items-center justify-center mb-4 transition-colors">
              <StethoscopeIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Add Doctor</h2>
            <p className="text-sm text-slate-500">Register a new specialist in the system.</p>
            <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
              Get started →
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
