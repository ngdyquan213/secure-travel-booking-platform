import { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import { formatCurrency, formatDate } from '../utils/helpers'
import { Users, Ticket, TrendingUp, FileCheck, AlertCircle } from 'lucide-react'
import * as types from '../types/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState<types.AdminStats | null>(null)
  const [users, setUsers] = useState<types.AdminUser[]>([])
  const [bookings, setBookings] = useState<types.Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData, bookingsData] = await Promise.all([
          apiClient.getAdminStats(),
          apiClient.getAllUsers(10, 0),
          apiClient.getAllBookings(10, 0),
        ])
        setStats(statsData)
        setUsers(usersData.users)
        setBookings(bookingsData.bookings)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container-custom py-12 flex items-center justify-center min-h-96">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform statistics and management</p>
      </div>

      {error && (
        <div className="card p-4 bg-red-50 border border-red-200 flex gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
            </div>
            <Users className="w-12 h-12 text-blue-100 bg-blue-50 rounded-lg p-2 text-blue-600" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_bookings || 0}</p>
            </div>
            <Ticket className="w-12 h-12 text-green-100 bg-green-50 rounded-lg p-2 text-green-600" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.total_revenue || 0)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-100 bg-purple-50 rounded-lg p-2 text-purple-600" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.pending_approvals || 0}</p>
            </div>
            <FileCheck className="w-12 h-12 text-orange-100 bg-orange-50 rounded-lg p-2 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-900">Email</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-900">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                      {booking.booking_type.toLowerCase()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                      {formatCurrency(booking.total_price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.booking_status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
