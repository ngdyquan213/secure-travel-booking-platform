// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:id',
  CONTACT: '/contact',
} as const

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
} as const

// Protected routes
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  FLIGHTS: '/flights',
  HOTELS: '/hotels',
  TOURS: '/tours',
  FLIGHT_DETAIL: '/flights/:id',
  HOTEL_DETAIL: '/hotels/:id',
  TOUR_DETAIL: '/tours/:id',
} as const

// Checkout routes
export const CHECKOUT_ROUTES = {
  BOOKING: '/checkout/booking/:type/:id',
  TRAVELERS: '/checkout/travelers',
  PAYMENT: '/checkout/payment/:bookingId',
  CONFIRMATION: '/checkout/confirmation/:bookingId',
} as const

// Account routes
export const ACCOUNT_ROUTES = {
  PROFILE: '/account/profile',
  BOOKINGS: '/account/bookings',
  DOCUMENTS: '/account/documents',
  WALLET: '/account/wallet',
  SETTINGS: '/account/settings',
  TRAVELERS: '/account/travelers',
  NOTIFICATIONS: '/account/notifications',
  SUPPORT: '/account/support',
} as const

// Admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  BOOKINGS: '/admin/bookings',
  DOCUMENTS: '/admin/documents',
  PAYMENTS: '/admin/payments',
  SETTINGS: '/admin/settings',
} as const

// Error routes
export const ERROR_ROUTES = {
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
} as const

export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...PROTECTED_ROUTES,
  ...CHECKOUT_ROUTES,
  ...ACCOUNT_ROUTES,
  ...ADMIN_ROUTES,
  ...ERROR_ROUTES,
} as const
