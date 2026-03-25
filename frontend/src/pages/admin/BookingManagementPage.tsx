import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Calendar } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import type * as types from '@/shared/types/api'
import { formatCurrency } from '@/shared/lib/helpers'

export function BookingManagementPage() {
  const [bookings, setBookings] = useState<types.Booking[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getAllBookings(20, 0)
        setBookings(response.bookings)
        setTotal(response.total)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load admin bookings.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadBookings()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <div className="text-sm text-gray-600">Total Bookings: {total}</div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <BookOpen className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{booking.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-gray-600">{booking.booking_type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          booking.booking_status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/bookings/${booking.id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
