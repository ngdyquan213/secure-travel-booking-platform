import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export function ForbiddenPage() {
  return (
    <div className="container-custom py-20 text-center">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-red-200 bg-white p-10 shadow-sm">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">403</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">You do not have access to this area</h1>
        <p className="mt-3 text-gray-600">If this is unexpected, verify your account role or return to a page available for your current permissions.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/account/dashboard" className="rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700">
            Open dashboard
          </Link>
          <Link to="/" className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900 hover:border-gray-400">
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
