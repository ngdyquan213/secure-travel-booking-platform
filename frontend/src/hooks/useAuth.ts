import { useCallback, useEffect, useState } from 'react'
import { httpClient } from '../services/http'
import { storageService } from '../services/storage'
import { STORAGE_KEYS } from '../config/constants'
import * as types from '../types/api'

interface AuthState {
  user: types.User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitializing: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    error: null,
  })

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = useCallback(async () => {
    try {
      const token = storageService.getAccessToken()
      if (token && !storageService.isTokenExpired()) {
        const user = await httpClient.get<{ user: types.User }>('/auth/me')
        setState((prev) => ({
          ...prev,
          user: user.user,
          isAuthenticated: true,
          isInitializing: false,
        }))
      } else {
        storageService.clearAuth()
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          isInitializing: false,
        }))
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      storageService.clearAuth()
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isInitializing: false,
      }))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await httpClient.post<types.AuthResponse>('/auth/login', {
        email,
        password,
      })

      storageService.setAccessToken(response.access_token)
      storageService.setTokenType(response.token_type)
      storageService.setTokenExpiresAt(Date.now() + response.expires_in * 1000)

      setState((prev) => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed'
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
      throw error
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await httpClient.post<types.AuthResponse>('/auth/register', {
        email,
        password,
        name,
      })

      storageService.setAccessToken(response.access_token)
      storageService.setTokenType(response.token_type)
      storageService.setTokenExpiresAt(Date.now() + response.expires_in * 1000)

      setState((prev) => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed'
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      await httpClient.post('/auth/logout', {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      storageService.clearAuth()
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }))
    }
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
    initializeAuth,
  }
}
