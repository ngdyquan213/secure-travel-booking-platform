import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialLimit?: number
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setPage(initialPage)
    setLimit(initialLimit)
  }, [initialPage, initialLimit])

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    reset,
  }
}
