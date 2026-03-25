import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, BookOpen, HandCoins, Wallet } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency } from '@/shared/lib/helpers'
import type { AdminStats } from '@/shared/types/api'

export function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await apiClient.getAdminStats()
        setStats(response)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard summary.')
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [])

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading admin dashboard...</div>
  }

  if (error || !stats) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || 'No dashboard data available.'}</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Operational summary</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Bookings observed</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_bookings}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Revenue snapshot</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Pending approvals</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pending_approvals}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Users surfaced</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_users}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Link to="/admin/bookings" className="rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-primary-200">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Bookings queue</h2>
          <p className="mt-2 text-sm text-gray-600">Inspect booking volume, status spread, and booking-level drill-down.</p>
        </Link>
        <Link to="/admin/refunds" className="rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-primary-200">
          <HandCoins className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Refund operations</h2>
          <p className="mt-2 text-sm text-gray-600">Track cancellation fallout and follow up on refund-related workload.</p>
        </Link>
        <Link to="/admin/operations" className="rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-primary-200">
          <Activity className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Operations board</h2>
          <p className="mt-2 text-sm text-gray-600">Use the current implementation status board to guide manual follow-up.</p>
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-slate-950 p-6 text-white">
        <div className="flex items-start gap-3">
          <Wallet className="mt-1 h-5 w-5 text-cyan-300" />
          <p className="text-sm text-slate-200">
            This dashboard intentionally reflects the backend summary endpoint that exists today. It avoids inventing admin aggregates that the API does not actually expose.
          </p>
        </div>
      </div>
    </div>
  )
}
