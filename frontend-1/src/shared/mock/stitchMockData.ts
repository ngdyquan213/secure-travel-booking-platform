export type CurrencyCode = 'USD' | 'EUR'

export type Tour = {
  activityLevel: string
  availabilityLabel: string
  confirmationLabel: string
  country: string
  durationDays: number
  durationLabel: string
  groupSizeLabel: string
  heroImage: string
  highlights: Array<{
    description: string
    image: string
    title: string
  }>
  id: string
  itinerary: Array<{
    description: string
    title: string
  }>
  location: string
  overview: string[]
  priceFrom: number
  slug: string
  teaser: string
  title: string
  currency: CurrencyCode
}

export type TourSchedule = {
  availability: 'instant' | 'limited'
  currency: CurrencyCode
  id: string
  label: string
  seatsLeft: number
  title: string
  tourId: string
  unitPrice: number
}

export type BookingStatus = 'confirmed' | 'pending_payment' | 'refund_in_progress'

export type Booking = {
  amountPaid: number
  currency: CurrencyCode
  datesLabel: string
  documentState: 'ready' | 'action_required'
  id: string
  paymentLabel: string
  reference: string
  scheduleId: string
  status: BookingStatus
  title: string
  tourId: string
  travelersCount: number
}

export type RefundRequest = {
  amount: number
  bookingId: string
  currency: CurrencyCode
  id: string
  notes: string
  reason: string
  reference: string
  status: 'pending_review' | 'processing' | 'issued'
}

export type DocumentStatus = 'verified' | 'processing' | 'expiring' | 'missing'

export type TravelDocument = {
  expiresLabel: string
  fileName: string
  id: string
  status: DocumentStatus
  travelerName: string
  type: string
}

export type NotificationItem = {
  actionLabel?: string
  actionType?:
    | 'documents'
    | 'refunds'
    | 'booking-detail'
    | 'profile'
    | 'support'
    | 'bookings'
  body: string
  createdLabel: string
  id: string
  kind: 'action' | 'info' | 'security'
  read: boolean
  title: string
}

export type TravelerProfile = {
  fullName: string
  id: string
  initials: string
  passportSuffix: string
  role: string
}

export type UserProfile = {
  avatarUrl: string
  city: string
  country: string
  email: string
  fullName: string
  phone: string
  region: string
}

export type PaymentMethod = 'card' | 'paypal' | 'bank'

export type PaymentDraft = {
  cardNumber: string
  cardholder: string
  cvv: string
  expiry: string
  method: PaymentMethod
}

export type TravelBookMockState = {
  bookings: Booking[]
  catalogFilters: {
    activeFilter: 'duration' | 'groupSize' | 'priceRange' | null
    datesLabel: string
    query: string
    travelersLabel: string
  }
  currentBookingId: string | null
  currentRefundId: string | null
  documents: TravelDocument[]
  documentsFilter: {
    query: string
    type: string
  }
  notifications: NotificationItem[]
  notificationsFilter: {
    query: string
    tab: 'all' | 'unread' | 'action'
  }
  paymentDraft: PaymentDraft
  profile: UserProfile
  refunds: RefundRequest[]
  selectedScheduleId: string
  selectedTourId: string
  travelers: TravelerProfile[]
  travelersCount: number
}

