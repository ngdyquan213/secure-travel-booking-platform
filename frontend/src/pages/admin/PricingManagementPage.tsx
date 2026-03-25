import { useEffect, useState } from 'react'
import { BadgeDollarSign } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatCurrency } from '@/shared/lib/helpers'
import type { Tour } from '@/shared/types/api'

export function PricingManagementPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await apiClient.searchTours({ limit: 20 })
        setTours(response.tours)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load pricing overview.')
      } finally {
        setLoading(false)
      }
    }

    void loadTours()
  }, [])

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading pricing rules...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pricing overview</h1>
      <div className="space-y-4">
        {tours.map((tour) => (
          <div key={tour.id} className="rounded-3xl border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <BadgeDollarSign className="mt-1 h-5 w-5 text-primary-600" />
              <div className="w-full">
                <h2 className="font-semibold text-gray-900">{tour.name}</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {(tour.schedules?.[0]?.price_rules ?? []).map((rule) => (
                    <div key={rule.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-gray-500">{rule.traveler_type}</p>
                      <p className="mt-1 font-semibold text-gray-900">{formatCurrency(rule.price, rule.currency)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
