import { useQuery } from '@tanstack/react-query'
import { getFaqs } from '@/features/support/api/support.api'
import type { FaqItem } from '@/features/support/model/support.types'
import { supportKeys } from '@/features/support/queries/supportKeys'

export function useFaqsQuery() {
  return useQuery<FaqItem[], Error>({
    queryKey: supportKeys.faqs(),
    queryFn: ({ signal }) => getFaqs(signal),
  })
}
