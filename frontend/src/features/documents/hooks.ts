import { useQuery, useMutation } from '../../hooks/useQuery'
import { documentsApi } from './api'
import * as types from '../../types/api'

export function useUploadDocument() {
  return useMutation<
    { document: types.Document },
    { documentType: string; file: File }
  >(({ documentType, file }) => documentsApi.uploadDocument(documentType, file))
}

export function useUserDocuments() {
  return useQuery<{ documents: types.Document[] }>('/documents')
}

export function useDeleteDocument() {
  return useMutation<void, string>((id) => documentsApi.deleteDocument(id))
}

export function useDocumentById(id: string) {
  return useQuery<{ document: types.Document }>(`/documents/${id}`)
}
