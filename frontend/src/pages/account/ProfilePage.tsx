import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Hotel,
  Mail,
  MapPin,
  Plane,
  ShieldCheck,
  Ticket,
  User,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/model/auth.store'
import { apiClient } from '@/shared/api/apiClient'
import DocumentManagerSection from '@/shared/components/DocumentManagerSection'
import { formatCurrency, formatDate, getInitials, getStatusColor } from '@/shared/lib/helpers'
import type * as types from '@/shared/types/api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [user, setUser] = useState<types.User | null>(currentUser)
  const [bookings, setBookings] = useState<types.Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profile, bookingResponse] = await Promise.all([
          apiClient.getMe(),
          apiClient.getUserBookings(6, 0),
        ])

        setUser(profile)
        setBookings(bookingResponse.bookings)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    void fetchProfile()
  }, [])

  const bookingCounts = bookings.reduce(
    (summary, booking) => {
      summary.total += 1
      summary.totalSpent += booking.total_price

      if (booking.booking_status === 'CONFIRMED') {
        summary.confirmed += 1
      }

      if (booking.booking_status === 'PENDING') {
        summary.pending += 1
      }

      return summary
    },
    { total: 0, confirmed: 0, pending: 0, totalSpent: 0 }
  )

  const getBookingIcon = (type: types.BookingType) => {
    switch (type) {
      case 'FLIGHT':
        return <Plane className="w-4 h-4" />
      case 'HOTEL':
        return <Hotel className="w-4 h-4" />
      case 'TOUR':
        return <MapPin className="w-4 h-4" />
      default:
        return <Ticket className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-12 flex items-center justify-center min-h-96">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container-custom py-12">
        <button
          onClick={() => navigate('/account/dashboard')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>
        <div className="card p-6 bg-red-50 border border-red-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error || 'Profile not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 text-white">
        <div className="container-custom py-12 lg:py-16">
          <button
            onClick={() => navigate('/account/dashboard')}
            className="inline-flex items-center gap-2 text-sky-100 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/15 text-3xl font-bold backdrop-blur">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-200">Traveler profile</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{user.name}</h1>
                <p className="mt-3 max-w-2xl text-lg text-sky-50/90">
                  Keep track of your account details, booking activity, and access level in one place.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">Member since</p>
              <p className="mt-3 text-3xl font-bold">{formatDate(user.created_at)}</p>
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-3">
                  <span>Account status</span>
                  <span className={`rounded-full px-3 py-1 font-medium ${getStatusColor(user.status || 'ACTIVE')}`}>
                    {user.status || 'ACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Roles</span>
                  <span className="font-medium text-gray-900">{user.roles.length || 1}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Permissions</span>
                  <span className="font-medium text-gray-900">{user.permissions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        {error && (
          <div className="card p-4 bg-red-50 border border-red-200 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <section className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900">Account details</h2>
              <p className="text-gray-600 mt-1 mb-6">Your primary account information on TravelBook.</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <User className="w-5 h-5 text-cyan-700 mb-3" />
                  <p className="text-sm text-gray-500">Full name</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{user.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <Mail className="w-5 h-5 text-cyan-700 mb-3" />
                  <p className="text-sm text-gray-500">Email address</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 break-all">{user.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <Calendar className="w-5 h-5 text-cyan-700 mb-3" />
                  <p className="text-sm text-gray-500">Created at</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(user.created_at)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <ShieldCheck className="w-5 h-5 text-cyan-700 mb-3" />
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{user.username || 'Not set'}</p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent activity</h2>
                  <p className="text-gray-600 mt-1">Your latest bookings and their current status.</p>
                </div>
                <Link to="/account/bookings" className="text-primary-600 hover:text-primary-700 font-medium">
                  View all bookings
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">Once you book a flight, hotel, or tour, it will show up here.</p>
                  <Link to="/tours" className="btn-primary inline-block py-2 px-4">
                    Start booking
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      to={`/account/bookings/${booking.id}`}
                      className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 transition-colors hover:border-cyan-200 hover:bg-slate-50"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                        {getBookingIcon(booking.booking_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <p className="font-semibold text-gray-900 capitalize">
                            {booking.booking_type.toLowerCase()} booking
                          </p>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(booking.booking_status)}`}>
                            {booking.booking_status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                          <span>Travel date: {formatDate(booking.travel_date)}</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(booking.total_price)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <DocumentManagerSection />
          </div>

          <aside className="space-y-6">
            <section className="card p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-gray-900">Travel summary</h2>
              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Total bookings</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{bookingCounts.total}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Confirmed trips</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{bookingCounts.confirmed}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Pending bookings</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{bookingCounts.pending}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Total booked value</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(bookingCounts.totalSpent)}</p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-xl font-bold text-gray-900">Access overview</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500 mb-2">Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {(user.roles.length > 0 ? user.roles : ['traveler']).map((role) => (
                      <span key={role} className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500 mb-2">Permissions</p>
                  {user.permissions.length === 0 ? (
                    <p className="text-sm text-gray-600">Standard traveler access is active on your account.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.slice(0, 8).map((permission) => (
                        <span
                          key={permission}
                          className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
