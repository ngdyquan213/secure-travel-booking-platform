import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHero } from '../../components/SectionHero'

interface PlaceholderPageProps {
  title: string
  subtitle: string
  primaryHref?: string
  primaryLabel?: string
}

export function PlaceholderPage({
  title,
  subtitle,
  primaryHref = '/',
  primaryLabel = 'Back to home',
}: PlaceholderPageProps) {
  return (
    <>
      <SectionHero title={title} subtitle={subtitle} />
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-10 text-center shadow-sm">
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              This route is connected so the public UX no longer lands on a blank screen. You can replace this
              placeholder with the full business flow next.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to={primaryHref}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
