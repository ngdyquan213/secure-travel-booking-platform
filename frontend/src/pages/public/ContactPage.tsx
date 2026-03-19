import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ContactForm } from '../../components/ContactForm'
import { SectionHero } from '../../components/SectionHero'
import { contactMethods, faqs } from '../../data/publicContent'

interface FaqItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-lg font-semibold text-gray-900">{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen ? <p className="mt-4 text-gray-600">{answer}</p> : null}
    </div>
  )
}

export function ContactPage() {
  const [openQuestion, setOpenQuestion] = useState(0)

  return (
    <>
      <SectionHero
        title="Talk to TravelBook before, during, or after your booking"
        subtitle="Questions about payments, changes, support windows, or planning? This public contact flow matches the frontend-test UX."
      />

      <section className="bg-white py-16">
        <div className="container-custom grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            {contactMethods.map((method) => {
              const Icon = method.icon

              return (
                <div key={method.title} className="rounded-[2rem] bg-gray-50 p-8 ring-1 ring-gray-200">
                  <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900">{method.title}</h3>
                  <p className="mt-3 text-gray-600">{method.detail}</p>
                </div>
              )
            })}

            <div className="rounded-[2rem] bg-gray-900 p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Business Hours</p>
              <p className="mt-4 text-lg text-gray-200">Support is available 24/7 for active bookings and urgent issues.</p>
              <p className="mt-3 text-gray-300">General inquiries typically receive a reply within the same day.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Send a Message</p>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">We can help with the next step.</h2>
            <p className="mt-4 text-gray-600">
              Use the form below for booking questions, payment help, service inquiries, or partnership requests.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">FAQ</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900">Answers to the common questions</h2>
          </div>
          <div className="mt-10 grid gap-4">
            {faqs.map((item, index) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openQuestion === index}
                onToggle={() => setOpenQuestion((current) => (current === index ? -1 : index))}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
