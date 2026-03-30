import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Plane, ShieldCheck, X } from 'lucide-react'
import { routePaths } from '@/app/router/routePaths'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

const navItems = [
  { label: 'Tours', type: 'route', to: routePaths.public.tours },
  { label: 'Destinations', type: 'route', to: routePaths.public.destinations },
  { label: 'Promotions', type: 'route', to: routePaths.public.promotions },
  { label: 'Help', type: 'route', to: routePaths.public.help },
] as const

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to={routePaths.public.home} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--color-primary)] text-white transition-transform duration-300 group-hover:-rotate-6">
              <Plane className="h-5 w-5" />
            </div>
            <span className="block font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-[color:var(--color-primary)]">
              TravelBook
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-semibold tracking-[0.18em] transition-colors hover:text-[color:var(--color-secondary-strong)]',
                    isActive
                      ? 'text-[color:var(--color-primary)]'
                      : 'text-[color:var(--color-on-surface-variant)]'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            className="text-sm font-semibold text-[color:var(--color-on-surface-variant)] transition-colors hover:text-[color:var(--color-primary)]"
            onClick={() => scrollToSection(routePaths.sections.bookingConfidence)}
          >
            Log In
          </button>
          <Button
            variant="hero"
            size="sm"
            onClick={() => scrollToSection(routePaths.sections.finalCta)}
          >
            Sign Up
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--color-outline-variant)] bg-white text-[color:var(--color-primary)] md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-[color:var(--color-outline-variant)] bg-white px-6 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <div className="mb-2 flex items-center gap-2 rounded-2xl bg-[color:var(--color-secondary-container)] px-4 py-3 text-sm font-medium text-[color:var(--color-secondary-strong)]">
              <ShieldCheck className="h-4 w-4" />
              Premium travel, secure booking, curated experiences.
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-[color:var(--color-surface-low)]',
                    isActive
                      ? 'bg-[color:var(--color-surface-low)] text-[color:var(--color-primary)]'
                      : 'text-[color:var(--color-primary)]'
                  )
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setMenuOpen(false)
                  scrollToSection(routePaths.sections.bookingConfidence)
                }}
              >
                Log In
              </Button>
              <Button
                variant="hero"
                onClick={() => {
                  setMenuOpen(false)
                  scrollToSection(routePaths.sections.finalCta)
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
