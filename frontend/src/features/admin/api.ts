import { http } from '../../services/http'
import { API_ENDPOINTS } from '../../config/api'

export const adminAPI = {
  dashboard: () => http.get(API_ENDPOINTS.admin.dashboard),
  users: {
    list: () => http.get(API_ENDPOINTS.admin.users),
    detail: (id: string) => http.get(`${API_ENDPOINTS.admin.users}/${id}`),
    update: (id: string, data: any) => http.put(`${API_ENDPOINTS.admin.users}/${id}`, data),
    delete: (id: string) => http.delete(`${API_ENDPOINTS.admin.users}/${id}`),
  },
  bookings: {
    list: () => http.get(API_ENDPOINTS.admin.bookings),
    detail: (id: string) => http.get(`${API_ENDPOINTS.admin.bookings}/${id}`),
  },
  payments: {
    list: () => http.get(API_ENDPOINTS.admin.payments),
    detail: (id: string) => http.get(`${API_ENDPOINTS.admin.payments}/${id}`),
  },
}
