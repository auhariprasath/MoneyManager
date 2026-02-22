import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, Transaction, Budget, Goal, Analytics, Suggestions } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
};

// User API
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  updateRiskProfile: (riskProfile: string) => api.put('/user/risk-profile', { riskProfile }),
  getDashboard: () => api.get('/user/dashboard'),
};

// Transaction API
export const transactionApi = {
  getAll: (params?: { type?: string; category?: string; startDate?: string; endDate?: string }) =>
    api.get<Transaction[]>('/transactions', { params }),
  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),
  create: (data: any) => api.post<Transaction>('/transactions', data),
  update: (id: string, data: any) => api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
  search: (query: string) => api.get<Transaction[]>(`/transactions/search?query=${query}`),
  getStrugglePoints: () => api.get<Transaction[]>('/transactions/struggle-points'),
  getRecurring: () => api.get<Transaction[]>('/transactions/recurring'),
};

// Budget API
export const budgetApi = {
  getAll: (month?: string) => api.get<Budget[]>('/budgets', { params: { month } }),
  getById: (id: string) => api.get<Budget>(`/budgets/${id}`),
  create: (data: any) => api.post<Budget>('/budgets', data),
  update: (id: string, data: any) => api.put<Budget>(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
  getAlerts: (month: string) => api.get('/budgets/alerts', { params: { month } }),
  getSummary: (month: string) => api.get('/budgets/summary', { params: { month } }),
};

// Goal API
export const goalApi = {
  getAll: (status?: string) => api.get<Goal[]>('/goals', { params: { status } }),
  getById: (id: string) => api.get<Goal>(`/goals/${id}`),
  create: (data: any) => api.post<Goal>('/goals', data),
  update: (id: string, data: any) => api.put<Goal>(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
  contribute: (id: string, amount: number) => api.post<Goal>(`/goals/${id}/contribute`, { amount }),
  updateStatus: (id: string, status: string) => api.put<Goal>(`/goals/${id}/status`, { status }),
  getSummary: () => api.get('/goals/summary'),
};

// Analytics API
export const analyticsApi = {
  getDashboard: (startDate?: string, endDate?: string) =>
    api.get<Analytics>('/analytics/dashboard', { params: { startDate, endDate } }),
  getSummary: () => api.get('/analytics/summary'),
};

// Suggestions API
export const suggestionsApi = {
  getAll: () => api.get<Suggestions>('/suggestions'),
  getDailyTip: () => api.get('/suggestions/daily-tip'),
};

export default api;
