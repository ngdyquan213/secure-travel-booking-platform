import axios from 'axios'
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '@/shared/constants/constants'

interface ApiErrorResponse {
  error_code?: string
  message?: string
  details?: Record<string, unknown>
  timestamp?: string
}

export class HttpError extends Error {
  status: number
  code: string
  data?: unknown

  constructor(status: number, code: string, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.data = data
    this.name = 'HttpError'
  }
}

export class HttpClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            await this.refreshToken()
            const newToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            this.clearAuth()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        // Parse error response
        const errorData = error.response?.data as ApiErrorResponse
        const status = error.response?.status || 500
        const code = errorData?.error_code || 'UNKNOWN_ERROR'
        const message = errorData?.message || error.message || 'An error occurred'

        throw new HttpError(status, code, message, errorData?.details)
      }
    )
  }

  private async refreshToken() {
    const response = await this.client.post('/auth/refresh-token')
    const { access_token, token_type, expires_in } = response.data

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, token_type)
    localStorage.setItem(
      STORAGE_KEYS.TOKEN_EXPIRES_AT,
      (Date.now() + expires_in * 1000).toString()
    )
  }

  private clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT)
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data as T
  }

  // POST request
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data as T
  }

  // PUT request
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data as T
  }

  // PATCH request
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data as T
  }

  // DELETE request
  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data as T
  }
}

export const httpClient = new HttpClient()
