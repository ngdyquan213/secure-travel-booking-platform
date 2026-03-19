import { httpClient } from '../../services/http'
import * as types from '../../types/api'

export const documentsApi = {
  uploadDocument: async (documentType: string, file: File): Promise<{ document: types.Document }> => {
    const formData = new FormData()
    formData.append('document_type', documentType)
    formData.append('file', file)

    return httpClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getUserDocuments: async (): Promise<{ documents: types.Document[] }> => {
    return httpClient.get('/documents')
  },

  deleteDocument: async (id: string): Promise<void> => {
    return httpClient.delete(`/documents/${id}`)
  },

  getDocumentById: async (id: string): Promise<{ document: types.Document }> => {
    return httpClient.get(`/documents/${id}`)
  },

  updateDocument: async (id: string, data: Partial<types.Document>): Promise<{ document: types.Document }> => {
    return httpClient.patch(`/documents/${id}`, data)
  },

  approveDocument: async (id: string): Promise<{ document: types.Document }> => {
    return httpClient.post(`/documents/${id}/approve`, {})
  },

  rejectDocument: async (id: string, reason: string): Promise<{ document: types.Document }> => {
    return httpClient.post(`/documents/${id}/reject`, { reason })
  },
}
