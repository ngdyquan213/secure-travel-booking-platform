import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export const bookingsApi = {
  createBooking: async (data: types.CreateBookingRequest): Promise<types.BookingResponse> => {
    return httpClient.post('/bookings', data)
  },

  getBooking: async (id: string): Promise<types.BookingResponse> => {
    return httpClient.get(`/bookings/${id}`)
  },

  getUserBookings: async (limit = 10, offset = 0): Promise<{ bookings: types.Booking[]; total: number }> => {
    return httpClient.get('/bookings/user/bookings', { params: { limit, offset } })
  },

  cancelBooking: async (id: string): Promise<void> => {
    return httpClient.post(`/bookings/${id}/cancel`, {})
  },

  updateBooking: async (id: string, data: Partial<types.Booking>): Promise<types.BookingResponse> => {
    return httpClient.patch(`/bookings/${id}`, data)
  },

  getBookingHistory: async (limit = 20, offset = 0): Promise<{ bookings: types.Booking[]; total: number }> => {
    return httpClient.get('/bookings/history', { params: { limit, offset } })
  },
}
