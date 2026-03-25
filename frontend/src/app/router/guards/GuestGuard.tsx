import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../providers/AuthProvider'
import type { ReactNode } from 'react'

interface GuestGuardProps {
  children: ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated } = useAuthContext()

  if (isAuthenticated) {
    return <Navigate to="/account/dashboard" replace />
  }

  return <>{children}</>
}
