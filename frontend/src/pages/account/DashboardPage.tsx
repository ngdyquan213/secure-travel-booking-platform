import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, FileText, ShieldCheck, Ticket, Users } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Booking, Document, User } from '@/shared/types/api'

export function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profile, bookingResponse, documentResponse] = await Promise.all([
          apiClient.getMe(),
          apiClient.getUserBookings(6, 0),
          apiClient.getUserDocuments(),
        ])

        setUser(profile)
        setBookings(bookingResponse.bookings)
        setDocuments(documentResponse)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard.')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const stats = useMemo(
    () => ({
      activeTrips: bookings.filter((booking) => booking.booking_status === 'CONFIRMED').length,
      pendingPayments: bookings.filter((booking) => booking.payment_status === 'PENDING').length,
      documentsReady: documents.filter((document) => document.status === 'APPROVED').length,
      totalValue: bookings.reduce((sum, booking) => sum + booking.total_price, 0),
    }),
    [bookings, documents]
  )

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading your travel dashboard...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Account hub</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Welcome back, {user?.name ?? 'traveler'}</h1>
          <p className="mt-2 text-gray-600">A quick view of bookings, travel documents, and next actions.</p>
        </div>
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Review checkout
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Confirmed trips</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeTrips}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Pending payments</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Approved documents</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.documentsReady}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total booked value</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent bookings</h2>
              <p className="mt-1 text-sm text-gray-600">Track status, payment progress, and current travel timeline.</p>
            </div>
            <Link to="/account/bookings" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                No bookings yet. Start with the tour catalog to create your first trip.
              </div>
            ) : (
              bookings.map((booking) => (
                <Link
                  key={booking.id}
                  to={`/account/bookings/${booking.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition hover:border-primary-200 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{booking.booking_code ?? booking.id.slice(0, 8)}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {booking.booking_type} • {formatDate(booking.travel_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(booking.total_price, booking.currency ?? 'USD')}</p>
                    <p className="mt-1 text-sm text-gray-500">{booking.booking_status}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <Link to="/account/profile" className="block rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Profile and access</h3>
                <p className="mt-1 text-sm text-gray-600">Review account identity details and current role visibility.</p>
              </div>
            </div>
          </Link>

          <Link to="/account/documents" className="block rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Document center</h3>
                <p className="mt-1 text-sm text-gray-600">Upload passports, visas, and supporting travel paperwork.</p>
              </div>
            </div>
          </Link>

          <Link to="/account/vouchers" className="block rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <div className="flex items-start gap-3">
              <Ticket className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Voucher downloads</h3>
                <p className="mt-1 text-sm text-gray-600">Export booking vouchers to PDF where available.</p>
              </div>
            </div>
          </Link>

          <Link to="/account/notifications" className="block rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <div className="flex items-start gap-3">
              <Bell className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Notification settings</h3>
                <p className="mt-1 text-sm text-gray-600">Tune booking alerts, security notices, and marketing updates.</p>
              </div>
            </div>
          </Link>

          <Link to="/account/travelers" className="block rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-primary-200">
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Traveler profiles</h3>
                <p className="mt-1 text-sm text-gray-600">Keep passenger details ready for faster checkout next time.</p>
              </div>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  )
}
