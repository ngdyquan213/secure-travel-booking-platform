import { CheckSquare, ShieldCheck, Wrench } from 'lucide-react'

export function OperationsPage() {
  const items = [
    'Review bookings with pending payment status before business close.',
    'Validate document uploads from the account center for upcoming departures.',
    'Monitor refund-related workload until the dedicated refund table is connected.',
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Operations board</h1>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <CheckSquare className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Daily checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <ShieldCheck className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Safe defaults</h2>
          <p className="mt-3 text-sm text-gray-600">The frontend now prefers truthful operational status over decorative placeholder widgets.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <Wrench className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Integration target</h2>
          <p className="mt-3 text-sm text-gray-600">This page is ready to become a live board once the remaining admin APIs are connected into feature-specific tables and charts.</p>
        </div>
      </div>
    </div>
  )
}
