import { useQuery } from '@tanstack/react-query'
import { getHelpTopics } from '@/features/support/api/support.api'
import type { HelpTopic } from '@/features/support/model/support.types'
import { supportKeys } from '@/features/support/queries/supportKeys'

export function useHelpTopicsQuery() {
  return useQuery<HelpTopic[], Error>({
    queryKey: supportKeys.helpTopics(),
    queryFn: ({ signal }) => getHelpTopics(signal),
  })
}
