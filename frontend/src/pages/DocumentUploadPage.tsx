import { useState, useEffect, useRef } from 'react'
import { apiClient } from '../services/api'
import { formatDate, formatFileSize, getStatusColor } from '../utils/helpers'
import { Upload, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import * as types from '../types/api'

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState<types.Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [documentType, setDocumentType] = useState('passport')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const docs = await apiClient.getUserDocuments()
      setDocuments(docs)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and image files are allowed')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const doc = await apiClient.uploadDocument(documentType, file)
      setDocuments([doc, ...documents])
      setSuccess('Document uploaded successfully')
      setDocumentType('passport')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      await apiClient.deleteDocument(id)
      setDocuments(documents.filter((d) => d.id !== id))
      setSuccess('Document deleted successfully')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete document')
    }
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Management</h1>
        <p className="text-gray-600">Upload and manage your travel documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Upload Document</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="input-field"
                >
                  <option value="passport">Passport</option>
                  <option value="visa">Visa</option>
                  <option value="id">National ID</option>
                  <option value="insurance">Travel Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                  accept="application/pdf,image/jpeg,image/png"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Select File'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  PDF or image (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Your Documents</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="card p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600">Upload your first travel document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {doc.document_type}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>File: {doc.file_name}</p>
                        <p>Uploaded: {formatDate(doc.upload_date)}</p>
                        {doc.expiry_date && (
                          <p>Expires: {formatDate(doc.expiry_date)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
