import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/model/auth.store'

export function useAuth() {
  const auth = useAuthStore()
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    if (isInitializing) {
      void initializeAuth()
    }
  }, [initializeAuth, isInitializing])

  return auth
}
