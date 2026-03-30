import { Card } from '@/shared/ui/Card'
import type { SupportTicket, SupportTicketStatus } from '@/features/support/model/support.types'
import { cn } from '@/shared/lib/cn'

interface TicketListProps {
  tickets: SupportTicket[]
  selectedTicketId?: string
  onSelectTicket?: (ticketId: string) => void
  emptyTitle?: string
  emptyDescription?: string
}

const statusStyles: Record<SupportTicketStatus, string> = {
  open: 'bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]',
  in_review: 'bg-[color:var(--color-tertiary-soft)] text-[color:var(--color-primary)]',
  waiting_for_traveler: 'bg-[color:var(--color-secondary-container)] text-[color:var(--color-secondary-strong)]',
  resolved: 'bg-[color:var(--color-surface-low)] text-[color:var(--color-on-surface-variant)]',
}

function formatTicketDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatStatusLabel(status: SupportTicketStatus) {
  return status.replace(/_/g, ' ')
}

export function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  emptyTitle = 'No support requests yet',
  emptyDescription = 'When travelers submit a request, it will appear here with status and routing context.',
}: TicketListProps) {
  if (!tickets.length) {
    return (
      <Card padding="lg">
        <div className="space-y-3 text-center">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--color-primary)]">
            {emptyTitle}
          </h3>
          <p className="mx-auto max-w-xl text-sm leading-7 text-[color:var(--color-on-surface-variant)]">
            {emptyDescription}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <button
          key={ticket.id}
          type="button"
          onClick={() => onSelectTicket?.(ticket.id)}
          className="block w-full text-left"
        >
          <Card
            className={cn(
              'rounded-[1.75rem] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]',
              selectedTicketId === ticket.id && 'border-[color:var(--color-primary)] shadow-[0_18px_44px_rgba(0,17,58,0.12)]'
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[color:var(--color-primary)]">
                    {ticket.subject}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]',
                      statusStyles[ticket.status]
                    )}
                  >
                    {formatStatusLabel(ticket.status)}
                  </span>
                </div>
                <p className="text-sm font-medium text-[color:var(--color-on-surface)]">
                  {ticket.reference} · {ticket.topicLabel}
                </p>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-on-surface-variant)]">
                  {ticket.messagePreview}
                </p>
              </div>

              <div className="space-y-1 text-right text-sm text-[color:var(--color-on-surface-variant)]">
                <p>{formatTicketDate(ticket.updatedAt)}</p>
                <p>{ticket.requesterName}</p>
              </div>
            </div>
          </Card>
        </button>
      ))}
    </div>
  )
}
