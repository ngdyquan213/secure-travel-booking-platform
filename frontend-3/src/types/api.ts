// Auth Types
export interface User {
  id: string
  email: string
  name: string
  date_of_birth?: string
  nationality?: string
  passport_number?: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
  expires_in: number
}

export interface TokenRefreshResponse {
  access_token: string
  token_type: string
  expires_in: number
}

// Flight Types
export interface Flight {
  id: string
  airline: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  departure_time: string
  arrival_time: string
  duration: number
  available_seats: number
  price: number
  aircraft_type: string
  created_at: string
}

export interface FlightSearchParams {
  departure_airport: string
  arrival_airport: string
  departure_date: string
  return_date?: string
  passenger_count: number
  limit?: number
  offset?: number
}

export interface FlightSearchResponse {
  flights: Flight[]
  total: number
  limit: number
  offset: number
}

// Hotel Types
export interface Hotel {
  id: string
  name: string
  location: string
  city: string
  country: string
  rating: number
  price_per_night: number
  available_rooms: number
  amenities: string[]
  description: string
  created_at: string
}

export interface HotelSearchParams {
  city: string
  check_in_date: string
  check_out_date: string
  room_count: number
  limit?: number
  offset?: number
}

export interface HotelSearchResponse {
  hotels: Hotel[]
  total: number
  limit: number
  offset: number
}

// Tour Types
export interface Tour {
  id: string
  name: string
  destination: string
  description: string
  duration_days: number
  price: number
  available_slots: number
  start_date: string
  end_date: string
  activities: string[]
  created_at: string
}

export interface TourSearchParams {
  destination?: string
  limit?: number
  offset?: number
}

export interface TourSearchResponse {
  tours: Tour[]
  total: number
  limit: number
  offset: number
}

// Booking Types
export type BookingType = 'FLIGHT' | 'HOTEL' | 'TOUR'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: string
  user_id: string
  booking_type: BookingType
  flight_id?: string
  hotel_id?: string
  tour_id?: string
  booking_status: BookingStatus
  total_price: number
  booking_date: string
  travel_date: string
  number_of_travelers: number
  payment_status: string
  created_at: string
  updated_at: string
}

export interface CreateBookingRequest {
  booking_type: BookingType
  flight_id?: string
  hotel_id?: string
  tour_id?: string
  number_of_travelers: number
  travel_date: string
  special_requests?: string
}

export interface BookingResponse {
  booking: Booking
}

// Payment Types
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Payment {
  id: string
  booking_id: string
  amount: number
  currency: string
  payment_status: PaymentStatus
  payment_method?: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

export interface InitiatePaymentRequest {
  booking_id: string
  payment_method: string
  idempotency_key: string
}

export interface InitiatePaymentResponse {
  payment_id: string
  booking_id: string
  amount: number
  payment_status: PaymentStatus
  payment_url?: string
  created_at: string
}

// Document Types
export interface Document {
  id: string
  user_id: string
  document_type: string
  file_url: string
  file_name: string
  upload_date: string
  expiry_date?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface DocumentUploadRequest {
  document_type: string
  file: File
}

// Error Response
export interface ApiErrorResponse {
  error_code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Admin Types
export interface AdminStats {
  total_users: number
  total_bookings: number
  total_revenue: number
  pending_approvals: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
}
