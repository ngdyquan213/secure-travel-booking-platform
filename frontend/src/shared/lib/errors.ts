import { HttpError } from '@/shared/api/httpClient'

/**
 * Get user-friendly error message from HTTP error
 */
export function getErrorMessage(error: any): string {
  if (error instanceof HttpError) {
    // Handle specific error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'Your session has expired. Please log in again.'
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.'
      case 'NOT_FOUND':
        return 'The requested resource was not found.'
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.'
      case 'DUPLICATE_ENTRY':
        return 'This item already exists.'
      case 'INSUFFICIENT_BALANCE':
        return 'Your balance is insufficient.'
      case 'BOOKING_CONFLICT':
        return 'This item is no longer available.'
      case 'PAYMENT_FAILED':
        return 'Payment processing failed. Please try again.'
      default:
        return error.message || 'An error occurred. Please try again.'
    }
  }

  if (error?.response?.status === 401) {
    return 'Your session has expired. Please log in again.'
  }

  if (error?.message) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again later.'
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return error?.message === 'Network Error' || error?.code === 'ECONNABORTED'
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')
}

/**
 * Log error for debugging
 */
export function logError(error: any, context?: string): void {
  console.error('[Error]', context || 'An error occurred:', error)
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string>): { field: string; message: string }[] {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message,
  }))
}
