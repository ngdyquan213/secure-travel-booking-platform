import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSupportTicket } from '@/features/support/api/support.api'
import type {
  CreateSupportTicketPayload,
  SupportTicketDetail,
} from '@/features/support/model/support.types'
import { supportKeys } from '@/features/support/queries/supportKeys'

export function useCreateSupportTicketMutation() {
  const queryClient = useQueryClient()

  return useMutation<SupportTicketDetail, Error, CreateSupportTicketPayload>({
    mutationFn: createSupportTicket,
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() })
      queryClient.setQueryData(supportKeys.ticketDetail(ticket.id), ticket)
    },
  })
}
