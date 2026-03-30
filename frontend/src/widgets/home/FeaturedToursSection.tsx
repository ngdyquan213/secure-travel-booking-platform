import { ArrowRight } from 'lucide-react'
import { buildTourDetailPath, routePaths } from '@/app/router/routePaths'
import { TourCard, useToursQuery } from '@/features/tours'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Skeleton } from '@/shared/ui/Skeleton'

export function FeaturedToursSection() {
  const { data, isLoading, isError, error } = useToursQuery()

  return (
    <section id={routePaths.sections.featuredTours} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionHeader
        title="Featured Experiences"
        subtitle="Our most sought-after journeys this season."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--color-secondary-strong)] transition-all hover:gap-3"
          >
            View all tours
            <ArrowRight className="h-4 w-4" />
          </button>
        }
      />

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[28px] border border-[color:var(--color-outline-variant)] bg-white">
              <Skeleton className="h-64 w-full rounded-none" />
              <div className="space-y-4 p-8">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          {error.message || 'Unable to load featured tours right now.'}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[color:var(--color-outline-variant)] bg-white p-12 text-center text-[color:var(--color-on-surface-variant)]">
          Featured tours will appear here as soon as curated departures are available.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {data.map((tour) => (
            <TourCard key={tour.id} tour={tour} href={buildTourDetailPath(tour.id)} />
          ))}
        </div>
      )}
    </section>
  )
}
