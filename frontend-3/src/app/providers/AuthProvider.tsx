import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const { get, set, remove } = useLocalStorage()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = get('authToken')
      const savedUser = get('user')
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser))
      }
      
      setIsInitializing(false)
    }

    initializeAuth()
  }, [])

  const login = (user: User, token: string) => {
    set('authToken', token)
    set('user', JSON.stringify(user))
    setUser(user)
  }

  const logout = () => {
    remove('authToken')
    remove('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        logout,
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
