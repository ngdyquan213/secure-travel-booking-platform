import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarRange, Users } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency, formatDate } from '@/shared/lib/helpers'
import type { Tour } from '@/shared/types/api'

export function TourSchedulesPage() {
  const { id } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTour = async () => {
      if (!id) {
        setError('Missing tour id.')
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.getTourById(id)
        setTour(response)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load tour schedules.')
      } finally {
        setLoading(false)
      }
    }

    void loadTour()
  }, [id])

  if (loading) {
    return <div className="container-custom py-16 text-center text-gray-600">Loading schedules...</div>
  }

  if (error || !tour) {
    return <div className="container-custom py-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error || 'Tour not found.'}</div>
  }

  return (
    <div className="container-custom py-12 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Schedules</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">{tour.name}</h1>
          <p className="mt-2 text-gray-600">Published departures, capacity, and traveler pricing.</p>
        </div>
        <Link to={`/tours/${tour.id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Back to tour detail
        </Link>
      </div>

      <div className="space-y-4">
        {tour.schedules && tour.schedules.length > 0 ? (
          tour.schedules.map((schedule) => (
            <article key={schedule.id} className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <CalendarRange className="h-4 w-4" />
                    {formatDate(schedule.departure_date)} to {formatDate(schedule.return_date)}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                    {schedule.status}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                  <p className="text-sm text-gray-500">Available slots</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{schedule.available_slots}/{schedule.capacity}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {(schedule.price_rules ?? []).map((rule) => (
                  <div key={rule.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-gray-500">{rule.traveler_type}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(rule.price, rule.currency)}</p>
                  </div>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No schedules are currently published for this tour.</p>
          </div>
        )}
      </div>
    </div>
  )
}
