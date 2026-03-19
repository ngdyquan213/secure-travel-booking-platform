import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Auth endpoints
export const authAPI = {
  register: (data: { email: string; password: string; full_name: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (refresh_token: string) =>
    apiClient.post('/auth/refresh', { refresh_token }),
  getCurrentUser: () => apiClient.get('/users/me'),
  updateProfile: (data: any) => apiClient.put('/users/me', data),
};

// Flights endpoints
export const flightsAPI = {
  search: (params: any) => apiClient.get('/flights', { params }),
  getDetails: (id: string) => apiClient.get(`/flights/${id}`),
};

// Hotels endpoints
export const hotelsAPI = {
  search: (params: any) => apiClient.get('/hotels', { params }),
  getDetails: (id: string) => apiClient.get(`/hotels/${id}`),
  getRooms: (hotelId: string) => apiClient.get(`/hotels/${hotelId}/rooms`),
};

// Tours endpoints
export const toursAPI = {
  search: (params: any) => apiClient.get('/tours', { params }),
  getDetails: (id: string) => apiClient.get(`/tours/${id}`),
};

// Bookings endpoints
export const bookingsAPI = {
  create: (data: any) => apiClient.post('/bookings', data),
  getList: (params?: any) => apiClient.get('/bookings', { params }),
  getDetails: (id: string) => apiClient.get(`/bookings/${id}`),
  cancel: (id: string) => apiClient.post(`/bookings/${id}/cancel`),
};

// Payments endpoints
export const paymentsAPI = {
  initiatePayment: (data: any) => apiClient.post('/payments', data),
  getPaymentStatus: (id: string) => apiClient.get(`/payments/${id}`),
};

// Coupons endpoints
export const couponsAPI = {
  validate: (code: string) => apiClient.post('/coupons/validate', { code }),
};

// Admin endpoints
export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getBookings: (params?: any) => apiClient.get('/admin/bookings', { params }),
  getUsers: (params?: any) => apiClient.get('/admin/users', { params }),
};
