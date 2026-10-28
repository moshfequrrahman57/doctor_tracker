'use client';

import { useState } from 'react';
import { XMarkIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, StethoscopeIcon } from './Icons';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onOpenRegister, onSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setServerError('');
    setIsSubmitting(true);

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

      if (onSuccess) {
        onSuccess(res);
      }
      handleClose();
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
  };

  const handleClose = () => {
    setErrors({});
    setServerError('');
    setForm({ email: '', password: '' });
    onClose();
  };

  const handleSwitchToRegister = () => {
    handleClose();
    onOpenRegister();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative w-full max-w-md bg-background text-foreground rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-stone-300/50">
        {/* Header */}
        <div className="bg-linear-to-br from-teal-600 to-cyan-500 px-6 pt-8 pb-10 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <StethoscopeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="text-teal-100 text-sm mt-1">Sign in to DoctorTracker</p>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Card */}
        <div className="px-6 py-6 -mt-4 relative">
          <div className="bg-background text-foreground rounded-xl shadow-sm border border-stone-300/70 p-5">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {serverError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  <span>⚠️</span>
                  <span>{serverError}</span>
                </div>
              )}
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm text-foreground bg-white border rounded-xl outline-none transition-all
                      ${errors.email
                        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
                        : 'border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    <LockClosedIcon className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 text-sm text-foreground bg-white border rounded-xl outline-none transition-all
                      ${errors.password
                        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
                        : 'border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-teal-700 hover:text-teal-800 font-semibold transition-colors"
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
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-foreground mt-5 pb-1">
            New to DoctorTracker?{' '}
            <button
              onClick={handleSwitchToRegister}
              className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2 transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