export const mockTours: Tour[] = [
  {
    activityLevel: 'Moderate',
    availabilityLabel: 'Seasonal',
    confirmationLabel: 'Instant Confirmation',
    country: 'Italy',
    currency: 'USD',
    durationDays: 7,
    durationLabel: '7 Days',
    groupSizeLabel: 'Max 12 People',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYr6UoUXza-Rxyx5gz2FLRC6AGpbtwDLzsvIoUfoMgJydSQjyYo5CKHlUeq0AsXMK59_6pWj_RSVJXG3ecpSThDTy3R705lliyFIr9AQsx-peQ4TYWoEJLP185pw67VX3TdHN_X5eD1fj8XWWQMogzGH_CloEjV1cGmWmej-gY_zfWeIPQlf6CblQmwuY_sqdJFUCiwaQ4A7qpcgaitFHNSLS4Z8sF8NnwZJHKKL7MvRwiqtRgPVucxtjnz0Sf5yxBXdhQ5LAW4nG7',
    highlights: [
      {
        description:
          'Access limestone sea caves and anchor points chosen for easy shore transfers.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAIGEBAMkwSFNVJM8exTWciRHLCHux9DxCRXCsXOs2rMM0qQ-DiMLopXzrhPpwzoO16ZhZKP9g3_OtT0xfmlGCLbZx9XwGk4JIymC5Yp4ilEuj2KsSz7tCAZYp1XoU84WNukOCTKENwkBu-FokbRdHE9VyUKJj7LIqN_bwjkNCnGjpTSq2-FfBDj2ufokj-CWVBTy8jq08y6EbI6yBhFgjFE8DDExSDwJ3pP0k9u64UzoWar8o7wsiMZtck-EnAzOOIS40HL4S-5XH_',
        title: 'Accessible Sea Caves',
      },
      {
        description:
          'Hilltop viewpoints and coastal paths combine scenic sailing with land exploration.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8LeHi_jO-2D_hC0lpQepSFF0lyYMiSjvjiuAGFpEXYx3vYNNKtPmJec-adYonRLn15nR1Ug3wFJl9lvc1cTb42cHHp2u0sX21Zrd8rd9ijQR0LjBK7rUNQ7E8CNvXteq3jpbGCJyvxQy0rh5Et88qsLnFYBL0MXmbepGnpDuMNXrHTFrD8e_6rWTr-TFklYmQFTqUY_Z2d-0bxAe_yEVx7g_VmY_mHsHrgqonKGcAtUYEfZ_Znk4EUtiFeIWD5VFKJlhn0P8y887',
        title: 'Hillside Path Network',
      },
    ],
    id: 'tour_amalfi',
    itinerary: [
      {
        description:
          'Check in at Sorrento marina, meet the crew, and settle in before a relaxed harbor dinner.',
        title: 'Arrival in Sorrento',
      },
      {
        description:
          'Sail toward Capri with planned swim stops and a structured afternoon ashore.',
        title: 'Capri Transit',
      },
      {
        description:
          'Dock near Positano for independent exploration, beach access, and local dining.',
        title: 'Positano Stop',
      },
      {
        description:
          'Spend the day around Amalfi and Ravello with optional garden and viewpoint visits.',
        title: 'Amalfi and Ravello',
      },
    ],
    location: 'Amalfi, Italy',
    overview: [
      'A seven-day sailing route designed for travelers who want structure, verified operators, and reliable coastal logistics.',
      'The itinerary mixes sea time with short land excursions, with breakfast and light lunches handled on board by the crew.',
    ],
    priceFrom: 1299,
    slug: 'amalfi-coast-sailing',
    teaser:
      'Experience the Tyrrhenian coast with verified routes, transparent pricing, and flexible booking.',
    title: 'Amalfi Coast Sailing',
  },
  {
    activityLevel: 'Light',
    availabilityLabel: 'Year Round',
    confirmationLabel: 'Instant Confirmation',
    country: 'Japan',
    currency: 'USD',
    durationDays: 5,
    durationLabel: '5 Days',
    groupSizeLabel: 'Max 14 People',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdJD4h6Im2zKxOobn5rx1zyrcjL1PY9yyK49sW_JWgJOGhCvx9Y2BRVuwp1u_sLHsPBuVu9XNkUuguU4ycom40O7GZImEJo_e-ggY3R-akbO5MUCtGSKK_BTGt1QEZDhaLtWLH04wiaT2IhfpKJBmC2-lYY8QjLePUExeCqDiy_KGHQsJPmqZxbgDwgqXdfpaCjYgXlZnBtF5ShW0-9-McKkv1_kpSWqZVUGGWjlrDapBTtOC-5gCAzMKCzaSsCHMxBqgvHY4NgJL1',
    highlights: [
      {
        description:
          'Structured temple visits timed to avoid peak congestion and allow guided interpretation.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBdJD4h6Im2zKxOobn5rx1zyrcjL1PY9yyK49sW_JWgJOGhCvx9Y2BRVuwp1u_sLHsPBuVu9XNkUuguU4ycom40O7GZImEJo_e-ggY3R-akbO5MUCtGSKK_BTGt1QEZDhaLtWLH04wiaT2IhfpKJBmC2-lYY8QjLePUExeCqDiy_KGHQsJPmqZxbgDwgqXdfpaCjYgXlZnBtF5ShW0-9-McKkv1_kpSWqZVUGGWjlrDapBTtOC-5gCAzMKCzaSsCHMxBqgvHY4NgJL1',
        title: 'Temple Circuit',
      },
      {
        description:
          'Evening city walks through quieter districts with practical dining and transit guidance.',
        image:
          'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80',
        title: 'Historic Streets',
      },
    ],
    id: 'tour_kyoto',
    itinerary: [
      {
        description:
          'Meet in Kyoto and begin with a relaxed orientation through Gion and nearby cultural sites.',
        title: 'Arrival and Orientation',
      },
      {
        description:
          'Follow a curated temple route with timed entry and a local guide for context.',
        title: 'Temple Trail',
      },
      {
        description:
          'Free afternoon for gardens, tea houses, and personal exploration.',
        title: 'Flexible Discovery',
      },
      {
        description:
          'Conclude with a final architectural walk and departure support.',
        title: 'Departure Day',
      },
    ],
    location: 'Kyoto, Japan',
    overview: [
      'A compact cultural itinerary focused on architecture, temple districts, and easy-moving city logistics.',
      'Ideal for travelers who want a guided structure with enough open time to shape their own rhythm.',
    ],
    priceFrom: 1850,
    slug: 'kyoto-temple-trail',
    teaser:
      'A structured architectural journey through historical districts with local expertise.',
    title: 'Kyoto Temple Trail',
  },
  {
    activityLevel: 'Moderate',
    availabilityLabel: 'Spring to Autumn',
    confirmationLabel: 'Instant Confirmation',
    country: 'Italy',
    currency: 'USD',
    durationDays: 4,
    durationLabel: '4 Days',
    groupSizeLabel: 'Max 10 People',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9YRlTU-fr-mrFCODMLUWJbqd-rbXduL_lPQc_WGguC526SxOAn6XL5BiHrzOqjs2UhcegplxdaWIo4WA90ZYlMoDd82ToK1LWRF9gfoMq8kpKSKj16KimClz8yXO3WV7EwUdl40DDCFQC4EkpwE95cZQgAFGItFQJqYCW9RELScaBuWhmXGE89tTWsIN6ba-pSr70tIZxMTQqSWx3HG1Ihc54stGBgttskGG6PO8ZqGklluBH_b_i1mPCAkLEjXZdC8eFzHkusgDL',
    highlights: [
      {
        description:
          'Connect the five villages with a balance of train links and moderate scenic walks.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA9YRlTU-fr-mrFCODMLUWJbqd-rbXduL_lPQc_WGguC526SxOAn6XL5BiHrzOqjs2UhcegplxdaWIo4WA90ZYlMoDd82ToK1LWRF9gfoMq8kpKSKj16KimClz8yXO3WV7EwUdl40DDCFQC4EkpwE95cZQgAFGItFQJqYCW9RELScaBuWhmXGE89tTWsIN6ba-pSr70tIZxMTQqSWx3HG1Ihc54stGBgttskGG6PO8ZqGklluBH_b_i1mPCAkLEjXZdC8eFzHkusgDL',
        title: 'Village Hopping',
      },
      {
        description:
          'Harbor-side evenings and short coastal walks keep the itinerary practical and photogenic.',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        title: 'Coastal Evenings',
      },
    ],
    id: 'tour_cinque',
    itinerary: [
      {
        description:
          'Arrive in Monterosso and settle into the village before sunset.',
        title: 'Monterosso Arrival',
      },
      {
        description:
          'Travel between villages with a mix of local rail and short hikes.',
        title: 'Village Connection Day',
      },
      {
        description:
          'Set aside time for harbor photography, swimming, and flexible lunch stops.',
        title: 'Harbor and Coast',
      },
      {
        description:
          'Return journey with optional final morning walk.',
        title: 'Departure',
      },
    ],
    location: 'Cinque Terre, Italy',
    overview: [
      'A short-format Italian coast itinerary built for scenic movement, simple logistics, and good value.',
      'Best for travelers who want a strong visual experience without a heavy travel schedule.',
    ],
    priceFrom: 940,
    slug: 'cinque-terre-escape',
    teaser:
      'Standard hiking routes through coastal villages with clear itinerary value.',
    title: 'Cinque Terre Escape',
  },
  {
    activityLevel: 'Moderate',
    availabilityLabel: 'Winter Favorite',
    confirmationLabel: 'Instant Confirmation',
    country: 'Russia',
    currency: 'USD',
    durationDays: 12,
    durationLabel: '12 Days',
    groupSizeLabel: 'Max 18 People',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByCCGNFooMVDypyWmbFtZ96sQpU-s1iVrvtH8hyHN4lyAjJ6mRITrDtrZzTVg4CKrvcR84ULL8xJWXULTPE5_F0idtPcGhS4kSnPOYJ6m2jlYR9MGJ6oPPclHCgGsoG0yTxZNVeFDnNCNE0p3r93ImC69iZnRoDQ1gaknwxx39BecQpKDHhDtqNS91e7dyBbWJabQRRJjBt_rwheCy4m5mSGcNiZHZWPCcPidOxsV3R8J-svpwQZcgb-TYQuRDiZ8txNKbc1VzrqZH',
    highlights: [
      {
        description:
          'A longer format trip covering signature city landmarks with verified local operations.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuByCCGNFooMVDypyWmbFtZ96sQpU-s1iVrvtH8hyHN4lyAjJ6mRITrDtrZzTVg4CKrvcR84ULL8xJWXULTPE5_F0idtPcGhS4kSnPOYJ6m2jlYR9MGJ6oPPclHCgGsoG0yTxZNVeFDnNCNE0p3r93ImC69iZnRoDQ1gaknwxx39BecQpKDHhDtqNS91e7dyBbWJabQRRJjBt_rwheCy4m5mSGcNiZHZWPCcPidOxsV3R8J-svpwQZcgb-TYQuRDiZ8txNKbc1VzrqZH',
        title: 'Northern Capitals',
      },
      {
        description:
          'Museum and cultural venue slots are pre-reserved to reduce queuing and complexity.',
        image:
          'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80',
        title: 'Timed Cultural Access',
      },
    ],
    id: 'tour_baltic',
    itinerary: [
      {
        description:
          'Arrive in Moscow with airport support and a relaxed hotel check-in.',
        title: 'Moscow Arrival',
      },
      {
        description:
          'Move through major landmarks with structured museum access and walking windows.',
        title: 'Capital Highlights',
      },
      {
        description:
          'Continue north with coordinated rail logistics and city-based accommodation.',
        title: 'Transit and Discovery',
      },
      {
        description:
          'Return leg with optional extension activities.',
        title: 'Wrap-up and Departure',
      },
    ],
    location: 'Moscow and Baltic Route',
    overview: [
      'A longer-format cultural itinerary for travelers who prioritize organized movement and expert-guided context.',
      'Built around reliable transfers, timed attraction access, and a practical day-to-day structure.',
    ],
    priceFrom: 3400,
    slug: 'baltic-grandeur',
    teaser:
      'Verified tour of northern capitals featuring professional guidance.',
    title: 'Baltic Grandeur',
  },
  {
    activityLevel: 'Light',
    availabilityLabel: 'Year Round',
    confirmationLabel: 'Instant Confirmation',
    country: 'Indonesia',
    currency: 'USD',
    durationDays: 10,
    durationLabel: '10 Days',
    groupSizeLabel: 'Max 16 People',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4MNyX3YTTYMju_j8GsHYI_rxvRe6dweJFUv-jE3mWicoWPz0TASr28C4ialWZMZxKLjMuj4FdspL7sXEsaojwac7gSjbJkwLyObStt0Jd6wlFJ0iQGlaKrvjfb3xgGl4-dBpnwnTCRMjacXq_SL2h6izdpLmMkPb_5wrvZeTbpaHrSYMfrvNRXNSoM2D2TFwDwyOVgazw7fa693IluqrRFmkNWPXsWiXcVRO4XrZyX_8ODcUvnni7k3O21SAWys2xwnE4mjcxZul9',
    highlights: [
      {
        description:
          'A gentle mix of cultural visits, wellness stops, and rice terrace viewpoints.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA4MNyX3YTTYMju_j8GsHYI_rxvRe6dweJFUv-jE3mWicoWPz0TASr28C4ialWZMZxKLjMuj4FdspL7sXEsaojwac7gSjbJkwLyObStt0Jd6wlFJ0iQGlaKrvjfb3xgGl4-dBpnwnTCRMjacXq_SL2h6izdpLmMkPb_5wrvZeTbpaHrSYMfrvNRXNSoM2D2TFwDwyOVgazw7fa693IluqrRFmkNWPXsWiXcVRO4XrZyX_8ODcUvnni7k3O21SAWys2xwnE4mjcxZul9',
        title: 'Terrace and Temple Loop',
      },
      {
        description:
          'The pace is intentionally lighter for travelers balancing sightseeing and downtime.',
        image:
          'https://images.unsplash.com/photo-1518544866330-4e7d9f26f4ff?auto=format&fit=crop&w=1200&q=80',
        title: 'Wellness Balance',
      },
    ],
    id: 'tour_bali',
    itinerary: [
      {
        description:
          'Airport meet-and-greet and transfer to Ubud for a low-stress arrival.',
        title: 'Arrival in Ubud',
      },
      {
        description:
          'Explore temples and terraces with flexible rest windows.',
        title: 'Cultural Core',
      },
      {
        description:
          'Wellness-focused day with optional spa and village visits.',
        title: 'Wellness and Local Life',
      },
      {
        description:
          'Beach extension and return support.',
        title: 'Coastal Finish',
      },
    ],
    location: 'Bali, Indonesia',
    overview: [
      'A slower-paced itinerary that blends scenery, wellness, and guided cultural visits.',
      'Recommended for travelers looking for comfort, clarity, and balanced scheduling.',
    ],
    priceFrom: 1550,
    slug: 'bali-zen-expedition',
    teaser:
      'Reliable cultural immersion through rice paddies and wellness centers.',
    title: 'Bali Zen Expedition',
  },
  {
    activityLevel: 'Moderate',
    availabilityLabel: 'Summer to Autumn',
    confirmationLabel: 'Instant Confirmation',
    country: 'Iceland',
    currency: 'USD',
    durationDays: 8,
    durationLabel: '8 Days',
    groupSizeLabel: 'Max 14 People',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBsqQZAyEAySTyfrTxwslhrQPCq9YV3XCTuKaXasekBoGKSoR8Jj_FID9LWehqE2F8IWBbFvYiWF3jGJzCF1GZNVbkW8Ep-eIaXXkUNrYbAY4V2VtD9Peqke8qG1042IpwkIyLrwq-ZnqBtKxTKniHccy2KzVOdtEPcc3bip4CY71uxPYzSax3IFfVZFuG26CCaqYm7np4KnBGTvo7NDRX9xZqK45DUks7dUdekFhaoJ1e8bfqrZGGlKuq0kvNn7wdhM-kZ9KNDkLsc',
    highlights: [
      {
        description:
          'Waterfall and geothermal stops are laid out for predictable drive times and weather pivots.',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBsqQZAyEAySTyfrTxwslhrQPCq9YV3XCTuKaXasekBoGKSoR8Jj_FID9LWehqE2F8IWBbFvYiWF3jGJzCF1GZNVbkW8Ep-eIaXXkUNrYbAY4V2VtD9Peqke8qG1042IpwkIyLrwq-ZnqBtKxTKniHccy2KzVOdtEPcc3bip4CY71uxPYzSax3IFfVZFuG26CCaqYm7np4KnBGTvo7NDRX9xZqK45DUks7dUdekFhaoJ1e8bfqrZGGlKuq0kvNn7wdhM-kZ9KNDkLsc',
        title: 'Waterfalls and Black Sand',
      },
      {
        description:
          'Small-group format keeps transfers simple and stops flexible.',
        image:
          'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
        title: 'Small-Group Road Flow',
      },
    ],
    id: 'tour_iceland',
    itinerary: [
      {
        description:
          'Start in Reykjavik with orientation and a practical gear check.',
        title: 'Arrival in Reykjavik',
      },
      {
        description:
          'Circle key south coast landmarks with flexible weather-based timing.',
        title: 'South Coast Loop',
      },
      {
        description:
          'Add geothermal and glacier-view days with low-friction transport.',
        title: 'Nature Circuit',
      },
      {
        description:
          'Return to Reykjavik and depart.',
        title: 'Departure',
      },
    ],
    location: 'South Iceland',
    overview: [
      'A route-based itinerary combining iconic landscapes with verified safety practices and practical pacing.',
      'Built for travelers who want dramatic scenery without improvising the logistics themselves.',
    ],
    priceFrom: 2100,
    slug: 'icelandic-elements',
    teaser:
      'Island road exploration with verified safety standards and thermal visits.',
    title: 'Icelandic Elements',
  },
]

