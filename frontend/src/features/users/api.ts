import { http } from '../../services/http'
import { API_ENDPOINTS } from '../../config/api'

export const usersAPI = {
  getProfile: () => http.get(API_ENDPOINTS.users.profile),
  updateProfile: (data: any) => http.put(API_ENDPOINTS.users.update, data),
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
