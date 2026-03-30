export const routePaths = {
  public: {
    home: '/',
    tours: '/tours',
    destinations: '/destinations',
    promotions: '/promotions',
    help: '/help',
    tourDetail: '/tours/:id',
    tourSchedules: '/tours/:id/schedules',
  },
  sections: {
    featuredTours: 'featured-tours',
    destinations: 'destinations',
    promotions: 'promotions',
    howItWorks: 'how-it-works',
    bookingConfidence: 'booking-confidence',
    testimonials: 'testimonials',
    finalCta: 'final-cta',
  },
} as const

export function buildSectionHref(sectionId: string) {
  return `/#${sectionId}`
}

export function buildTourDetailPath(id: string) {
  return routePaths.public.tourDetail.replace(':id', encodeURIComponent(id))
}

export function buildTourSchedulesPath(id: string) {
  return routePaths.public.tourSchedules.replace(':id', encodeURIComponent(id))
}
