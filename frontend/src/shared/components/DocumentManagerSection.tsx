import { useEffect, useRef, useState } from 'react'
import { apiClient } from '@/shared/api/apiClient'
import { formatDate, formatFileSize, getStatusColor } from '@/shared/lib/helpers'
import { Upload, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import type * as types from '@/shared/types/api'

export default function DocumentManagerSection() {
  const [documents, setDocuments] = useState<types.Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [documentType, setDocumentType] = useState('passport')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await apiClient.getUserDocuments()
        setDocuments(docs)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to load documents')
      } finally {
        setLoading(false)
      }
    }

    void fetchDocuments()
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 5 * 1024 * 1024
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
      setDocuments((currentDocuments) => [doc, ...currentDocuments])
      setSuccess('Document uploaded successfully')
      setDocumentType('passport')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      await apiClient.deleteDocument(id)
      setDocuments((currentDocuments) => currentDocuments.filter((document) => document.id !== id))
      setSuccess('Document deleted successfully')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to delete document')
    }
  }

  const handleDownload = async (document: types.Document) => {
    try {
      setDownloadingId(document.id)
      setError('')

      const blob = await apiClient.downloadDocument(document.id)
      const objectUrl = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = objectUrl
      link.download = document.file_name
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to download document')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Travel documents</h2>
          <p className="text-gray-600 mt-1">Upload, review, download, or remove your travel paperwork here.</p>
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-3 mb-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <div className="rounded-3xl bg-slate-50 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Upload document</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="input-field"
              >
                <option value="passport">Passport</option>
                <option value="visa">Visa</option>
                <option value="national_id">National ID</option>
                <option value="invoice">Invoice</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose File</label>
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
              <p className="text-xs text-gray-500 mt-2">PDF or image (max 5MB)</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-5">Your documents</h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin">
                <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center bg-white">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600">Upload your first travel document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="rounded-3xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {document.document_type.replace(/_/g, ' ')}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {document.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>File: {document.file_name}</p>
                        <p>Uploaded: {formatDate(document.upload_date)}</p>
                        {document.file_size && <p>Size: {formatFileSize(document.file_size)}</p>}
                        {document.expiry_date && <p>Expires: {formatDate(document.expiry_date)}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void handleDownload(document)}
                        disabled={downloadingId === document.id}
                        className="px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        {downloadingId === document.id ? 'Downloading...' : 'Download'}
                      </button>
                      <button
                        onClick={() => void handleDelete(document.id)}
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
    </section>
  )
}
