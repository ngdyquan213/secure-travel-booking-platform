import { useQuery } from '@tanstack/react-query'
import { getSupportTickets } from '@/features/support/api/support.api'
import type { SupportTicket } from '@/features/support/model/support.types'
import { supportKeys } from '@/features/support/queries/supportKeys'

export function useSupportTicketsQuery() {
  return useQuery<SupportTicket[], Error>({
    queryKey: supportKeys.tickets(),
    queryFn: ({ signal }) => getSupportTickets(signal),
  })
}
