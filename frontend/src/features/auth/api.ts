import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export const authApi = {
  login: async (email: string, password: string): Promise<types.AuthResponse> => {
    return httpClient.post('/auth/login', { email, password })
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<types.AuthResponse> => {
    return httpClient.post('/auth/register', { email, password, name })
  },

  logout: async (): Promise<void> => {
    return httpClient.post('/auth/logout', {})
  },

  getMe: async (): Promise<{ user: types.User }> => {
    return httpClient.get('/auth/me')
  },

  refreshToken: async (): Promise<types.TokenRefreshResponse> => {
    return httpClient.post('/auth/refresh-token', {})
  },

  updateProfile: async (data: Partial<types.User>): Promise<{ user: types.User }> => {
    return httpClient.patch('/auth/profile', data)
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    return httpClient.post('/auth/change-password', { oldPassword, newPassword })
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return httpClient.post('/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return httpClient.post('/auth/reset-password', { token, newPassword })
  },
}
