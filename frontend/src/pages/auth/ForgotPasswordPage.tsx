import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Mail, ShieldQuestion } from 'lucide-react'

export function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Recovery</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Password reset is not exposed yet</h1>
        <p className="mt-2 text-sm text-gray-600">
          The current backend does not publish a forgot-password endpoint, so this screen provides the safe fallback path.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex gap-3 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            To avoid presenting a broken form, recovery is intentionally disabled in the UI until the backend endpoint is available.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <ShieldQuestion className="mt-1 h-5 w-5 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Recommended next step</h2>
            <p className="mt-1 text-sm text-gray-600">
              Contact support so they can verify your identity and guide you through account recovery safely.
            </p>
          </div>
        </div>

        <a
          href="mailto:support@travelbook.com?subject=Password%20Reset%20Request"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>
      </div>

      <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  )
}
