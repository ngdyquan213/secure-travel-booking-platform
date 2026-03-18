import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Tour {
  id: string;
  title: string;
  destination: string;
  duration: string;
  groupSize: number;
  rating: number;
  price: number;
  description: string;
  image?: string;
}

const ToursSearch: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    destination: '',
    date: '',
    guests: '1',
    sortBy: 'popular',
  });
  const [tours, setTours] = useState<Tour[]>([
    {
      id: '1',
      title: 'NYC City Explorer',
      destination: 'New York',
      duration: '3 days',
      groupSize: 15,
      rating: 4.8,
      price: 399,
      description: 'Discover the best of New York City with guided tours',
    },
    {
      id: '2',
      title: 'Statue of Liberty & Ellis Island',
      destination: 'New York',
      duration: '1 day',
      groupSize: 25,
      rating: 4.9,
      price: 129,
      description: 'Visit the iconic Statue of Liberty and Ellis Island',
    },
    {
      id: '3',
      title: 'Broadway Show & Dinner',
      destination: 'New York',
      duration: '1 day',
      groupSize: 8,
      rating: 4.7,
      price: 249,
      description: 'Experience a Broadway show with dinner included',
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.destination || !filters.date) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Explore Tours</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <Input
              label="Destination"
              placeholder="Where to?"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              icon={<MapPin size={18} />}
            />
            <Input
              label="Date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <select
                value={filters.guests}
                onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
            <div></div>
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
                <option value="popular">Most Popular</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Rating: High to Low</option>
                <option value="duration">Duration</option>
              </select>

              <h3 className="font-bold mt-6 mb-4">Price Range</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded text-sm" />
                <input type="number" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded text-sm" />
              </div>

              <h3 className="font-bold mt-6 mb-4">Duration</h3>
              {['Half day', '1 day', '2-3 days', '4+ days'].map((duration) => (
                <label key={duration} className="flex items-center gap-2 text-sm mb-2">
                  <input type="checkbox" className="rounded" />
                  {duration}
                </label>
              ))}

              <h3 className="font-bold mt-6 mb-4">Rating</h3>
              {[5, 4, 3].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-sm mb-2">
                  <input type="checkbox" className="rounded" />
                  {rating}+ stars
                </label>
              ))}
            </div>
          </div>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <MapPin className="text-primary" size={48} />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2">{tour.title}</h3>
                    <p className="text-gray-600 mb-4 flex-1">{tour.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Max {tour.groupSize} guests</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {Array(Math.round(tour.rating)).fill('⭐')}
                      </div>
                      <span className="font-semibold text-gray-700">{tour.rating}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">${tour.price}</p>
                        <p className="text-sm text-gray-600">per person</p>
                      </div>
                      <Button onClick={() => navigate(`/bookings/tour-${tour.id}`)}>
                        Book Tour
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursSearch;
