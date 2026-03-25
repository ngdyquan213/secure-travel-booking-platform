import { useState } from 'react'
import { AlertTriangle, LaptopMinimal, ShieldCheck } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'

export function ChangePasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleLogoutAll = async () => {
    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      await apiClient.logoutAll()
      setMessage('All active sessions have been invalidated. Sign in again on the devices you trust.')
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'Unable to invalidate sessions.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Account security</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Password and session controls</h1>
        <p className="mt-2 text-gray-600">
          The current backend exposes session revocation, but not a dedicated password-change endpoint yet.
        </p>
      </div>

      {(message || error) && (
        <div className={`rounded-2xl p-4 text-sm ${error ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary-600" />
            <div>
              <h2 className="font-semibold text-gray-900">Current capability</h2>
              <p className="mt-2 text-sm text-gray-600">
                The UI intentionally does not pretend to change a password locally because the corresponding backend endpoint is not available.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <LaptopMinimal className="mt-1 h-5 w-5 text-primary-600" />
            <div>
              <h2 className="font-semibold text-gray-900">Recommended action now</h2>
              <p className="mt-2 text-sm text-gray-600">
                Revoke all sessions if you suspect account exposure, then sign back in only on trusted devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            Once backend password reset or change APIs are introduced, this page can be upgraded from security guidance to a full credential update flow.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleLogoutAll()}
        disabled={isSubmitting}
        className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Revoking sessions...' : 'Sign out all devices'}
      </button>
    </div>
  )
}
