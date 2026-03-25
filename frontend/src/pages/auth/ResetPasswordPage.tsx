import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react'

export function ResetPasswordPage() {
  const { token } = useParams()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Reset flow</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Reset links are not active yet</h1>
        <p className="mt-2 text-sm text-gray-600">
          The frontend can read a reset token, but the backend currently does not expose a password reset confirmation endpoint.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <KeyRound className="mt-1 h-5 w-5 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Received token</h2>
            <p className="mt-1 break-all text-sm text-gray-600">{token ?? 'No token found in the current URL.'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            To avoid accepting a token without server-side verification, this page intentionally stops here until the corresponding backend API is implemented.
          </p>
        </div>
      </div>

      <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" />
        Return to recovery options
      </Link>
    </div>
  )
}
