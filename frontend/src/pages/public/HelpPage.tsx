import { Link } from 'react-router-dom'
import { LifeBuoy, Lock, ShieldCheck } from 'lucide-react'

const faqs = [
  {
    question: 'How do I know whether a booking is confirmed?',
    answer: 'Check the booking status inside your account dashboard. The frontend now surfaces normalized booking and payment states from the backend response.',
  },
  {
    question: 'Where can I upload passports or visas?',
    answer: 'Use the document center from your profile page. Upload, list, and secure downloads are wired to the backend uploads endpoints.',
  },
  {
    question: 'Can I reset my password here?',
    answer: 'Not yet. The frontend now explains this clearly because the backend does not currently expose forgot-password or reset-password APIs.',
  },
]

export function HelpPage() {
  return (
    <div className="container-custom py-12 space-y-8">
      <section className="rounded-[32px] bg-slate-950 px-8 py-10 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Help center</p>
        <h1 className="mt-3 text-4xl font-bold">Support for booking, payment, and account security</h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          This page focuses on the capabilities actually implemented in the current frontend-backend stack.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <LifeBuoy className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Operational support</h2>
          <p className="mt-3 text-sm text-gray-600">Need help with a booking or a failed payment request? Head to the account support page.</p>
          <Link to="/account/support" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
            Open support
          </Link>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <ShieldCheck className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Document readiness</h2>
          <p className="mt-3 text-sm text-gray-600">Upload and review document records before departure to reduce operational back-and-forth.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <Lock className="h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Security transparency</h2>
          <p className="mt-3 text-sm text-gray-600">When a backend capability is missing, the UI now states that explicitly instead of pretending the feature works.</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-3xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">{faq.question}</h2>
            <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
