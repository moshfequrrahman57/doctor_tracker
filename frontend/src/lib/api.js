const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof window !== 'undefined' && !headers.Authorization) {
    try {
      const stored = localStorage.getItem('dt_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          headers['Authorization'] = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/auth/me'),

  // Health
  checkHealth: () => request('/health'),

  // Stats
  getStats: () => request('/stats'),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.specialty && params.specialty !== 'All') query.append('specialty', params.specialty);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    const qs = query.toString();
    return request(`/doctors${qs ? `?${qs}` : ''}`);
  },

  getDoctor: (id) => request(`/doctors/${id}`),

  createDoctor: (data) =>
    request('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateDoctor: (id, data) =>
    request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteDoctor: (id) =>
    request(`/doctors/${id}`, {
      method: 'DELETE',
    }),

  // Appointments
  getAppointments: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.doctorId && params.doctorId !== 'All') query.append('doctorId', params.doctorId);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.date) query.append('date', params.date);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    const qs = query.toString();
    return request(`/appointments${qs ? `?${qs}` : ''}`);
  },

  getAppointment: (id) => request(`/appointments/${id}`),

  createAppointment: (data) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAppointment: (id, data) =>
    request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAppointment: (id) =>
    request(`/appointments/${id}`, {
      method: 'DELETE',
    }),

  // Seed demo data
  seedDatabase: () =>
    request('/seed', {
      method: 'POST',
    }),
};
