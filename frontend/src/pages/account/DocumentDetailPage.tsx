import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export function DocumentDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Document detail</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Document records are managed from the document center</h1>
        <p className="mt-2 text-gray-600">
          The current router does not expose an item-specific document detail endpoint yet, so all upload, download, and review actions stay centralized in the account document page.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Why this matters</h2>
            <p className="mt-2 text-sm text-gray-600">
              Keeping all document actions in a single screen avoids dead-end navigation until item-level routing is fully defined.
            </p>
          </div>
        </div>
      </div>

      <Link to="/account/documents" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" />
        Return to document center
      </Link>
    </div>
  )
}
