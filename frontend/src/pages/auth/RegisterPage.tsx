import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Mail, ShieldCheck, User } from 'lucide-react'
import { useAuthStore } from '@/features/auth/model/auth.store'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError('')

    if (!name || !email || !password) {
      setLocalError('Please complete all required fields.')
      return
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Password confirmation does not match.')
      return
    }

    try {
      await register(email, password, name)
      navigate('/account/dashboard', { replace: true })
    } catch {
      // Store-managed error is rendered below.
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Create account</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Start planning securely</h1>
        <p className="mt-2 text-sm text-gray-600">Register once to manage trips, documents, and vouchers in one place.</p>
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
            <User className="h-4 w-4" />
            Full name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            placeholder="Nguyen Van A"
          />
        </label>

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
            <ShieldCheck className="h-4 w-4" />
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            placeholder="At least 8 characters"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Confirm password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            placeholder="Re-enter your password"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign in instead
        </Link>
      </p>
    </div>
  )
}
