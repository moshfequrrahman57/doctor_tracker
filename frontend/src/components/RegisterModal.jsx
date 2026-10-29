'use client';

import { useState } from 'react';
import { XMarkIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, StethoscopeIcon, PhoneIcon } from './Icons';
import { api } from '../lib/api';

const SEX_OPTIONS = ['Male', 'Female'];

export default function RegisterModal({ isOpen, onClose, onOpenLogin, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    sex: '',
    address: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal info, 2 = account credentials

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!form.age) newErrors.age = 'Age is required';
    else if (isNaN(form.age) || Number(form.age) < 1 || Number(form.age) > 120)
      newErrors.age = 'Enter a valid age (1–120)';

    if (!form.sex) newErrors.sex = 'Please select your sex';

    if (!form.address.trim()) newErrors.address = 'Address is required';

    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[0-9+\-\s()]{7,15}$/.test(form.mobile.trim()))
      newErrors.mobile = 'Enter a valid mobile number';

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email address';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setServerError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setServerError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        age: form.age ? Number(form.age) : undefined,
        sex: form.sex,
        address: form.address.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
      };

      const res = await api.register(payload);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ ...res, email: payload.email });
        } else if (onOpenLogin) {
          onOpenLogin();
        } else {
          handleClose();
        }
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLogin = () => {
    handleClose();
    onOpenLogin();
  };

  const handleClose = () => {
    setStep(1);
    setErrors({});
    setServerError('');
    setSuccessMessage('');
    setForm({ name: '', email: '', age: '', sex: '', address: '', mobile: '', password: '', confirmPassword: '' });
    if (onClose) onClose();
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 text-sm text-foreground bg-white border rounded-xl outline-none transition-all ${
      errors[field]
        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
        : 'border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
    }`;

  const inputWithIconClass = (field) =>
    `w-full pl-9 pr-3 py-2.5 text-sm text-foreground bg-white border rounded-xl outline-none transition-all ${
      errors[field]
        ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300'
        : 'border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative w-full max-w-md bg-background text-foreground rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col border border-stone-300/50">
        {/* Header */}
        <div className="bg-linear-to-br from-teal-600 to-cyan-500 px-6 pt-7 pb-9 text-white text-center shrink-0">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <StethoscopeIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-teal-100 text-xs mt-1">Join DoctorTracker — it&apos;s free</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step === s
                      ? 'bg-white text-teal-700 border-white'
                      : step > s
                      ? 'bg-teal-400 text-white border-teal-300'
                      : 'bg-transparent text-white/60 border-white/40'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 2 && <div className={`w-10 h-0.5 ${step > s ? 'bg-teal-300' : 'bg-white/30'}`} />}
              </div>
            ))}
          </div>
          <p className="text-teal-100 text-[11px] mt-1">
            {step === 1 ? 'Personal Information' : 'Account Credentials'}
          </p>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto flex-1 px-6 py-5 -mt-4">
          <div className="bg-background text-foreground rounded-xl shadow-sm border border-stone-300/70 p-4">

            {/* ─── STEP 1: Personal Info ─── */}
            {step === 1 && (
              <form onSubmit={handleNext} noValidate className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. John Doe"
                      className={inputWithIconClass('name')}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-rose-500 mt-0.5">{errors.name}</p>}
                </div>

                {/* Age & Sex in row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Age *</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={form.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      placeholder="e.g. 30"
                      className={inputClass('age')}
                    />
                    {errors.age && <p className="text-xs text-rose-500 mt-0.5">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Sex *</label>
                    <select
                      value={form.sex}
                      onChange={(e) => handleChange('sex', e.target.value)}
                      className={`${inputClass('sex')} text-foreground`}
                    >
                      <option value="">Select...</option>
                      {SEX_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.sex && <p className="text-xs text-rose-500 mt-0.5">{errors.sex}</p>}
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <PhoneIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="+880 1xxx-xxxxxx"
                      className={inputWithIconClass('mobile')}
                    />
                  </div>
                  {errors.mobile && <p className="text-xs text-rose-500 mt-0.5">{errors.mobile}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Address *</label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Street, City, Country"
                    className={`${inputClass('address')} resize-none`}
                  />
                  {errors.address && <p className="text-xs text-rose-500 mt-0.5">{errors.address}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/25 transition-all active:scale-[0.98]"
                >
                  Next: Account Details →
                </button>
              </form>
            )}

            {/* ─── STEP 2: Account Credentials ─── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                {serverError && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    <span>⚠️</span>
                    <span>{serverError}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
                    <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={inputWithIconClass('email')}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Password *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <LockClosedIcon className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Min. 6 characters"
                      className={`${inputWithIconClass('password')} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-rose-500 mt-0.5">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Confirm Password *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <LockClosedIcon className="w-4 h-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Repeat your password"
                      className={`${inputWithIconClass('confirmPassword')} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-500 mt-0.5">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password strength hint */}
                {form.password && (
                  <div className="flex gap-1 mt-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          form.password.length >= i * 3
                            ? form.password.length >= 10
                              ? 'bg-emerald-500'
                              : form.password.length >= 7
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                            : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setErrors({}); }}
                    className="flex-1 py-2.5 px-4 bg-white hover:bg-stone-100 text-foreground text-sm font-semibold border border-stone-300/80 rounded-xl transition-all active:scale-[0.98]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || Boolean(successMessage)}
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/25 transition-all disabled:opacity-60 active:scale-[0.98]"
                  >
                    {successMessage ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Redirecting to login...
                      </span>
                    ) : isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-foreground mt-4 pb-1">
            Already have an account?{' '}
            <button
              onClick={handleSwitchToLogin}
              className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
