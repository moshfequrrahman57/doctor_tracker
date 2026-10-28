'use client';

import { useState, useEffect, useRef } from 'react';
import {
  StethoscopeIcon,
  SparklesIcon,
  CalendarIcon,
  UserGroupIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
} from './Icons';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAppointmentModal,
  onSeedData,
  isSeeding,
  apiStatus,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'appointments', label: 'Appointments', icon: CalendarIcon },
    { id: 'doctors', label: 'Doctors', icon: UserGroupIcon },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Top Header */}
      <header
        ref={menuRef}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors"
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Brand Logo */}
            <div
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    Doctor<span className="text-teal-600">Tracker</span>
                  </span>
                
                </div>
                <p className="text-[11px] text-slate-400 hidden lg:block -mt-0.5">
                  Appointments & Specialist Management
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Hidden on mobile & tablet < md) */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-teal-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Actions for Desktop & Tablet */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              {/* API Status Pill */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : apiStatus === 'connecting'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
                title={
                  apiStatus === 'connected'
                    ? 'Connected to Express & MongoDB Atlas'
                    : 'Backend API unreachable'
                }
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    apiStatus === 'connected'
                      ? 'bg-emerald-500 animate-pulse'
                      : apiStatus === 'connecting'
                      ? 'bg-amber-500 animate-ping'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="hidden xl:inline">
                  {apiStatus === 'connected'
                    ? 'Atlas Connected'
                    : apiStatus === 'connecting'
                    ? 'Connecting...'
                    : 'API Offline'}
                </span>
                <span className="xl:hidden">
                  {apiStatus === 'connected' ? 'Atlas' : 'Offline'}
                </span>
              </div>

              {/* Seed Demo Data Button */}
              <button
                onClick={onSeedData}
                disabled={isSeeding}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                title="Populate realistic doctors and appointments"
              >
                <SparklesIcon
                  className={`w-4 h-4 text-amber-500 ${
                    isSeeding ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden lg:inline">
                  {isSeeding ? 'Seeding...' : 'Load Demo Data'}
                </span>
                <span className="lg:hidden">Demo</span>
              </button>

              {/* Book Appointment CTA Button */}
              <button
                onClick={onOpenAppointmentModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-sm shadow-teal-600/25 transition-all cursor-pointer active:scale-95"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile Header Right: Quick Action & Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-1.5">
              {/* Quick Compact Book Button */}
              <button
                onClick={onOpenAppointmentModal}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg shadow-xs shadow-teal-600/20 transition-all"
                aria-label="Book Appointment"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>

              {/* Status Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full mx-1 ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : apiStatus === 'connecting'
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-rose-500'
                }`}
                title={`API Status: ${apiStatus}`}
              />

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 active:scale-95"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-slate-800" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-slate-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 border border-teal-100 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppointmentModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/25 transition-all"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSeedData();
                }}
                disabled={isSeeding}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-300 rounded-xl transition-all disabled:opacity-50"
              >
                <SparklesIcon
                  className={`w-4 h-4 text-amber-500 ${
                    isSeeding ? 'animate-spin' : ''
                  }`}
                />
                <span>{isSeeding ? 'Seeding Data...' : 'Load Demo Sample Data'}</span>
              </button>
            </div>

            {/* Mobile API Status Card */}
            <div className="pt-2">
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : apiStatus === 'connecting'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      apiStatus === 'connected'
                        ? 'bg-emerald-500 animate-pulse'
                        : apiStatus === 'connecting'
                        ? 'bg-amber-500 animate-ping'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span>
                    Backend API:{' '}
                    <strong className="capitalize">{apiStatus}</strong>
                  </span>
                </div>
                <span className="text-[11px] opacity-75">
                  {apiStatus === 'connected' ? 'MongoDB Atlas' : 'Localhost:5001'}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile View (< md) */}
     
    </>
  );
}
