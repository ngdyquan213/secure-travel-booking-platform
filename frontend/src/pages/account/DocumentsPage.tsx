import { useQuery } from '../../hooks/useQuery'
import { FileText, Plus, Trash2, CheckCircle, Clock } from 'lucide-react'
import * as types from '../../types/api'

export default function DocumentsPage() {
  const { data, isLoading } = useQuery<{ documents: types.Document[] }>(
    '/documents'
  )

  const documents = data?.documents || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50'
      case 'REJECTED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === 'APPROVED') return <CheckCircle className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading documents...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents uploaded</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.file_name}</p>
                    <p className="text-sm text-gray-600">{doc.document_type}</p>
                    {doc.expiry_date && (
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    {doc.status}
                  </div>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
