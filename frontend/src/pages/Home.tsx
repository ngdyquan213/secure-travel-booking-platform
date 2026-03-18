import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, MapPin, Calendar, Users, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'flight' | 'hotel' | 'tour'>('flight');
  const [flightSearch, setFlightSearch] = useState({
    departure: '',
    arrival: '',
    departDate: '',
    returnDate: '',
    travelers: '1',
  });

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(flightSearch);
    navigate(`/flights?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Book Your Next Adventure</h1>
            <p className="text-xl opacity-90">Find and book flights, hotels, and tours all in one place</p>
          </div>

          {/* Search Tabs */}
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={() => setActiveTab('flight')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'flight'
                  ? 'bg-white text-primary'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <Plane size={20} />
              Flights
            </button>
            <button
              onClick={() => setActiveTab('hotel')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'hotel'
                  ? 'bg-white text-primary'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <Hotel size={20} />
              Hotels
            </button>
            <button
              onClick={() => setActiveTab('tour')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'tour'
                  ? 'bg-white text-primary'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <MapPin size={20} />
              Tours
            </button>
          </div>

          {/* Search Form */}
          {activeTab === 'flight' && (
            <div className="bg-white rounded-xl p-8 shadow-xl">
              <form onSubmit={handleFlightSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <Input
                    placeholder="Departure city"
                    value={flightSearch.departure}
                    onChange={(e) => setFlightSearch({ ...flightSearch, departure: e.target.value })}
                    icon={<Plane size={18} />}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <Input
                    placeholder="Arrival city"
                    value={flightSearch.arrival}
                    onChange={(e) => setFlightSearch({ ...flightSearch, arrival: e.target.value })}
                    icon={<MapPin size={18} />}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depart</label>
                  <Input
                    type="date"
                    value={flightSearch.departDate}
                    onChange={(e) => setFlightSearch({ ...flightSearch, departDate: e.target.value })}
                    icon={<Calendar size={18} />}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                  <Input
                    type="date"
                    value={flightSearch.returnDate}
                    onChange={(e) => setFlightSearch({ ...flightSearch, returnDate: e.target.value })}
                    icon={<Calendar size={18} />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                  <select
                    value={flightSearch.travelers}
                    onChange={(e) => setFlightSearch({ ...flightSearch, travelers: e.target.value })}
                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="md:col-span-5 lg:col-span-1">
                  <Search size={20} />
                  Search
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'hotel' && (
            <div className="bg-white rounded-xl p-8 shadow-xl">
              <form onSubmit={(e) => { e.preventDefault(); navigate('/hotels'); }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input
                  placeholder="Destination"
                  icon={<MapPin size={18} />}
                  required
                />
                <Input
                  type="date"
                  placeholder="Check-in"
                  icon={<Calendar size={18} />}
                  required
                />
                <Input
                  type="date"
                  placeholder="Check-out"
                  icon={<Calendar size={18} />}
                  required
                />
                <Button type="submit">
                  <Search size={20} />
                  Search
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'tour' && (
            <div className="bg-white rounded-xl p-8 shadow-xl">
              <form onSubmit={(e) => { e.preventDefault(); navigate('/tours'); }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input
                  placeholder="Destination"
                  icon={<MapPin size={18} />}
                  required
                />
                <Input
                  type="date"
                  placeholder="Date"
                  icon={<Calendar size={18} />}
                  required
                />
                <Input
                  placeholder="Guests"
                  icon={<Users size={18} />}
                  type="number"
                  defaultValue="1"
                  required
                />
                <Button type="submit">
                  <Search size={20} />
                  Search
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose TravelHub?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '✈️',
              title: 'Best Flight Deals',
              description: 'Compare and book flights from hundreds of airlines at the best prices',
            },
            {
              icon: '🏨',
              title: 'Hotel Deals',
              description: 'Exclusive rates on hotels and resorts worldwide',
            },
            {
              icon: '🗺️',
              title: 'Curated Tours',
              description: 'Handpicked tours and experiences from local experts',
            },
            {
              icon: '🔒',
              title: 'Secure Booking',
              description: 'Your payments and personal data are always secure',
            },
            {
              icon: '💬',
              title: '24/7 Support',
              description: 'Get help whenever you need it, day or night',
            },
            {
              icon: '🎯',
              title: 'Best Price Guarantee',
              description: 'Find a lower price? We'll match it and give you 5% off',
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Traveling?</h2>
          <p className="text-xl mb-8 opacity-90">Sign up now and get exclusive deals on your first booking</p>
          <Button variant="secondary" size="lg" onClick={() => navigate('/register')}>
            Sign Up Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
