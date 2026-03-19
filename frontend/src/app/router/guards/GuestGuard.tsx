import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../providers/AuthProvider'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated } = useAuthContext()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
