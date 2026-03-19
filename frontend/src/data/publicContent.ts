import {
  BadgeCheck,
  BookOpen,
  Compass,
  Globe2,
  Headphones,
  HeartHandshake,
  Hotel,
  Map,
  Plane,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export interface TestimonialItem {
  content: string
  author: string
  role: string
  rating: number
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string[]
  category: string
  author: string
  date: string
  image: string
  readTime: number
}

export const homeFeatures: FeatureItem[] = [
  {
    icon: Plane,
    title: 'Best Flight Deals',
    description: 'Find the cheapest flights to anywhere in the world with our powerful search engine.',
    href: '/flights',
  },
  {
    icon: Hotel,
    title: 'Accommodations',
    description: 'Choose from thousands of hotels, resorts, and unique stays at the best prices.',
    href: '/hotels',
  },
  {
    icon: Map,
    title: 'Guided Tours',
    description: 'Experience authentic guided tours and activities in destinations around the globe.',
    href: '/tours',
  },
  {
    icon: BookOpen,
    title: 'Travel Trends',
    description: 'Stay updated with the latest travel trends, tips, and destination insights.',
    href: '/blog',
  },
]

export const testimonials: TestimonialItem[] = [
  {
    content: 'TravelBook made planning my trip so easy. I found amazing deals on flights and hotels in one place.',
    author: 'Jessica Williams',
    role: 'Frequent Traveler',
    rating: 5,
  },
  {
    content: 'The tour packages are fantastic. Our guide was knowledgeable and the entire experience felt effortless.',
    author: 'Marco Rossi',
    role: 'Adventure Seeker',
    rating: 5,
  },
  {
    content: 'Best platform for travel planning. Customer support stayed responsive through every booking change.',
    author: 'Aisha Patel',
    role: 'Business Traveler',
    rating: 5,
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'slow-travel-japan',
    title: 'Slow Travel in Japan: How to Build a Week That Feels Effortless',
    excerpt: 'A practical itinerary for blending Tokyo energy, ryokan rest, and local transit without burnout.',
    content: [
      'Slow travel works best in Japan when you stop trying to check every landmark off a list. Pick fewer cities, stay longer, and use train time as part of the rhythm instead of a rush between stops.',
      'Start with three nights in Tokyo to absorb neighborhoods rather than chasing every district. Then move to a smaller stop such as Hakone or Kanazawa where the pace drops and the meals become part of the memory.',
      'Reserve one unplanned half-day in each city. Those empty blocks usually become your strongest travel moments: a quiet tea house, a local market, or simply recovering before the next leg.',
    ],
    category: 'Travel Tips',
    author: 'Lena Morgan',
    date: '2026-02-12',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
  },
  {
    id: 'lisbon-weekend-guide',
    title: '48 Hours in Lisbon: Food Streets, Tram Views, and River Evenings',
    excerpt: 'Where to eat, what to skip, and how to turn a short Lisbon stop into a balanced city break.',
    content: [
      'Lisbon rewards people who travel by neighborhood. Spend your mornings in Alfama or Graca, then move downhill for lunch and a waterfront evening.',
      'For a short stay, protect your time by choosing one viewpoint at sunset instead of trying to hit all of them. The city is hilly, and overplanning quickly turns scenic into exhausting.',
      'Reserve one dinner near the river and one in a residential district. That contrast gives you a much better read on the city than stacking every meal in tourist-heavy pockets.',
    ],
    category: 'Destinations',
    author: 'Noah Bennett',
    date: '2026-01-28',
    image: 'https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
  },
  {
    id: 'hotel-check-in-secrets',
    title: 'Hotel Check-In Tactics That Save Time After a Long Flight',
    excerpt: 'Five small booking habits that reduce stress before you even reach the front desk.',
    content: [
      'The best hotel experience starts before arrival. Message the property with your arrival window, special requests, and loyalty details in one short note.',
      'If you land early, ask for bag drop and workspace access rather than pushing for guaranteed early check-in. Hotels can often offer a practical compromise faster than a room.',
      'Keep one offline note with your reservation number, address, and transfer details. That single habit solves more arrival friction than most premium upgrades.',
    ],
    category: 'Hotels & Stays',
    author: 'Priya Sharma',
    date: '2025-12-19',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    readTime: 4,
  },
  {
    id: 'street-food-confidence',
    title: 'How to Eat Street Food With Confidence in a New Country',
    excerpt: 'Simple signals travelers can use to choose stalls well without losing the spontaneity.',
    content: [
      'Street food is usually safest when turnover is high, the menu is focused, and the cooking happens in front of you. Long lines from local office workers tell you more than glossy signage.',
      'Choose your first stall at lunch, not late at night. You will get fresher volume, a clearer look at preparation, and a better chance to calibrate your comfort level.',
      'Do not turn every meal into a risk assessment. Pick one or two sensible rules, follow them consistently, and enjoy the place you came to experience.',
    ],
    category: 'Food & Dining',
    author: 'Mateo Alvarez',
    date: '2025-11-07',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
  },
  {
    id: 'remote-work-bali',
    title: 'Balancing Remote Work and Beach Time in Bali',
    excerpt: 'A realistic way to keep productive mornings while still treating the trip like a trip.',
    content: [
      'Remote work travel fails when every day tries to do both jobs fully. Set a hard finish time for work and protect it with the same discipline you would use at home.',
      'Stay close to the environment you value most. If sunset and beach access matter, choose that first and work around it instead of adding ninety-minute transfers to every day.',
      'Use one coworking pass for structure, but do not oversubscribe yourself to networking events. Most people need fewer social add-ons and more recovery time.',
    ],
    category: 'Culture',
    author: 'Hannah Lee',
    date: '2025-10-14',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    readTime: 7,
  },
  {
    id: 'family-trip-packing',
    title: 'Family Packing Systems That Actually Survive Airport Day',
    excerpt: 'A calmer carry-on setup for parents traveling with children and tight connections.',
    content: [
      'Packing for families improves when each child has one predictable system. Think color-coded pouch, one change of clothes, one comfort item, and one snack pocket.',
      'The real goal is not packing lighter. It is reducing decision-making while moving through check-in, security, boarding, and the first two hours after arrival.',
      'Treat the first day bag as a separate kit from the rest of the luggage. If the trip starts smoothly, the whole itinerary feels more manageable.',
    ],
    category: 'Travel Tips',
    author: 'Sofia Turner',
    date: '2025-09-03',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
  },
]

export const serviceCards = [
  {
    icon: Plane,
    title: 'Flight Booking',
    description: 'Compare routes, carriers, layovers, and baggage rules in one streamlined flow.',
    bullets: ['Flexible date search', 'Fare comparison', 'Instant confirmations'],
  },
  {
    icon: Hotel,
    title: 'Hotel & Accommodation',
    description: 'Browse curated stays from city hotels to boutique escapes and family-ready apartments.',
    bullets: ['Verified guest reviews', 'Neighborhood insights', 'Room-type filters'],
  },
  {
    icon: Compass,
    title: 'Tours & Activities',
    description: 'Book small-group experiences and destination highlights without fragmented vendors.',
    bullets: ['Local guide options', 'Mobile vouchers', 'Day-trip planning'],
  },
  {
    icon: ShieldCheck,
    title: 'Travel Insurance',
    description: 'Add practical protection for delays, cancellations, and unexpected trip disruption.',
    bullets: ['Trip interruption coverage', 'Medical assistance', 'Simple claims guidance'],
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Reach travel support across booking, itinerary changes, and on-the-road questions.',
    bullets: ['Always-on assistance', 'Booking help', 'Issue escalation'],
  },
  {
    icon: Wallet,
    title: 'Planning Tools',
    description: 'Organize budgets, confirmations, and schedules in a clearer booking workspace.',
    bullets: ['Trip summaries', 'Payment tracking', 'Document reminders'],
  },
]

export const companyValues = [
  {
    icon: HeartHandshake,
    title: 'People First',
    description: 'We design travel flows that reduce stress, clarify choices, and respect real human time.',
  },
  {
    icon: ShieldCheck,
    title: 'Security by Default',
    description: 'Bookings, payments, and traveler data are handled with clear trust and control in mind.',
  },
  {
    icon: Sparkles,
    title: 'Thoughtful Experiences',
    description: 'We care about the details between search and arrival, not just the transaction.',
  },
  {
    icon: Globe2,
    title: 'Global Access',
    description: 'Travel should feel reachable, whether you are planning a quick city break or a long-haul trip.',
  },
]

export const teamMembers = [
  {
    name: 'Maya Chen',
    role: 'CEO & Product Lead',
    bio: 'Builds the platform around simpler planning and fewer booking surprises.',
  },
  {
    name: 'Daniel Brooks',
    role: 'Head of Partnerships',
    bio: 'Grows relationships with airlines, stays, and trusted destination operators.',
  },
  {
    name: 'Anika Patel',
    role: 'Customer Experience Director',
    bio: 'Owns support standards and keeps traveler pain points visible inside product decisions.',
  },
  {
    name: 'Leo Martin',
    role: 'Security & Platform Lead',
    bio: 'Focuses on payment safety, platform resilience, and operational trust.',
  },
]

export const companyStats = [
  { label: 'Travelers supported', value: '10M+' },
  { label: 'Destinations covered', value: '500+' },
  { label: 'Hotel partners', value: '1M+' },
  { label: 'Average support CSAT', value: '96%' },
]

export const contactMethods = [
  {
    icon: Headphones,
    title: 'Live Support',
    detail: '24/7 traveler assistance for active bookings and urgent changes.',
  },
  {
    icon: Ticket,
    title: 'Email',
    detail: 'support@travelbook.com with a standard response time under 12 hours.',
  },
  {
    icon: BadgeCheck,
    title: 'Booking Help',
    detail: 'Dedicated help for cancellations, document questions, and itinerary updates.',
  },
]

export const faqs = [
  {
    question: 'Can I modify a booking after payment?',
    answer: 'Yes. Modification options depend on the provider fare rules, but TravelBook keeps the change flow visible before you confirm.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Refund eligibility depends on the booking terms. We surface refundability clearly and help process supported requests.',
  },
  {
    question: 'Is payment information secure?',
    answer: 'Yes. Payment flows are designed around secure handling and clear confirmation checkpoints.',
  },
  {
    question: 'Can I add travel insurance later?',
    answer: 'In many cases yes, but coverage windows vary. It is best to add insurance during checkout for the broadest options.',
  },
  {
    question: 'Which payment methods are supported?',
    answer: 'Common card payments are supported, and availability may expand by region and provider.',
  },
  {
    question: 'How fast does support respond?',
    answer: 'Urgent traveler cases are prioritized immediately, while general support requests are typically answered within the same day.',
  },
]
