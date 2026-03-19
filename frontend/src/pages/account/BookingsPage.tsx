import { useQuery } from '../../hooks/useQuery'
import { BookOpen, Calendar, MapPin } from 'lucide-react'
import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export default function BookingsPage() {
  const { data, isLoading } = useQuery<{ bookings: types.Booking[]; total: number }>(
    '/bookings/user/bookings?limit=10&offset=0'
  )

  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>
  }

  const bookings = data?.bookings || []

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
                  <p className="text-lg font-bold text-gray-900">${booking.total_price}</p>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
