import { Link } from 'react-router-dom'
import { serviceCards } from '../../data/publicContent'
import { SectionHero } from '../../components/SectionHero'

export function ServicesPage() {
  return (
    <>
      <SectionHero
        title="Everything you need to plan, book, and manage travel"
        subtitle="From flights and stays to insurance and support, the public experience mirrors the frontend-test flow."
      />

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map((service) => {
              const Icon = service.icon

              return (
                <article key={service.title} className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-900">{service.title}</h2>
                  <p className="mt-3 text-gray-600">{service.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Why Choose Us</p>
            <h3 className="mt-4 text-3xl font-bold text-gray-900">Travel decisions stay readable.</h3>
            <p className="mt-4 text-gray-600">
              TravelBook groups the core decisions in one place so travelers spend less time juggling tabs and policy
              fragments.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Pricing</p>
            <h3 className="mt-4 text-3xl font-bold text-gray-900">Transparent before checkout.</h3>
            <p className="mt-4 text-gray-600">
              The service flow prioritizes fare conditions, inclusions, and tradeoffs before you commit.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Scale</p>
            <h3 className="mt-4 text-3xl font-bold text-gray-900">Built for global choice.</h3>
            <p className="mt-4 text-gray-600">
              Millions of travelers, large accommodation coverage, and strong support paths create a more reliable base.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16 text-white">
        <div className="container-custom flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Start Planning</p>
            <h2 className="mt-3 text-4xl font-bold">Ready to move from inspiration to booking?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900">
              Back to home
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              Talk to support
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
