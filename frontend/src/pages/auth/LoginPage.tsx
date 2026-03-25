import { FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, LockKeyhole, Mail } from 'lucide-react'
import { useAuthStore } from '@/features/auth/model/auth.store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')

    if (!email || !password) {
      setLocalError('Please enter both your email and password.')
      return
    }

    try {
      await login(email, password)
      const redirectTo =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
        '/account/dashboard'
      navigate(redirectTo, { replace: true })
    } catch {
      // Store-managed error is rendered below.
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Secure access</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to manage bookings, documents, and payment progress.</p>
      </div>

      {(localError || error) && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{localError || error}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail className="h-4 w-4" />
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <LockKeyhole className="h-4 w-4" />
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            placeholder="Enter your password"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="space-y-3 text-center text-sm text-gray-600">
        <p>
          Need a new account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Create one
          </Link>
        </p>
        <p>
          Trouble signing in?{' '}
          <Link to="/forgot-password" className="font-semibold text-primary-600 hover:text-primary-700">
            See recovery options
          </Link>
        </p>
      </div>
    </div>
  )
}
