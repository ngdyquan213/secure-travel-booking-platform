import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HandCoins } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

export function RefundsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(50, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load refund history.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const refundCandidates = useMemo(
    () => bookings.filter((booking) => booking.booking_status === 'CANCELLED' || booking.payment_status === 'REFUNDED'),
    [bookings]
  )

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading refund activity...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Refund activity</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Cancelled and refunded bookings</h1>
        <p className="mt-2 text-gray-600">A consolidated view of bookings that have entered the cancellation or refund flow.</p>
      </div>

      {refundCandidates.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <HandCoins className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">No refund cases yet</h2>
          <p className="mt-2 text-gray-600">When a booking is cancelled or refunded, it will appear here for quick tracking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {refundCandidates.map((booking) => (
            <Link
              key={booking.id}
              to={`/account/refunds/${booking.id}`}
              className="flex items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200"
            >
              <div>
                <p className="font-semibold text-gray-900">{booking.booking_code ?? booking.id}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {booking.booking_type} • cancelled on or after {formatDate(booking.booking_date)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</p>
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                  Open details
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