export const mockSchedules: TourSchedule[] = [
  {
    availability: 'instant',
    currency: 'USD',
    id: 'schedule_baltic_winter',
    label: 'Nov 12 - Nov 18, 2024',
    seatsLeft: 6,
    title: 'Winter Capitals Circuit',
    tourId: 'tour_baltic',
    unitPrice: 1420,
  },
  {
    availability: 'instant',
    currency: 'EUR',
    id: 'schedule_amalfi_oct',
    label: 'Oct 12 - Oct 18, 2024',
    seatsLeft: 5,
    title: 'Standard Cabin Expedition',
    tourId: 'tour_amalfi',
    unitPrice: 2499,
  },
  {
    availability: 'limited',
    currency: 'EUR',
    id: 'schedule_amalfi_oct_late',
    label: 'Oct 26 - Nov 01, 2024',
    seatsLeft: 2,
    title: 'Autumn Coastline Special',
    tourId: 'tour_amalfi',
    unitPrice: 2150,
  },
  {
    availability: 'instant',
    currency: 'EUR',
    id: 'schedule_amalfi_nov',
    label: 'Nov 09 - Nov 15, 2024',
    seatsLeft: 8,
    title: 'End of Season Voyage',
    tourId: 'tour_amalfi',
    unitPrice: 1990,
  },
  {
    availability: 'instant',
    currency: 'USD',
    id: 'schedule_kyoto_may',
    label: 'May 06 - May 10, 2024',
    seatsLeft: 6,
    title: 'Temple District Week',
    tourId: 'tour_kyoto',
    unitPrice: 1850,
  },
  {
    availability: 'limited',
    currency: 'USD',
    id: 'schedule_kyoto_jun',
    label: 'Jun 17 - Jun 21, 2024',
    seatsLeft: 3,
    title: 'Early Summer Lantern Run',
    tourId: 'tour_kyoto',
    unitPrice: 1990,
  },
  {
    availability: 'instant',
    currency: 'USD',
    id: 'schedule_bali_aug',
    label: 'Aug 04 - Aug 13, 2024',
    seatsLeft: 9,
    title: 'Ubud Wellness Circuit',
    tourId: 'tour_bali',
    unitPrice: 1550,
  },
  {
    availability: 'instant',
    currency: 'USD',
    id: 'schedule_iceland_sep',
    label: 'Sep 09 - Sep 16, 2024',
    seatsLeft: 4,
    title: 'South Coast Explorer',
    tourId: 'tour_iceland',
    unitPrice: 2100,
  },
]

