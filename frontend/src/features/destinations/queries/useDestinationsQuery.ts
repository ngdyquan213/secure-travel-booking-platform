import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDestinations } from '@/features/destinations/api/destinations.api'
import { normalizeDestinationQueryParams } from '@/features/destinations/model/destination.schema'
import type { Destination, DestinationQueryParams } from '@/features/destinations/model/destination.types'
import { destinationKeys } from '@/features/destinations/queries/destinationKeys'

export function useDestinationsQuery(params: DestinationQueryParams = {}) {
  const normalizedParams = normalizeDestinationQueryParams(params)

  return useQuery<Destination[], Error>({
    queryKey: destinationKeys.list(normalizedParams),
    queryFn: ({ signal }) => getDestinations(normalizedParams, signal),
    placeholderData: keepPreviousData,
  })
}
