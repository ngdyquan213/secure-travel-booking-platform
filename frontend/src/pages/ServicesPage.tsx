import { Plane, Hotel, MapPin, BarChart3, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHero } from '../components/SectionHero';
import { FeatureCard } from '../components/FeatureCard';

export function ServicesPage() {
  const services = [
    {
      icon: Plane,
      title: 'Flight Booking',
      description:
        'Search and book flights from hundreds of airlines. Compare prices, find the best deals, and fly to your destination with confidence.',
      features: [
        'Real-time price tracking',
        'Multiple airline options',
        'Flexible date selection',
        'Best price guarantee',
      ],
    },
    {
      icon: Hotel,
      title: 'Hotel & Accommodation',
      description:
        'Choose from thousands of hotels, resorts, vacation rentals, and unique stays. Find the perfect place to rest your head.',
      features: [
        'Verified reviews',
        'Instant confirmation',
        'Free cancellation',
        'Best rate guarantee',
      ],
    },
    {
      icon: MapPin,
      title: 'Tours & Activities',
      description:
        'Discover and book guided tours, adventure activities, and cultural experiences. Explore destinations like a local.',
      features: [
        'Curated experiences',
        'Professional guides',
        'Small group tours',
        'Flexible scheduling',
      ],
    },
    {
      icon: Shield,
      title: 'Travel Insurance',
      description:
        'Protect your investment with comprehensive travel insurance. Coverage for flights, baggage, medical, and more.',
      features: [
        'Medical coverage',
        'Trip cancellation',
        'Baggage protection',
        'Emergency evacuation',
      ],
    },
    {
      icon: Clock,
      title: '24/7 Customer Support',
      description:
        'Our dedicated support team is available round the clock to help you with any questions or issues during your journey.',
      features: [
        'Live chat support',
        'Email assistance',
        'Phone support',
        'Multilingual team',
      ],
    },
    {
      icon: BarChart3,
      title: 'Travel Planning Tools',
      description:
        'Access our collection of travel guides, tips, and planning tools to make the most of your journey.',
      features: [
        'Destination guides',
        'Itinerary planner',
        'Travel checklist',
        'Budget calculator',
      ],
    },
  ];

  return (
    <>
      <SectionHero
        title="Our Services"
        subtitle="Everything you need for a seamless travel experience"
      />

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TravelBook?</h2>
          <p className="text-xl text-gray-600 mb-12">We're committed to making your travel experience exceptional</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '1M+',
                label: 'Hotel Partners',
                description: 'Access to verified accommodations worldwide',
              },
              {
                number: '500+',
                label: 'Destinations',
                description: 'Explore countries, cities, and hidden gems',
              },
              {
                number: '100%',
                label: 'Secure Booking',
                description: 'Encrypted payments and buyer protection',
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            No hidden fees. You see what you pay.
          </p>

          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <div className="space-y-4">
              {[
                { item: 'Flights', detail: 'Best price guaranteed' },
                { item: 'Hotels', detail: 'Price match guarantee' },
                { item: 'Tours', detail: 'Included guide & activities' },
                { item: 'Service Fee', detail: 'Transparent and upfront' },
              ].map((pricing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-blue-200 last:border-b-0"
                >
                  <span className="font-medium text-gray-900">{pricing.item}</span>
                  <span className="text-gray-600">{pricing.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Discover amazing destinations and create unforgettable memories with TravelBook.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/flights"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Flights
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
