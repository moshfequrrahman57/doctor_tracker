'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { StethoscopeIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '../../components/Icons';

export default function LoginPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Check for registration query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        setSuccessNotice('Account created successfully! Please sign in with your credentials.');
        const emailParam = params.get('email');
        if (emailParam) {
          setForm((prev) => ({ ...prev, email: emailParam }));
        }
      }
    }
  }, []);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
    if (successNotice) setSuccessNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setServerError('');

    try {
      const res = await api.login({
        email: form.email.trim(),
        password: form.password,
      });

      if (res.user && res.token) {
        login({
          ...res.user,
          token: res.token,
        });
      }
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <StethoscopeIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Doctor<span className="text-red-800">Tracker</span>
          </h1>
          <p className="text-amber-50 text-lg mt-1">Healthcare & Appointment Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

          {/* Card Header */}
          <div className="gradient-to-br from-teal-600 to-cyan-500 px-6 py-5 text-white text-center">
            <h2 className="text-xl font-bold">Welcome back</h2>
            <p className="text-green-700 text-sm mt-0.5">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Registration success banner */}
              {successNotice && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
                  <span>✅</span>
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Server error banner */}
              {serverError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
                  <span>⚠️</span>
                  <span>{serverError}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
                        : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <LockClosedIcon className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                      errors.password
                        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
                        : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/25 transition-all disabled:opacity-60 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500 mt-5">
              New to DoctorTracker?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}
