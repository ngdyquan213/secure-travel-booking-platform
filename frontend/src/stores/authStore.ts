import { useSyncExternalStore } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoading: boolean
  error: string | null
  initializeAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const listeners = new Set<() => void>()

const notify = () => {
  listeners.forEach((listener) => listener())
}

const readStorage = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(key)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

const setState = (partial: Partial<AuthState>) => {
  state = { ...state, ...partial }
  notify()
}

let state: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,
  initializeAuth: async () => {
    const token = typeof window === 'undefined' ? null : window.localStorage.getItem('access_token')
    const user = readStorage<User>('travelbook_user')

    setState({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing: false,
    })
  },
  login: async (email: string) => {
    setState({ isLoading: true, error: null })

    const nextUser: User = {
      id: 'demo-user',
      name: email.split('@')[0] || 'Traveler',
      email,
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('access_token', 'demo-access-token')
      window.localStorage.setItem('travelbook_user', JSON.stringify(nextUser))
    }

    setState({
      user: nextUser,
      token: 'demo-access-token',
      isAuthenticated: true,
      isLoading: false,
    })
  },
  register: async (email: string, _password: string, name: string) => {
    setState({ isLoading: true, error: null })

    const nextUser: User = {
      id: 'demo-user',
      name,
      email,
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('access_token', 'demo-access-token')
      window.localStorage.setItem('travelbook_user', JSON.stringify(nextUser))
    }

    setState({
      user: nextUser,
      token: 'demo-access-token',
      isAuthenticated: true,
      isLoading: false,
    })
  },
  logout: async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('access_token')
      window.localStorage.removeItem('travelbook_user')
    }

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },
  clearError: () => {
    setState({ error: null })
  },
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => state

export const useAuthStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
