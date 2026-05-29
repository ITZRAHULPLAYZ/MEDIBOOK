import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medibook_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('medibook_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ Auth ============
export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/register', data);
export const getMeApi = () => api.get('/auth/me');

// ============ Doctors ============
export const getDoctors = (params) => api.get('/doctors', { params });
export const getDoctor = (id) => api.get(`/doctors/${id}`);
export const getDoctorSlots = (id, date) =>
  api.get(`/doctors/${id}/slots`, { params: { date } });

// ============ Appointments ============
export const bookAppointment = (data) => api.post('/appointments', data);
export const getAppointments = () => api.get('/appointments');
export const getAppointmentHistory = () => api.get('/appointments/history');
export const rescheduleAppointment = (id, data) =>
  api.put(`/appointments/${id}/reschedule`, data);
export const cancelAppointment = (id) =>
  api.put(`/appointments/${id}/cancel`);

// ============ Patients / Profile ============
export const getProfile = () => api.get('/patients/profile');
export const updateProfile = (data) => api.put('/patients/profile', data);
export const getNotifications = () => api.get('/patients/notifications');
export const markNotificationRead = (id) =>
  api.put(`/patients/notifications/${id}/read`);

// ============ Admin ============
export const getAdminDoctors = () => api.get('/admin/doctors');
export const addDoctor = (data) => api.post('/admin/doctors', data);
export const updateDoctor = (id, data) => api.put(`/admin/doctors/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/admin/doctors/${id}`);
export const getAdminAppointments = (params) =>
  api.get('/admin/appointments', { params });
export const getAnalytics = () => api.get('/admin/analytics');

export default api;
