import { routePaths } from '@/app/router/routePaths'
import { PromotionCard, usePromotionsQuery } from '@/features/promotions'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/shared/ui/Skeleton'

export function PromotionSection() {
  const { data = [], isPending, isError, error } = usePromotionsQuery({
    featuredOnly: true,
    limit: 2,
  })

  return (
    <section id={routePaths.sections.promotions} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Seasonal Access"
        title="Curated booking advantages"
        subtitle="Editorial travel offers with clear status, timing, and direct routes into tours or booking schedules."
        action={
          <Link
            to={routePaths.public.promotions}
            className="inline-flex items-center justify-center rounded-xl border border-[color:var(--color-outline-variant)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-surface-low)]"
          >
            View all promotions
          </Link>
        }
      />

      {isPending ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[28px] border border-[color:var(--color-outline-variant)] bg-white">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-4 p-8">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
                <Skeleton className="min-h-[240px] w-full rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          {error.message || 'Unable to load promotions right now.'}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[color:var(--color-outline-variant)] bg-white p-12 text-center text-[color:var(--color-on-surface-variant)]">
          Seasonal promotions are being prepared and will appear here shortly.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {data.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} variant="feature" />
          ))}
        </div>
      )}
    </section>
  )
}
