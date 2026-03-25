import { FileCheck2, FileSearch, Shield } from 'lucide-react'

export function DocumentManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Document operations</h1>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <FileSearch className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Current visibility</h2>
          <p className="mt-2 text-sm text-gray-600">Traveler document uploads are available in the account area and stored through the uploads API.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <FileCheck2 className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Admin next step</h2>
          <p className="mt-2 text-sm text-gray-600">The admin review table is still pending API integration, so this page currently acts as an operations note instead of a fake moderation queue.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <Shield className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Security posture</h2>
          <p className="mt-2 text-sm text-gray-600">Keeping unsupported actions out of the UI is safer than presenting buttons that would fail against the live backend.</p>
        </div>
      </div>
    </div>
  )
}
