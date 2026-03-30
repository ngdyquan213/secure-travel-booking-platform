import { useQuery } from '@tanstack/react-query'
import { getSupportTicketDetail } from '@/features/support/api/support.api'
import type { SupportTicketDetail } from '@/features/support/model/support.types'
import { supportKeys } from '@/features/support/queries/supportKeys'

export function useSupportTicketDetailQuery(ticketId?: string) {
  return useQuery<SupportTicketDetail, Error>({
    queryKey: supportKeys.ticketDetail(ticketId ?? 'pending'),
    queryFn: ({ signal }) => getSupportTicketDetail(ticketId ?? '', signal),
    enabled: Boolean(ticketId),
  })
}
