export const APP_NAME = 'TravelBook'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Secure Travel Booking Platform'

export const APP_CONFIG = {
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION,
  author: 'TravelBook Team',
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const

// Feature flags
export const FEATURES = {
  payment: true,
  documents: true,
  admin: true,
  tours: true,
  coupons: true,
  refunds: true,
  notifications: true,
  support: true,
} as const

// Cache duration in milliseconds
export const CACHE_DURATION = {
  SHORT: 1000 * 60, // 1 minute
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const
