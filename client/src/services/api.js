/**
 * API Service
 * Centralized API calls using axios
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (token) => api.post('/auth/google', { token }),
  getMe: () => api.get('/auth/me')
};

// Transaction API
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getOne: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`)
};

// Report API
export const reportAPI = {
  getSummary: (params) => api.get('/reports/summary', { params }),
  exportCSV: (params) => {
    return axios({
      url: `${API_URL}/reports/export/csv`,
      method: 'GET',
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
  },
  exportPDF: (params) => {
    return axios({
      url: `${API_URL}/reports/export/pdf`,
      method: 'GET',
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
  }
};

// User API
export const userAPI = {
  updateProfile: (data) => api.put('/user/profile', data),
  updateBudget: (data) => api.put('/user/budget', data),
  updateSettings: (data) => api.put('/user/settings', data),
  deleteAccount: () => api.delete('/user/account')
};

export default api;
