import { useCallback, useEffect, useState } from 'react'
import { httpClient, HttpError } from '../services/http'

interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: HttpError) => void
  enabled?: boolean
  cacheTime?: number
}

interface UseQueryState<T> {
  data: T | null
  isLoading: boolean
  error: HttpError | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching data
 */
export function useQuery<T>(
  url: string,
  options?: UseQueryOptions<T>
): UseQueryState<T> {
  const [state, setState] = useState<UseQueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const enabled = options?.enabled !== false

  const refetch = useCallback(async () => {
    if (!enabled) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await httpClient.get<T>(url)
      setState((prev) => ({
        ...prev,
        data: response,
        isLoading: false,
      }))
      options?.onSuccess?.(response)
    } catch (error) {
      const httpError = error instanceof HttpError ? error : new HttpError(500, 'UNKNOWN', String(error))
      setState((prev) => ({
        ...prev,
        error: httpError,
        isLoading: false,
      }))
      options?.onError?.(httpError)
    }
  }, [url, enabled, options])

  useEffect(() => {
    refetch()
  }, [url, enabled])

  return {
    ...state,
    refetch,
  }
}

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: HttpError, variables: TVariables) => void
}

interface UseMutationState<TData> {
  data: TData | null
  isLoading: boolean
  error: HttpError | null
}

/**
 * Custom hook for mutations (POST, PUT, DELETE, PATCH)
 */
export function useMutation<TData, TVariables = any>(
  fn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TVariables>
): [UseMutationState<TData>, (variables: TVariables) => Promise<TData>] {
  const [state, setState] = useState<UseMutationState<TData>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const response = await fn(variables)
        setState((prev) => ({
          ...prev,
          data: response,
          isLoading: false,
        }))
        options?.onSuccess?.(response, variables)
        return response
      } catch (error) {
        const httpError = error instanceof HttpError ? error : new HttpError(500, 'UNKNOWN', String(error))
        setState((prev) => ({
          ...prev,
          error: httpError,
          isLoading: false,
        }))
        options?.onError?.(httpError, variables)
        throw httpError
      }
    },
    [fn, options]
  )

  return [state, execute]
}
