import { normalizeCreateSupportTicketPayload } from '@/features/support/model/support.schema'
import type {
  CreateSupportTicketPayload,
  FaqItem,
  HelpTopic,
  SupportTicket,
  SupportTicketDetail,
} from '@/features/support/model/support.types'

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'booking-process',
    title: 'Booking Process',
    description: 'Guidance on availability, confirmations, and preparing a booking without last-minute surprises.',
    iconKey: 'ticket',
    bullets: ['How to book a tour', 'Instant confirmation timing', 'What to expect after checkout'],
    ctaLabel: 'View booking answers',
    searchTerms: ['booking', 'confirmations', 'reserve', 'checkout'],
  },
  {
    id: 'schedules-and-changes',
    title: 'Schedules & Changes',
    description: 'Answers for date changes, itinerary updates, traveler notifications, and operational timing.',
    iconKey: 'calendar',
    bullets: ['Trip date changes', 'Notification preferences', 'Departure updates'],
    ctaLabel: 'Explore change options',
    searchTerms: ['schedule', 'changes', 'reschedule', 'dates', 'notifications'],
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Clear information about secure payments, receipts, card handling, and billing confidence.',
    iconKey: 'wallet',
    bullets: ['Accepted payment methods', 'Receipts and invoices', 'Secure transaction handling'],
    ctaLabel: 'Review payment guidance',
    searchTerms: ['payments', 'cards', 'invoice', 'receipt', 'billing'],
  },
  {
    id: 'refunds',
    title: 'Refunds',
    description: 'Policy clarity for cancellations, refund timing, and next steps when plans need to shift.',
    iconKey: 'refund',
    bullets: ['Refund eligibility', 'Processing timelines', 'Cancellation policy support'],
    ctaLabel: 'See refund policies',
    searchTerms: ['refund', 'cancellation', 'cancel', 'policy'],
  },
]

const FAQS: FaqItem[] = [
  {
    id: 'faq-booking-how-to-book',
    topicId: 'booking-process',
    categoryTitle: 'Booking Process',
    categoryIconKey: 'ticket',
    question: 'How do I book a tour?',
    answer:
      'Browse available tours, choose your preferred departure date, and complete checkout with traveler details and payment. Most experiences confirm instantly, while a small number may require operator review before final issuance.',
  },
  {
    id: 'faq-booking-confirmation',
    topicId: 'booking-process',
    categoryTitle: 'Booking Process',
    categoryIconKey: 'ticket',
    question: 'When will I receive my confirmation?',
    answer:
      'Most bookings are confirmed within minutes. You will receive a confirmation email and receipt shortly after a successful payment, and the booking will also appear inside your account once processing completes.',
  },
  {
    id: 'faq-schedule-change-dates',
    topicId: 'schedules-and-changes',
    categoryTitle: 'Schedules & Changes',
    categoryIconKey: 'calendar',
    question: 'Can I manage my trip dates after booking?',
    answer:
      'Yes, when the supplier allows date changes. Availability and any fare difference depend on the operator terms, but our support team can help review the best available options before you commit to a change.',
  },
  {
    id: 'faq-schedule-notifications',
    topicId: 'schedules-and-changes',
    categoryTitle: 'Schedules & Changes',
    categoryIconKey: 'calendar',
    question: 'How do notification settings work?',
    answer:
      'Important updates such as itinerary changes, payment confirmations, and operational notices are sent by email. Optional marketing and inspiration emails can be managed separately from your traveler communication preferences.',
  },
  {
    id: 'faq-payments-methods',
    topicId: 'payments',
    categoryTitle: 'Payments',
    categoryIconKey: 'wallet',
    question: 'Which payment methods are secure?',
    answer:
      'We support major cards through encrypted checkout flows designed for secure transaction handling. Available methods may expand by market and operator, but every completed payment goes through the same trust-first verification steps.',
  },
  {
    id: 'faq-payments-receipts',
    topicId: 'payments',
    categoryTitle: 'Payments',
    categoryIconKey: 'wallet',
    question: 'How do I access my receipts?',
    answer:
      'Receipts are sent by email after payment and can also be surfaced from your booking records. If you need a billing copy for finance or travel policy purposes, support can help resend the latest receipt.',
  },
  {
    id: 'faq-refunds-eligibility',
    topicId: 'refunds',
    categoryTitle: 'Refunds',
    categoryIconKey: 'refund',
    question: 'Am I eligible for a refund?',
    answer:
      'Refund eligibility depends on the cancellation terms of the specific booking. We keep refundability visible before purchase, and support can help review what applies to your reservation if plans change later.',
  },
  {
    id: 'faq-refunds-timeline',
    topicId: 'refunds',
    categoryTitle: 'Refunds',
    categoryIconKey: 'refund',
    question: 'What is the usual refund timeline?',
    answer:
      'Once a refund is approved, funds commonly return within five to ten business days depending on the payment provider and issuing bank. You will receive confirmation once the refund has been processed from our side.',
  },
]

