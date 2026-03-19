export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Flights
  flights: {
    search: '/flights/search',
    list: '/flights',
    detail: (id: string) => `/flights/${id}`,
  },
  
  // Hotels
  hotels: {
    search: '/hotels/search',
    list: '/hotels',
    detail: (id: string) => `/hotels/${id}`,
  },
  
  // Tours
  tours: {
    list: '/tours',
    detail: (id: string) => `/tours/${id}`,
  },
  
  // Bookings
  bookings: {
    create: '/bookings',
    list: '/bookings',
    detail: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
    refund: (id: string) => `/bookings/${id}/refund`,
  },
  
  // Payments
  payments: {
    initiate: '/payments/initiate',
    confirm: '/payments/confirm',
    list: '/payments',
    detail: (id: string) => `/payments/${id}`,
  },
  
  // Documents
  documents: {
    upload: '/documents/upload',
    list: '/documents',
    delete: (id: string) => `/documents/${id}`,
  },
  
  // Users
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    travelers: '/users/travelers',
  },
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    bookings: '/admin/bookings',
    payments: '/admin/payments',
  },
} as const

export const API_TIMEOUT = 30000 // 30 seconds
