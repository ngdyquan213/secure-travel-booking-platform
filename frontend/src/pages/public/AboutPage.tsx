import { Users, Target, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHero } from '../components/SectionHero';
import { FeatureCard } from '../components/FeatureCard';
import { TestimonialCard } from '../components/TestimonialCard';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Travel',
      description:
        'We believe travel enriches lives. Our team is dedicated to making travel accessible and affordable for everyone.',
    },
    {
      icon: Target,
      title: 'Mission-Driven',
      description:
        'Our mission is to simplify travel planning and empower travelers to explore the world with confidence.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description:
        'We maintain high standards in customer service, platform reliability, and travel offerings quality.',
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'We foster a vibrant community of travelers who share experiences, tips, and recommendations.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Travel enthusiast with 15+ years in the tourism industry.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech innovator passionate about building seamless travel solutions.',
    },
    {
      name: 'Emma Wilson',
      role: 'Head of Customer Experience',
      bio: 'Dedicated to ensuring every traveler has an exceptional experience.',
    },
    {
      name: 'David Martinez',
      role: 'Content & Marketing Lead',
      bio: 'Storyteller creating compelling travel content and insights.',
    },
  ];

  return (
    <>
      <SectionHero
        title="About TravelBook"
        subtitle="Discover the story behind your favorite travel platform"
      />

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              TravelBook was founded in 2018 by a group of passionate travelers who believed that booking travel
              should be simple, transparent, and affordable. What started as a small side project has grown into a
              global platform serving millions of travelers.
            </p>
            <p>
              Our founders experienced the frustration of using multiple websites to book flights, hotels, and tours.
              They dreamed of creating a unified platform where travelers could find everything they need in one place.
              Today, that dream has become a reality.
            </p>
            <p>
              Over the years, we've expanded our offerings, improved our technology, and built a team dedicated to
              customer satisfaction. We're proud to have helped millions of travelers explore the world and create
              unforgettable memories.
            </p>
            <p>
              As we continue to grow, our commitment to our travelers remains unchanged: to provide the best deals,
              exceptional customer service, and a platform that makes travel planning enjoyable and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <FeatureCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">Meet the people making travel magic happen</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-400" />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-blue-600 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '10M+', label: 'Travelers Served' },
              { number: '500+', label: 'Destinations' },
              { number: '50K+', label: 'Hotels & Resorts' },
              { number: '98%', label: 'Customer Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with TravelBook and discover amazing destinations around the world.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </>
  );
}
