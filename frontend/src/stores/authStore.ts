import { create } from 'zustand'
import { apiClient } from '../services/api'
import * as types from '../types/api'

interface AuthState {
  user: types.User | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoading: boolean
  error: string | null

  // Actions
  initializeAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isInitializing: true,
  isLoading: false,
  error: null,

  initializeAuth: async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        const user = await apiClient.getMe()
        set({ user, isAuthenticated: true, token })
      }
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      set({ user: null, token: null, isAuthenticated: false })
    } finally {
      set({ isInitializing: false })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.login(email, password)
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('token_type', response.token_type)
      localStorage.setItem('token_expires_at', (Date.now() + response.expires_in * 1000).toString())

      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.register(email, password, name)
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('token_type', response.token_type)
      localStorage.setItem('token_expires_at', (Date.now() + response.expires_in * 1000).toString())

      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_type')
      localStorage.removeItem('token_expires_at')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))
