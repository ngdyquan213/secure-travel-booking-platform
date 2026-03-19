import { http } from '../../services/http'
import { API_ENDPOINTS } from '../../config/api'

export const travelersAPI = {
  list: () => http.get(API_ENDPOINTS.users.travelers),
  create: (data: any) => http.post(API_ENDPOINTS.users.travelers, data),
  update: (id: string, data: any) => http.put(`${API_ENDPOINTS.users.travelers}/${id}`, data),
  delete: (id: string) => http.delete(`${API_ENDPOINTS.users.travelers}/${id}`),
}
