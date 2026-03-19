import { useAuth } from '../hooks/useAuth'

/**
 * Hook to check if user is authenticated
 */
export function useAuthGuard() {
  const auth = useAuth()
  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isInitializing || auth.isLoading,
    user: auth.user,
  }
}

/**
 * Hook to ensure user is NOT authenticated (for login/register pages)
 */
export function useGuestGuard() {
  const auth = useAuth()
  return {
    isGuest: !auth.isAuthenticated,
    isLoading: auth.isInitializing || auth.isLoading,
  }
}

/**
 * Hook to check if user is admin
 * Note: This is a placeholder - adjust based on actual user role structure
 */
export function useAdminGuard() {
  const auth = useAuth()
  const isAdmin = auth.user?.id === 'admin-user-id' // TODO: Update based on actual role field

  return {
    isAdmin,
    isLoading: auth.isInitializing || auth.isLoading,
    user: auth.user,
  }
}

/**
 * Hook to check user permissions
 */
export function usePermission() {
  const auth = useAuth()

  const hasPermission = (requiredRole: string | string[]): boolean => {
    if (!auth.isAuthenticated) return false

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    // TODO: Implement actual permission checking based on user role
    return true
  }

  return {
    hasPermission,
    isLoading: auth.isInitializing || auth.isLoading,
    user: auth.user,
  }
}
