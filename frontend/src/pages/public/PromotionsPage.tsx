import { BadgePercent, ShieldCheck, Sparkles } from 'lucide-react'

const promotions = [
  {
    title: 'Early departure savings',
    description: 'Book selected departures early to secure lower starting fares before capacity tightens.',
    label: 'Limited inventory',
  },
  {
    title: 'Group traveler advantage',
    description: 'Coordinated bookings for families or small groups can reduce planning friction and price spread.',
    label: 'Best for 3+ travelers',
  },
  {
    title: 'Document-ready fast lane',
    description: 'Accounts with approved documents move through pre-travel checks more smoothly during review.',
    label: 'Operations-friendly',
  },
]

export function PromotionsPage() {
  return (
    <div className="container-custom py-12 space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-orange-100 via-amber-50 to-white px-8 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Promotions</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Current booking advantages</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          This page highlights practical advantages inside the current booking flow while coupon-specific frontend features are still being wired.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <article key={promotion.title} className="rounded-3xl border border-gray-200 bg-white p-6">
            <BadgePercent className="h-8 w-8 text-orange-600" />
            <p className="mt-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{promotion.label}</p>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{promotion.title}</h2>
            <p className="mt-3 text-sm text-gray-600">{promotion.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <ShieldCheck className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Why this page is different</h2>
          <p className="mt-3 text-sm text-gray-600">
            Instead of showing fake coupon data, it reflects the capabilities currently present in the repository and keeps expectations aligned with backend reality.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Next iteration</h2>
          <p className="mt-3 text-sm text-gray-600">
            Once coupon APIs are surfaced in the frontend layer, this route can become a live promotions hub with eligibility checks and redemption status.
          </p>
        </div>
      </div>
    </div>
  )
}
