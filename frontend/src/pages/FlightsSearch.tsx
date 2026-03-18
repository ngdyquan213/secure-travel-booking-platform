import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { flightsAPI } from '../lib/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Flight {
  id: string;
  airline: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  duration: string;
  stops: number;
}

const FlightsSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
    departDate: searchParams.get('departDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    travelers: searchParams.get('travelers') || '1',
    sortBy: 'price',
  });

  useEffect(() => {
    if (filters.departure && filters.arrival && filters.departDate) {
      searchFlights();
    }
  }, []);

  const searchFlights = async () => {
    setLoading(true);
    try {
      const response = await flightsAPI.search({
        from_airport: filters.departure,
        to_airport: filters.arrival,
        depart_date: filters.departDate,
        return_date: filters.returnDate || undefined,
        passengers: filters.travelers,
      });
      setFlights(response.data.items || response.data);
    } catch (error) {
      toast.error('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.departure || !filters.arrival || !filters.departDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    searchFlights();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Search Flights</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <Input
              label="From"
              placeholder="Departure city"
              value={filters.departure}
              onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
              icon={<Plane size={18} />}
            />
            <Input
              label="To"
              placeholder="Arrival city"
              value={filters.arrival}
              onChange={(e) => setFilters({ ...filters, arrival: e.target.value })}
              icon={<MapPin size={18} />}
            />
            <Input
              label="Depart"
              type="date"
              value={filters.departDate}
              onChange={(e) => setFilters({ ...filters, departDate: e.target.value })}
            />
            <Input
              label="Return"
              type="date"
              value={filters.returnDate}
              onChange={(e) => setFilters({ ...filters, returnDate: e.target.value })}
            />
            <Button type="submit" loading={loading}>
              Search
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="font-bold mb-4">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="price">Price: Low to High</option>
                <option value="duration">Duration: Short to Long</option>
                <option value="departure">Departure Time</option>
              </select>

              <h3 className="font-bold mt-6 mb-4">Price Range</h3>
              <input type="range" className="w-full" />

              <h3 className="font-bold mt-6 mb-4">Stops</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                Non-stop only
              </label>
            </div>
          </div>

          {/* Flight List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <Plane className="text-primary" size={32} />
                </div>
                <p className="mt-4 text-gray-600">Searching for flights...</p>
              </div>
            ) : flights.length > 0 ? (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-semibold text-gray-700">{flight.airline}</span>
                          <span className="text-sm text-gray-500">{flight.stops} stops</span>
                        </div>
                        <div className="flex items-center gap-8 my-4">
                          <div>
                            <p className="text-2xl font-bold">{flight.departure_time.slice(0, 5)}</p>
                            <p className="text-sm text-gray-600">{flight.departure_airport}</p>
                          </div>
                          <div className="flex-1 text-center">
                            <p className="text-sm text-gray-600 mb-1">{flight.duration}</p>
                            <div className="flex-1 h-1 bg-gray-300 rounded mx-2 relative">
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Plane size={16} className="text-primary" />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{flight.arrival_time.slice(0, 5)}</p>
                            <p className="text-sm text-gray-600">{flight.arrival_airport}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">${flight.price}</p>
                        <Button onClick={() => navigate(`/bookings/flight-${flight.id}`)} className="mt-2">
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Plane className="text-gray-300 mx-auto mb-4" size={48} />
                <p className="text-gray-600">No flights found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightsSearch;
