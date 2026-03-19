import { Link } from 'react-router-dom';
import { Plane, MapPin, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { FeatureCard } from '../components/FeatureCard';
import { TestimonialCard } from '../components/TestimonialCard';

export function HomePage() {
  const features = [
    {
      icon: Plane,
      title: 'Best Flight Deals',
      description: 'Find the cheapest flights to anywhere in the world with our powerful search engine.',
      href: '/flights',
    },
    {
      icon: MapPin,
      title: 'Accommodations',
      description: 'Choose from thousands of hotels, resorts, and unique stays at the best prices.',
      href: '/hotels',
    },
    {
      icon: Users,
      title: 'Guided Tours',
      description: 'Experience authentic guided tours and activities in destinations around the globe.',
      href: '/tours',
    },
    {
      icon: TrendingUp,
      title: 'Travel Trends',
      description: 'Stay updated with the latest travel trends, tips, and destination insights.',
      href: '/blog',
    },
  ];

  const testimonials = [
    {
      content:
        'TravelBook made planning my trip so easy. Found amazing deals on flights and hotels all in one place!',
      author: 'Jessica Williams',
      role: 'Frequent Traveler',
      rating: 5,
    },
    {
      content:
        'The tour packages are fantastic! Our guide was knowledgeable and the experience was unforgettable.',
      author: 'Marco Rossi',
      role: 'Adventure Seeker',
      rating: 5,
    },
    {
      content:
        'Best platform for travel planning. Customer support was helpful and responsive throughout my booking.',
      author: 'Aisha Patel',
      role: 'Business Traveler',
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <SectionHero
        title="Explore the World with TravelBook"
        subtitle="Your one-stop platform for flights, hotels, tours, and unforgettable travel experiences"
        cta={{ text: 'Start Exploring', href: '/flights' }}
      >
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <Link
            to="/flights"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Flights
          </Link>
          <Link
            to="/hotels"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Hotels
          </Link>
          <Link
            to="/tours"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Tours
          </Link>
        </div>
      </SectionHero>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TravelBook?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer the best selection of flights, accommodations, and travel experiences at competitive
              prices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Getting started is easy. Follow these simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Search & Compare',
                description: 'Find and compare flights, hotels, and tours from multiple providers.',
              },
              {
                step: 2,
                title: 'Book Securely',
                description: 'Complete your booking with our secure payment system with buyer protection.',
              },
              {
                step: 3,
                title: 'Enjoy Your Trip',
                description: 'Get confirmation, travel documents, and support throughout your journey.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of travelers who trust TravelBook for their travel needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign Up Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Read Travel Tips
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
