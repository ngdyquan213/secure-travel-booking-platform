import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { apiClient } from '../services/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import { Plane, Hotel, MapPin, Ticket, AlertCircle } from 'lucide-react'
import * as types from '../types/api'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<types.Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(5, 0)
        setBookings(response.bookings)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const getBookingIcon = (type: types.BookingType) => {
    switch (type) {
      case 'FLIGHT':
        return <Plane className="w-5 h-5" />
      case 'HOTEL':
        return <Hotel className="w-5 h-5" />
      case 'TOUR':
        return <MapPin className="w-5 h-5" />
      default:
        return <Ticket className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: types.BookingStatus) => {
    const colors: Record<types.BookingStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container-custom py-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Manage your travel bookings and plan your next adventure</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Link
          to="/flights"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Book Flight</h3>
              <p className="text-sm text-gray-600">Find and book flights</p>
            </div>
          </div>
        </Link>

        <Link
          to="/hotels"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Hotel className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Book Hotel</h3>
              <p className="text-sm text-gray-600">Search for hotels</p>
            </div>
          </div>
        </Link>

        <Link
          to="/tours"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Book Tour</h3>
              <p className="text-sm text-gray-600">Explore tour packages</p>
            </div>
          </div>
        </Link>

        <Link
          to="/uploads"
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Ticket className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Documents</h3>
              <p className="text-sm text-gray-600">Upload documents</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/bookings" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>

        {error && (
          <div className="card p-4 bg-red-50 border border-red-200 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start planning your next trip by booking a flight, hotel, or tour.</p>
            <Link to="/flights" className="btn-primary py-2 px-4 inline-block">
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/bookings/${booking.id}`}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {getBookingIcon(booking.booking_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {booking.booking_type.toLowerCase()} Booking
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.booking_status)}`}>
                        {booking.booking_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Booking Date: {formatDate(booking.booking_date)}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(booking.total_price)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
