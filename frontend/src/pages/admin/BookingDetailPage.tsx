import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

export function BookingDetailPage() {
  const { id } = useParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getAllBookings(50, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load booking detail.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const booking = useMemo(() => bookings.find((item) => item.id === id) ?? null, [bookings, id])

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading booking detail...</div>
  }

  if (error || !booking) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || 'Booking not found.'}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Admin booking detail</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{booking.booking_code ?? booking.id}</h1>
        </div>
        <Link to="/admin/bookings" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Back to bookings
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Status</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{booking.booking_status}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Payment status</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{booking.payment_status}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Booked at</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{formatDate(booking.booking_date)}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Value</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</p>
        </div>
      </div>
    </div>
  )
}
