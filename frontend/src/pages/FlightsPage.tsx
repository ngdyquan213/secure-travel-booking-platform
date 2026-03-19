import { useState } from 'react'
import { apiClient } from '../services/api'
import { formatCurrency, formatDateTime, formatDuration } from '../utils/helpers'
import { Plane, AlertCircle, Calendar, Users, ArrowRight } from 'lucide-react'
import * as types from '../types/api'

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<types.FlightSearchParams>({
    departure_airport: '',
    arrival_airport: '',
    departure_date: '',
    passenger_count: 1,
  })
  const [flights, setFlights] = useState<types.Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.searchFlights(searchParams)
      setFlights(response.flights)
      setSearched(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search flights')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams({
      ...searchParams,
      [name]: name === 'passenger_count' ? parseInt(value) : value,
    })
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Flights</h1>
        <p className="text-gray-600">Find and book flights to your favorite destinations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Search Flights</h2>

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Departure Airport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Airport
                </label>
                <input
                  type="text"
                  name="departure_airport"
                  value={searchParams.departure_airport}
                  onChange={handleInputChange}
                  placeholder="e.g., JFK"
                  className="input-field"
                />
              </div>

              {/* Arrival Airport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrival Airport
                </label>
                <input
                  type="text"
                  name="arrival_airport"
                  value={searchParams.arrival_airport}
                  onChange={handleInputChange}
                  placeholder="e.g., LAX"
                  className="input-field"
                />
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Date
                </label>
                <input
                  type="date"
                  name="departure_date"
                  value={searchParams.departure_date}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers
                </label>
                <select
                  name="passenger_count"
                  value={searchParams.passenger_count}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} passenger{n !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 mt-6 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {error && (
            <div className="card p-4 bg-red-50 border border-red-200 flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!searched && (
            <div className="card p-12 text-center">
              <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search for flights</h3>
              <p className="text-gray-600">Enter your travel details to see available flights</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
              </div>
            </div>
          )}

          {searched && !loading && flights.length === 0 && (
            <div className="card p-12 text-center">
              <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Flight Cards */}
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{flight.airline}</h3>
                      <span className="text-sm text-gray-600 font-mono">{flight.flight_number}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{flight.departure_time.slice(11, 16)}</p>
                        <p className="text-sm text-gray-600">{flight.departure_airport}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className="text-center text-xs text-gray-500">
                          {formatDuration(flight.duration)}
                        </div>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-gray-900">{flight.arrival_time.slice(11, 16)}</p>
                        <p className="text-sm text-gray-600">{flight.arrival_airport}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Aircraft: {flight.aircraft_type} • Available seats: {flight.available_seats}
                    </p>
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col items-end gap-3">
                    <div>
                      <p className="text-3xl font-bold text-primary-600">{formatCurrency(flight.price)}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <button className="btn-primary py-2 px-6">Select</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
