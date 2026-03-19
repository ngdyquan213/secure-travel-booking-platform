import { STORAGE_KEYS } from '../config/constants'

export class StorageService {
  // Auth tokens
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
  }

  getTokenType(): string {
    return localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE) || 'Bearer'
  }

  setTokenType(type: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, type)
  }

  getTokenExpiresAt(): number | null {
    const value = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT)
    return value ? parseInt(value, 10) : null
  }

  setTokenExpiresAt(expiresAt: number): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt.toString())
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiresAt()
    if (!expiresAt) return true
    return Date.now() >= expiresAt
  }

  // User preferences
  getUserPreferences(): Record<string, any> {
    const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    return prefs ? JSON.parse(prefs) : {}
  }

  setUserPreferences(prefs: Record<string, any>): void {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs))
  }

  updateUserPreferences(updates: Record<string, any>): void {
    const current = this.getUserPreferences()
    this.setUserPreferences({ ...current, ...updates })
  }

  // Theme
  getTheme(): 'light' | 'dark' {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME)
    return (theme as 'light' | 'dark') || 'light'
  }

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }

  // Clear all
  clearAll(): void {
    localStorage.clear()
  }

  // Clear auth
  clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT)
  }
}

export const storageService = new StorageService()
