export const supportKeys = {
  all: ['support'] as const,
  helpTopics: () => [...supportKeys.all, 'help-topics'] as const,
  faqs: () => [...supportKeys.all, 'faqs'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  ticketDetails: () => [...supportKeys.all, 'ticket-detail'] as const,
  ticketDetail: (ticketId: string) => [...supportKeys.ticketDetails(), ticketId] as const,
}
