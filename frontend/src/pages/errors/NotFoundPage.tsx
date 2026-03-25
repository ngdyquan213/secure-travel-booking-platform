import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="container-custom py-20 text-center">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-gray-200 bg-white p-10 shadow-sm">
        <Compass className="mx-auto h-12 w-12 text-primary-600" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">404</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">The page you requested does not exist</h1>
        <p className="mt-3 text-gray-600">Try returning to the home page or jump directly into the tour catalog.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700">
            Go home
          </Link>
          <Link to="/tours" className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900 hover:border-gray-400">
            Browse tours
          </Link>
        </div>
      </div>
    </div>
  )
}
