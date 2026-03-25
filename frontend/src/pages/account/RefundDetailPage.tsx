import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HandCoins, TicketSlash } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

export function RefundDetailPage() {
  const { id } = useParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(50, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load refund detail.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const booking = useMemo(
    () =>
      bookings.find(
        (item) => item.id === id && (item.booking_status === 'CANCELLED' || item.payment_status === 'REFUNDED')
      ) ?? null,
    [bookings, id]
  )

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading refund detail...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  if (!booking) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        This refund record is unavailable or has not entered the refund flow.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Refund detail</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{booking.booking_code ?? booking.id}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <HandCoins className="mt-1 h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Estimated refund value</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</p>
              <p className="mt-2 text-sm text-gray-600">The exact refundable amount depends on the cancellation rules applied by backend services.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <TicketSlash className="mt-1 h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Current state</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{booking.payment_status}</p>
              <p className="mt-2 text-sm text-gray-600">Booking status: {booking.booking_status}. Recorded on {formatDate(booking.booking_date)}.</p>
            </div>
          </div>
        </div>
      </div>

      <Link to="/account/refunds" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
        Back to refund history
      </Link>
    </div>
  )
}
