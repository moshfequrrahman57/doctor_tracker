'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import AppointmentsList from '../components/AppointmentsList';
import DoctorsList from '../components/DoctorsList';
import AppointmentModal from '../components/AppointmentModal';
import DoctorModal from '../components/DoctorModal';
import { api } from '../lib/api';

export default function Home() {
  const { isAuthenticated, loading: authLoading, logout, user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [apiStatus, setApiStatus] = useState('connecting');
  const [errorMessage, setErrorMessage] = useState('');

  // Modals
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Auth guard: redirect unauthenticated users to /login ──
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const health = await api.checkHealth().catch(() => null);
      if (!health) {
        setApiStatus('error');
        setErrorMessage(
          'Cannot reach the Express backend server at http://localhost:5001. Please make sure the backend server is running.'
        );
        setLoading(false);
        return;
      }

      setApiStatus(health.database?.status === 'Connected' ? 'connected' : 'connecting');

      const [statsRes, doctorsRes, appointmentsRes] = await Promise.all([
        api.getStats().catch(() => ({ data: null })),
        api.getDoctors().catch(() => ({ data: [] })),
        api.getAppointments().catch(() => ({ data: [] })),
      ]);

      setStats(statsRes?.data || null);
      setDoctors(doctorsRes?.data || []);
      setAppointments(appointmentsRes?.data || []);
    } catch (err) {
      setApiStatus('error');
      setErrorMessage(err.message || 'Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  // Seed sample data handler
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seedDatabase();
      showToast(res.message || 'Sample doctors & appointments created!');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to seed data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Appointment Handlers
  const handleSaveAppointment = async (formData) => {
    if (editingAppt) {
      await api.updateAppointment(editingAppt._id, formData);
      showToast('Appointment updated successfully');
    } else {
      await api.createAppointment(formData);
      showToast('Appointment booked successfully');
    }
    await fetchData();
  };

  const handleDeleteAppointment = async (id) => {
    if (!confirm('Are you sure you want to cancel and delete this appointment?')) return;
    try {
      await api.deleteAppointment(id);
      showToast('Appointment deleted');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to delete appointment', 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateAppointment(id, { status });
      showToast(`Appointment status changed to ${status}`);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Doctor Handlers
  const handleSaveDoctor = async (formData) => {
    if (editingDoctor) {
      await api.updateDoctor(editingDoctor._id, formData);
      showToast('Doctor details updated');
    } else {
      await api.createDoctor(formData);
      showToast('Doctor added successfully');
    }
    await fetchData();
  };

  const handleDeleteDoctor = async (id) => {
    if (
      !confirm(
        'Are you sure you want to delete this doctor? All their associated appointments will also be deleted.'
      )
    )
      return;
    try {
      await api.deleteDoctor(id);
      showToast('Doctor and appointments deleted');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to delete doctor', 'error');
    }
  };

  const handleBookWithDoctor = (doc) => {
    setEditingAppt({ doctor: doc._id });
    setIsApptModalOpen(true);
  };

  // While auth is resolving or user is not yet authenticated, show loading screen
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAppointmentModal={() => {
          setEditingAppt(null);
          setIsApptModalOpen(true);
        }}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
        apiStatus={apiStatus}
        user={user}
        onLogout={logout}
      />

      {/* Offline / Connection Error Banner */}
      {apiStatus === 'error' && (
        <div className="bg-rose-500 text-white px-4 py-3 text-sm shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold">⚠️ Backend Server Offline:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={fetchData}
              className="px-3 py-1 bg-white text-rose-700 font-semibold text-xs rounded-lg shadow-sm hover:bg-rose-50 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            loading={loading}
            onNavigateTab={setActiveTab}
            onOpenAppointmentModal={() => {
              setEditingAppt(null);
              setIsApptModalOpen(true);
            }}
            onOpenDoctorModal={() => {
              setEditingDoctor(null);
              setIsDoctorModalOpen(true);
            }}
            onSeedData={handleSeedData}
            isSeeding={isSeeding}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsList
            appointments={appointments}
            doctors={doctors}
            loading={loading}
            onOpenAppointmentModal={() => {
              setEditingAppt(null);
              setIsApptModalOpen(true);
            }}
            onEditAppointment={(appt) => {
              setEditingAppt(appt);
              setIsApptModalOpen(true);
            }}
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorsList
            doctors={doctors}
            loading={loading}
            onOpenDoctorModal={() => {
              setEditingDoctor(null);
              setIsDoctorModalOpen(true);
            }}
            onEditDoctor={(doc) => {
              setEditingDoctor(doc);
              setIsDoctorModalOpen(true);
            }}
            onDeleteDoctor={handleDeleteDoctor}
            onBookWithDoctor={handleBookWithDoctor}
          />
        )}
      </main>

      {/* Modals */}
      <AppointmentModal
        isOpen={isApptModalOpen}
        onClose={() => {
          setIsApptModalOpen(false);
          setEditingAppt(null);
        }}
        onSubmit={handleSaveAppointment}
        doctors={doctors}
        initialData={editingAppt}
      />

      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => {
          setIsDoctorModalOpen(false);
          setEditingDoctor(null);
        }}
        onSubmit={handleSaveDoctor}
        initialData={editingDoctor}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white transition-all transform animate-bounce ${
            toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'
          }`}
        >
          <span>{toast.type === 'error' ? '❌' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DoctorTracker • Healthcare Management System</span>
          <span className="text-slate-400">Powered by Express.js, MongoDB Atlas &amp; Next.js</span>
        </div>
      </footer>
    </div>
  );
}
