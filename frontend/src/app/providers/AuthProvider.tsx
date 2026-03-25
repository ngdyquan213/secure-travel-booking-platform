import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface AuthContextType {
  user: ReturnType<typeof useAuth>['user']
  isAuthenticated: boolean
  isInitializing: boolean
  login: ReturnType<typeof useAuth>['login']
  logout: ReturnType<typeof useAuth>['logout']
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isInitializing: auth.isInitializing,
        login: auth.login,
        logout: auth.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
