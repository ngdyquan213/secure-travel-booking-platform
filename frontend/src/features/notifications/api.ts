import { http } from '../../services/http'

export const notificationsAPI = {
  list: () => http.get('/notifications'),
  markAsRead: (id: string) => http.put(`/notifications/${id}/read`),
  markAllAsRead: () => http.put('/notifications/read-all'),
  delete: (id: string) => http.delete(`/notifications/${id}`),
}
