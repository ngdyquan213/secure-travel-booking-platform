import { Globe2, Plane, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buildSectionHref, routePaths } from '@/app/router/routePaths'

const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'Featured Tours', href: buildSectionHref(routePaths.sections.featuredTours) },
      { label: 'Destination Gallery', href: routePaths.public.destinations },
      { label: 'Seasonal Promotions', href: buildSectionHref(routePaths.sections.promotions) },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'How It Works', href: buildSectionHref(routePaths.sections.howItWorks) },
      { label: 'Booking Confidence', href: buildSectionHref(routePaths.sections.bookingConfidence) },
      { label: 'Testimonials', href: buildSectionHref(routePaths.sections.testimonials) },
    ],
  },
] as const

export default function MainFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 rounded-t-[2rem] bg-slate-100/90">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to={routePaths.public.home} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[color:var(--color-primary)]">
                TravelBook
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[color:var(--color-on-surface-variant)]">
              Curating the world's most exceptional travel experiences with a secure, polished booking journey.
            </p>
            <div className="mt-8 flex gap-3">
              {[Globe2, Share2].map((Icon) => (
                <div
                  key={Icon.displayName}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[color:var(--color-primary)] shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-primary)]">
                {column.title}
              </h3>
              <ul className="space-y-4 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[color:var(--color-on-surface-variant)] transition-colors hover:text-[color:var(--color-secondary-strong)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-primary)]">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-[color:var(--color-on-surface-variant)]">
              Curated travel stories delivered to your inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-2xl border border-[color:var(--color-outline-variant)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-secondary)] focus:ring-4 focus:ring-cyan-100"
              />
              <button
                type="button"
                className="w-full rounded-xl bg-[color:var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-strong)]"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} TravelBook. Curated luxury experiences.</p>
          <div className="flex gap-6">
            <a
              href={buildSectionHref(routePaths.sections.bookingConfidence)}
              className="hover:text-[color:var(--color-primary)]"
            >
              Privacy Policy
            </a>
            <a
              href={buildSectionHref(routePaths.sections.bookingConfidence)}
              className="hover:text-[color:var(--color-primary)]"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
