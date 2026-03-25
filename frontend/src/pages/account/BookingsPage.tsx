import { useEffect, useState } from 'react'
import { BookOpen, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiClient } from '@/shared/api/apiClient'
import type * as types from '@/shared/types/api'
import { formatCurrency } from '@/shared/lib/helpers'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<types.Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(20, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load bookings.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadBookings()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-primary-600">
                      {booking.booking_type}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.booking_status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {new Date(booking.travel_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Travelers: {booking.number_of_travelers}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</p>
                  <Link to={`/account/bookings/${booking.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
