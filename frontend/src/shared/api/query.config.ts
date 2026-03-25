export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 1,
  retryDelay: 1000,
} as const

export const QUERY_KEYS = {
  auth: ['auth'],
  profile: ['auth', 'profile'],
  flights: ['flights'],
  flightSearch: (query: string) => ['flights', 'search', query],
  flightDetail: (id: string) => ['flights', id],
  hotels: ['hotels'],
  hotelSearch: (query: string) => ['hotels', 'search', query],
  hotelDetail: (id: string) => ['hotels', id],
  tours: ['tours'],
  tourDetail: (id: string) => ['tours', id],
  bookings: ['bookings'],
  bookingDetail: (id: string) => ['bookings', id],
  payments: ['payments'],
  paymentDetail: (id: string) => ['payments', id],
  documents: ['documents'],
  coupons: ['coupons'],
  travelers: ['travelers'],
  notifications: ['notifications'],
  admin: {
    dashboard: ['admin', 'dashboard'],
    users: ['admin', 'users'],
    bookings: ['admin', 'bookings'],
    payments: ['admin', 'payments'],
  },
} as const
