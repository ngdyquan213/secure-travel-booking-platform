import { HandCoins, ShieldCheck, TicketSlash } from 'lucide-react'

export function RefundManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Refund management</h1>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <HandCoins className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Current status</h2>
          <p className="mt-2 text-sm text-gray-600">Backend refund APIs exist for admin users, but a dedicated frontend table is still pending integration.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <TicketSlash className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Recommended workflow</h2>
          <p className="mt-2 text-sm text-gray-600">Use dashboard counts and booking-level investigations to prioritize cases until the refund list UI is wired.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <ShieldCheck className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Why not fake data</h2>
          <p className="mt-2 text-sm text-gray-600">This screen now explains the real system state instead of rendering placeholder rows that could mislead operators.</p>
        </div>
      </div>
    </div>
  )
}
