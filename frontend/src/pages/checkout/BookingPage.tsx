import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers'
import { ArrowLeft, AlertCircle, CheckCircle, Plane, Calendar, Users } from 'lucide-react'
import * as types from '../types/api'

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<types.Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return
      try {
        const response = await apiClient.getBooking(id)
        setBooking(response.booking)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="container-custom py-12 flex items-center justify-center min-h-96">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container-custom py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="card p-6 bg-red-50 border border-red-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error || 'Booking not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Booking Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Status Card */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking Status</p>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {booking.booking_status.toLowerCase()}
                </h2>
              </div>
              <div className={`px-4 py-2 rounded-lg font-medium text-sm ${getStatusColor(booking.booking_status)}`}>
                {booking.booking_status}
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className="space-y-6">
            {/* Booking Type */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {booking.booking_type.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                  <p className="text-lg font-mono text-gray-900 break-all">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Number of Travelers</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <p className="text-lg font-semibold text-gray-900">{booking.number_of_travelers}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Travel Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <p className="text-lg font-semibold text-gray-900">{formatDate(booking.travel_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(booking.booking_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(booking.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price Summary */}
          <div className="card p-6 sticky top-24 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h3>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Total Price</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(booking.total_price)}
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Payment Status</p>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                booking.payment_status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : booking.payment_status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {booking.payment_status}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-6">
              {booking.booking_status === 'PENDING' && booking.payment_status !== 'COMPLETED' && (
                <button
                  onClick={() => navigate(`/payment/${booking.id}`)}
                  className="w-full btn-primary py-2 text-sm"
                >
                  Complete Payment
                </button>
              )}
              <button className="w-full btn-secondary py-2 text-sm">
                Download Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
