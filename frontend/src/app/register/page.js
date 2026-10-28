'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import RegisterModal from '../../components/RegisterModal';

/**
 * /register — wraps the existing RegisterModal component into a full page.
 * The modal is rendered "always open" since this IS the page.
 * On close or login-switch it navigates back to /login.
 */
export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-to-br from-teal-50 via-cyan-50 to-slate-100">
      {/* RegisterModal rendered as a full-page modal (always open) */}
      <RegisterModal
        isOpen={true}
        onClose={() => router.push('/login')}
        onOpenLogin={() => router.push('/login')}
        onSuccess={() => router.replace('/')}
      />
    </div>
  );
}