let supportTicketDetails: SupportTicketDetail[] = [
  {
    id: 'support-ticket-1001',
    reference: 'TB-SUP-1001',
    topicId: 'refunds',
    topicLabel: 'Refunds',
    subject: 'Refund follow-up for summer itinerary',
    requesterName: 'Avery Collins',
    requesterEmail: 'avery.collins@example.com',
    bookingReference: 'TB-87214',
    message:
      'My operator approved the cancellation yesterday. Could you confirm when the refund will be reflected on my original card?',
    messagePreview: 'My operator approved the cancellation yesterday. Could you confirm when the refund will be reflected...',
    status: 'in_review',
    createdAt: '2026-03-24T09:30:00.000Z',
    updatedAt: '2026-03-24T13:00:00.000Z',
    replies: [
      {
        id: 'support-reply-1001',
        authorName: 'TravelBook Support',
        authorRole: 'support',
        message: 'Our payments team is verifying the refund handoff with the banking partner and will update you as soon as the settlement is confirmed.',
        createdAt: '2026-03-24T13:00:00.000Z',
      },
    ],
  },
  {
    id: 'support-ticket-1002',
    reference: 'TB-SUP-1002',
    topicId: 'schedules-and-changes',
    topicLabel: 'Schedules & Changes',
    subject: 'Need to move departure by one day',
    requesterName: 'Lena Ortega',
    requesterEmail: 'lena.ortega@example.com',
    bookingReference: 'TB-66421',
    message:
      'I have an inbound flight delay and may need to move the tour start from Thursday to Friday. Please advise on the best next step.',
    messagePreview: 'I have an inbound flight delay and may need to move the tour start from Thursday to Friday...',
    status: 'waiting_for_traveler',
    createdAt: '2026-03-20T08:15:00.000Z',
    updatedAt: '2026-03-20T10:45:00.000Z',
    replies: [
      {
        id: 'support-reply-1002',
        authorName: 'TravelBook Support',
        authorRole: 'support',
        message: 'We found one alternate departure. Please confirm whether you want us to request the change so we can secure the remaining availability.',
        createdAt: '2026-03-20T10:45:00.000Z',
      },
    ],
  },
]

function delay(durationMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      cleanup()
      resolve()
    }, durationMs)

    const handleAbort = () => {
      window.clearTimeout(timeoutId)
      cleanup()
      reject(new DOMException('The operation was aborted.', 'AbortError'))
    }

    const cleanup = () => {
      signal?.removeEventListener('abort', handleAbort)
    }

    signal?.addEventListener('abort', handleAbort)
  })
}

function cloneTicketDetail(ticket: SupportTicketDetail): SupportTicketDetail {
  return {
    ...ticket,
    replies: ticket.replies.map((reply) => ({ ...reply })),
  }
}

function toTicketSummary(ticket: SupportTicketDetail): SupportTicket {
  return {
    id: ticket.id,
    reference: ticket.reference,
    topicId: ticket.topicId,
    topicLabel: ticket.topicLabel,
    subject: ticket.subject,
    requesterName: ticket.requesterName,
    requesterEmail: ticket.requesterEmail,
    bookingReference: ticket.bookingReference,
    messagePreview: ticket.messagePreview,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }
}

function buildMessagePreview(message: string) {
  return message.length > 96 ? `${message.slice(0, 93)}...` : message
}

function generateTicketReference() {
  const nextNumber = 1000 + supportTicketDetails.length + 1
  return `TB-SUP-${nextNumber}`
}

function generateTicketId() {
  return `support-ticket-${Date.now()}`
}

export async function getHelpTopics(signal?: AbortSignal) {
  await delay(280, signal)
  return HELP_TOPICS.map((topic) => ({
    ...topic,
    bullets: [...topic.bullets],
    searchTerms: [...topic.searchTerms],
  }))
}

export async function getFaqs(signal?: AbortSignal) {
  await delay(320, signal)
  return FAQS.map((faq) => ({ ...faq }))
}

export async function getSupportTickets(signal?: AbortSignal) {
  await delay(360, signal)
  return supportTicketDetails
    .slice()
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .map(toTicketSummary)
}

export async function getSupportTicketDetail(ticketId: string, signal?: AbortSignal) {
  await delay(240, signal)

  const ticket = supportTicketDetails.find((item) => item.id === ticketId)

  if (!ticket) {
    throw new Error('Support ticket not found.')
  }

  return cloneTicketDetail(ticket)
}

export async function createSupportTicket(payload: CreateSupportTicketPayload) {
  await delay(420)

  const normalizedPayload = normalizeCreateSupportTicketPayload(payload)
  const matchedTopic = HELP_TOPICS.find((topic) => topic.id === normalizedPayload.topicId)
  const now = new Date().toISOString()

  const createdTicket: SupportTicketDetail = {
    id: generateTicketId(),
    reference: generateTicketReference(),
    topicId: normalizedPayload.topicId,
    topicLabel: matchedTopic?.title ?? 'General Support',
    subject: normalizedPayload.subject,
    requesterName: normalizedPayload.fullName,
    requesterEmail: normalizedPayload.email,
    bookingReference: normalizedPayload.bookingReference,
    message: normalizedPayload.message,
    messagePreview: buildMessagePreview(normalizedPayload.message),
    status: 'open',
    createdAt: now,
    updatedAt: now,
    replies: [
      {
        id: `support-reply-${Date.now()}`,
        authorName: 'TravelBook Support',
        authorRole: 'support',
        message: 'Thanks for reaching out. Our concierge team has received your request and will follow up with the next best step shortly.',
        createdAt: now,
      },
    ],
  }

  supportTicketDetails = [createdTicket, ...supportTicketDetails]

  return cloneTicketDetail(createdTicket)
}
