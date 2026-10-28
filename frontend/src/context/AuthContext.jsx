'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage
  const router = useRouter();

  // On mount, restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dt_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('dt_user');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Call this after a successful login response from the backend */
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('dt_user', JSON.stringify(userData));
    router.replace('/');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dt_user');
    router.push('/login');
  }, [router]);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
