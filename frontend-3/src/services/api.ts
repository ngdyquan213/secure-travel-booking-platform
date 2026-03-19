import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../stores/authStore'
import * as types from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            await this.refreshToken()
            const token = useAuthStore.getState().token
            originalRequest.headers.Authorization = `Bearer ${token}`
            return this.client(originalRequest)
          } catch (refreshError) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<types.AuthResponse> {
    const response = await this.client.post('/auth/login', { email, password })
    return response.data
  }

  async register(email: string, password: string, name: string): Promise<types.AuthResponse> {
    const response = await this.client.post('/auth/register', { email, password, name })
    return response.data
  }

  async refreshToken(): Promise<types.TokenRefreshResponse> {
    const response = await this.client.post('/auth/refresh-token')
    return response.data
  }

  async getMe(): Promise<types.User> {
    const response = await this.client.get('/auth/me')
    return response.data.user
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout')
  }

  // Flight endpoints
  async searchFlights(params: types.FlightSearchParams): Promise<types.FlightSearchResponse> {
    const response = await this.client.get('/flights/search', { params })
    return response.data
  }

  async getFlightById(id: string): Promise<types.Flight> {
    const response = await this.client.get(`/flights/${id}`)
    return response.data.flight
  }

  // Hotel endpoints
  async searchHotels(params: types.HotelSearchParams): Promise<types.HotelSearchResponse> {
    const response = await this.client.get('/hotels/search', { params })
    return response.data
  }

  async getHotelById(id: string): Promise<types.Hotel> {
    const response = await this.client.get(`/hotels/${id}`)
    return response.data.hotel
  }

  // Tour endpoints
  async searchTours(params: types.TourSearchParams): Promise<types.TourSearchResponse> {
    const response = await this.client.get('/tours/search', { params })
    return response.data
  }

  async getTourById(id: string): Promise<types.Tour> {
    const response = await this.client.get(`/tours/${id}`)
    return response.data.tour
  }

  // Booking endpoints
  async createBooking(data: types.CreateBookingRequest): Promise<types.BookingResponse> {
    const response = await this.client.post('/bookings', data)
    return response.data
  }

  async getBooking(id: string): Promise<types.BookingResponse> {
    const response = await this.client.get(`/bookings/${id}`)
    return response.data
  }

  async getUserBookings(limit = 10, offset = 0): Promise<{
    bookings: types.Booking[]
    total: number
  }> {
    const response = await this.client.get('/bookings/user/bookings', {
      params: { limit, offset },
    })
    return response.data
  }

  async cancelBooking(id: string): Promise<void> {
    await this.client.post(`/bookings/${id}/cancel`)
  }

  // Payment endpoints
  async initiatePayment(
    data: types.InitiatePaymentRequest
  ): Promise<types.InitiatePaymentResponse> {
    const response = await this.client.post('/payments/initiate', data)
    return response.data
  }

  async getPayment(id: string): Promise<types.Payment> {
    const response = await this.client.get(`/payments/${id}`)
    return response.data.payment
  }

  async confirmPayment(paymentId: string): Promise<types.Payment> {
    const response = await this.client.post(`/payments/${paymentId}/confirm`)
    return response.data.payment
  }

  // Document endpoints
  async uploadDocument(documentType: string, file: File): Promise<types.Document> {
    const formData = new FormData()
    formData.append('document_type', documentType)
    formData.append('file', file)

    const response = await this.client.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.document
  }

  async getUserDocuments(): Promise<types.Document[]> {
    const response = await this.client.get('/documents')
    return response.data.documents
  }

  async deleteDocument(id: string): Promise<void> {
    await this.client.delete(`/documents/${id}`)
  }

  // Admin endpoints
  async getAdminStats(): Promise<types.AdminStats> {
    const response = await this.client.get('/admin/stats')
    return response.data
  }

  async getAllUsers(limit = 10, offset = 0): Promise<{
    users: types.AdminUser[]
    total: number
  }> {
    const response = await this.client.get('/admin/users', {
      params: { limit, offset },
    })
    return response.data
  }

  async getAllBookings(limit = 10, offset = 0): Promise<{
    bookings: types.Booking[]
    total: number
  }> {
    const response = await this.client.get('/admin/bookings', {
      params: { limit, offset },
    })
    return response.data
  }

  async approvePendingDocuments(): Promise<void> {
    await this.client.post('/admin/approve-documents')
  }
}

export const apiClient = new ApiClient()
