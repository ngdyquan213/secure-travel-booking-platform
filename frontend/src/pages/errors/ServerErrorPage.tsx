import { Link } from 'react-router-dom'
import { ServerCrash } from 'lucide-react'

export function ServerErrorPage() {
  return (
    <div className="container-custom py-20 text-center">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-amber-200 bg-white p-10 shadow-sm">
        <ServerCrash className="mx-auto h-12 w-12 text-amber-600" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">500</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Something went wrong on the server side</h1>
        <p className="mt-3 text-gray-600">Retry the action in a moment or continue from a safer entry point like the dashboard or home page.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/account/dashboard" className="rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700">
            Go to dashboard
          </Link>
          <Link to="/" className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900 hover:border-gray-400">
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
