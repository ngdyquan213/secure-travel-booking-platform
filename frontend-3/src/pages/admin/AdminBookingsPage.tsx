import { useQuery } from '../../hooks/useQuery'
import { BookOpen, Calendar } from 'lucide-react'
import * as types from '../../types/api'

export default function AdminBookingsPage() {
  const { data, isLoading } = useQuery<{ bookings: types.Booking[]; total: number }>(
    '/admin/bookings?limit=20&offset=0'
  )

  const bookings = data?.bookings || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <div className="text-sm text-gray-600">Total Bookings: {data?.total || 0}</div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">
                      {booking.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.booking_type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.booking_status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${booking.total_price}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(booking.booking_date).toLocaleDateString()}
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
