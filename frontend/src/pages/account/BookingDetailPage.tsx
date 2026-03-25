import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, CircleDollarSign, FileText, Ticket } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

export function BookingDetailPage() {
  const { id } = useParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cancelling, setCancelling] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(50, 0)
        setBookings(response.bookings)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the booking.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const booking = useMemo(() => bookings.find((item) => item.id === id) ?? null, [bookings, id])

  const handleCancel = async () => {
    if (!booking) return

    setCancelling(true)
    setError('')
    setMessage('')

    try {
      await apiClient.cancelBooking(booking.id)
      setBookings((currentBookings) =>
        currentBookings.map((item) =>
          item.id === booking.id
            ? { ...item, booking_status: 'CANCELLED', status: 'CANCELLED', payment_status: 'CANCELLED' }
            : item
        )
      )
      setMessage('Booking cancellation request was submitted successfully.')
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Cancellation failed.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading booking details...</div>
  }

  if (!booking) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        The requested booking could not be found in your account.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Booking detail</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{booking.booking_code ?? booking.id}</h1>
          <p className="mt-2 text-gray-600">Full traceability for payment, voucher, and supporting documents.</p>
        </div>
        <span className="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
          {booking.booking_status}
        </span>
      </div>

      {(message || error) && (
        <div className={`rounded-2xl p-4 text-sm ${error ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Booking type</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{booking.booking_type}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Travel date
          </p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{formatDate(booking.travel_date)}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <CircleDollarSign className="h-4 w-4" />
            Amount
          </p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Payment</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{booking.payment_status}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">Activity snapshot</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Booked on</p>
              <p className="mt-1 font-semibold text-gray-900">{formatDate(booking.booking_date)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Travelers</p>
              <p className="mt-1 font-semibold text-gray-900">{booking.number_of_travelers}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-gray-500">Internal reference</p>
              <p className="mt-1 break-all font-semibold text-gray-900">{booking.id}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Link to="/account/vouchers" className="flex items-start gap-3 rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <Ticket className="mt-1 h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Voucher center</h3>
              <p className="mt-1 text-sm text-gray-600">Download voucher PDFs for confirmed bookings.</p>
            </div>
          </Link>

          <Link to="/account/documents" className="flex items-start gap-3 rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <FileText className="mt-1 h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Supporting documents</h3>
              <p className="mt-1 text-sm text-gray-600">Review uploaded passports, visas, and related files.</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={cancelling || booking.booking_status === 'CANCELLED'}
            className="w-full rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {booking.booking_status === 'CANCELLED' ? 'Booking already cancelled' : cancelling ? 'Cancelling...' : 'Cancel booking'}
          </button>
        </aside>
      </div>
    </div>
  )
}