export const defaultMockState: TravelBookMockState = {
  bookings: [
    {
      amountPaid: 2840,
      currency: 'USD',
      datesLabel: 'Nov 12 - Nov 18, 2024',
      documentState: 'action_required',
      id: 'TBK-92834',
      paymentLabel: 'Payment Confirmed',
      reference: '#TB-92834',
      scheduleId: 'schedule_baltic_winter',
      status: 'confirmed',
      title: 'Moscow Cultural Tour',
      tourId: 'tour_baltic',
      travelersCount: 2,
    },
    {
      amountPaid: 1120,
      currency: 'USD',
      datesLabel: 'Dec 04 - Dec 10, 2024',
      documentState: 'ready',
      id: 'TBK-11042',
      paymentLabel: 'Pending Transfer',
      reference: '#TB-11042',
      scheduleId: 'schedule_kyoto_may',
      status: 'pending_payment',
      title: 'Golden Triangle Express',
      tourId: 'tour_kyoto',
      travelersCount: 2,
    },
    {
      amountPaid: 1240,
      currency: 'USD',
      datesLabel: 'Oct 15 - Oct 21, 2023',
      documentState: 'ready',
      id: 'TBK-1044',
      paymentLabel: 'Refund in Progress',
      reference: '#TB-1044',
      scheduleId: 'schedule_amalfi_oct',
      status: 'refund_in_progress',
      title: 'Amalfi Coast Sailing',
      tourId: 'tour_amalfi',
      travelersCount: 2,
    },
  ],
  catalogFilters: {
    activeFilter: null,
    datesLabel: '',
    query: '',
    travelersLabel: '2 Adults',
  },
  currentBookingId: 'TBK-92834',
  currentRefundId: 'RFD-8291',
  documents: [
    {
      expiresLabel: 'Valid until May 2029',
      fileName: 'passport-julian-smith.pdf',
      id: 'doc_passport_julian',
      status: 'verified',
      travelerName: 'Julian Smith',
      type: 'Passport',
    },
    {
      expiresLabel: 'Review expected in 24h',
      fileName: 'visa-italy-julian.pdf',
      id: 'doc_visa_julian',
      status: 'processing',
      travelerName: 'Julian Smith',
      type: 'Visa - Italy',
    },
    {
      expiresLabel: 'Expires in 21 days',
      fileName: 'driver-license-julian.pdf',
      id: 'doc_license_julian',
      status: 'expiring',
      travelerName: 'Julian Smith',
      type: "Driver's License",
    },
    {
      expiresLabel: 'Required before departure',
      fileName: '',
      id: 'doc_national_id_sarah',
      status: 'missing',
      travelerName: 'Sarah Smith',
      type: 'National ID',
    },
  ],
  documentsFilter: {
    query: '',
    type: '',
  },
  notifications: [
    {
      actionLabel: 'Update Document',
      actionType: 'documents',
      body: 'Please re-upload your passport scan for verification for your Amalfi Coast Sailing booking.',
      createdLabel: '1 hour ago',
      id: 'notif_doc_update',
      kind: 'action',
      read: false,
      title: 'Document Update Needed',
    },
    {
      actionLabel: 'View Statement',
      actionType: 'refunds',
      body: 'Your refund of $450.00 for Kyoto Zen Garden Tour has been successfully completed.',
      createdLabel: '3 hours ago',
      id: 'notif_refund_done',
      kind: 'info',
      read: true,
      title: 'Refund Processed',
    },
    {
      actionLabel: 'View Details',
      actionType: 'booking-detail',
      body: 'Your travel arrangements for Patagonia Expedition are now fully verified and confirmed.',
      createdLabel: 'Yesterday',
      id: 'notif_booking_confirmed',
      kind: 'info',
      read: true,
      title: 'Booking Confirmed',
    },
    {
      actionLabel: 'Review Activity',
      actionType: 'profile',
      body: 'A new login was detected from a Chrome browser on Windows. If this was not you, please secure your account.',
      createdLabel: '2 days ago',
      id: 'notif_security',
      kind: 'security',
      read: false,
      title: 'Security Update',
    },
  ],
  notificationsFilter: {
    query: '',
    tab: 'all',
  },
  paymentDraft: {
    cardNumber: '4242 4242 4242 4242',
    cardholder: 'Alexander Wright',
    cvv: '424',
    expiry: '12 / 28',
    method: 'card',
  },
  profile: {
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjE-buDl1aD6vyWkFbzXwUdPJs7fzZN7c3tmi_z4xwA0zLJaaw0mPembr3kYM6sd9o9EEN5_gobOUcRUk87iNFeaMR1lExkZteNpGdV3V34O7ImohoaUDMzz5LlufvD_ezqwmfGUdWk2Pr3Mbe4uP-nrgK8okAozB1EILbhY6s6f2s5RsqNXmNl2HngnJtWiWolaIq1XkJ_G5hSuayDgD2L64A5OE338yCoJBGmkBT8rtRyTp1CdTHpXXpnrZDKix5TPkVW8zpb4qB',
    city: 'Zurich',
    country: 'Switzerland',
    email: 'alexander.wright@email.com',
    fullName: 'Alexander Wright',
    phone: '+44 7700 900123',
    region: 'United Kingdom',
  },
  refunds: [
    {
      amount: 1240,
      bookingId: 'TBK-1044',
      currency: 'USD',
      id: 'RFD-8291',
      notes: 'Customer requested a refund instead of rescheduling.',
      reason: 'Cancellation by operator due to adverse weather conditions in the Positano port area.',
      reference: 'RF-8291',
      status: 'processing',
    },
  ],
  selectedScheduleId: 'schedule_amalfi_oct',
  selectedTourId: 'tour_amalfi',
  travelers: [
    {
      fullName: 'Alexander Wright',
      id: 'traveler_alex',
      initials: 'AW',
      passportSuffix: '4922',
      role: 'Lead Traveler',
    },
    {
      fullName: 'Sarah Wright',
      id: 'traveler_sarah',
      initials: 'SW',
      passportSuffix: '1182',
      role: 'Companion',
    },
  ],
  travelersCount: 2,
}
