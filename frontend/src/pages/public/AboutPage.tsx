import { Link } from 'react-router-dom'
import { companyStats, companyValues, teamMembers } from '../../data/publicContent'
import { SectionHero } from '../../components/SectionHero'

export function AboutPage() {
  return (
    <>
      <SectionHero
        title="Travel planning built around clarity, trust, and momentum"
        subtitle="TravelBook was designed to make complex trips feel easier to search, compare, and manage."
      />

      <section className="bg-white py-16">
        <div className="container-custom grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Our Story</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">From booking chaos to calmer trips</h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-gray-600">
              <p>
                TravelBook started from a straightforward problem: travel platforms often help you buy, but not really
                decide. We wanted a product that reduced friction before, during, and after booking.
              </p>
              <p>
                The result is a platform focused on trustworthy comparisons, smoother support, and public pages that
                give travelers enough context to move forward with confidence.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {companyStats.map((item) => (
              <div key={item.label} className="rounded-[2rem] bg-gray-50 p-8 ring-1 ring-gray-200">
                <p className="text-4xl font-bold text-gray-900">{item.value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Values</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900">What guides the platform</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {companyValues.map((value) => {
              const Icon = value.icon

              return (
                <article key={value.title} className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-200">
                  <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900">{value.title}</h3>
                  <p className="mt-3 text-gray-600">{value.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Team</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900">The people shaping TravelBook</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <article key={member.name} className="rounded-[2rem] bg-gray-50 p-8 ring-1 ring-gray-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-lg font-bold text-white">
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{member.role}</p>
                <p className="mt-4 text-gray-600">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16 text-white">
        <div className="container-custom flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Community</p>
            <h2 className="mt-3 text-4xl font-bold">Join the next trip with better context from the start.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/services" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900">
              Explore services
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
