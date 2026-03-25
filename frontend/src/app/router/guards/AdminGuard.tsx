import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../providers/AuthProvider'
import type { ReactNode } from 'react'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isInitializing } = useAuthContext()
  const roles = user?.roles ?? (user?.role ? [user.role] : [])
  const isAdmin = roles.some((role) => role === 'admin' || role === 'super_admin')

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
