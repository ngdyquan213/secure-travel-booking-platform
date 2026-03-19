import { useQuery, useMutation } from '../../hooks/useQuery'
import { bookingsApi } from './api'
import * as types from '../../types/api'

export function useCreateBooking() {
  return useMutation<types.BookingResponse, types.CreateBookingRequest>(
    (data) => bookingsApi.createBooking(data)
  )
}

export function useBookingById(id: string) {
  return useQuery<types.BookingResponse>(`/bookings/${id}`)
}

export function useUserBookings() {
  return useQuery<{ bookings: types.Booking[]; total: number }>(
    '/bookings/user/bookings?limit=10&offset=0'
  )
}

export function useCancelBooking() {
  return useMutation<void, string>((id) => bookingsApi.cancelBooking(id))
}
