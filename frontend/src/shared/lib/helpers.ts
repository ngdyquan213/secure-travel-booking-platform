// UUID generation for idempotency keys
export const generateIdempotencyKey = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

// Format currency
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date and time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format time duration (minutes to hours and minutes)
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isStrong: boolean
  messages: string[]
} => {
  const messages: string[] = []

  if (password.length < 8) {
    messages.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    messages.push('Password must contain an uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    messages.push('Password must contain a lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    messages.push('Password must contain a number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    messages.push('Password must contain a special character (!@#$%^&*)')
  }

  return {
    isStrong: messages.length === 0,
    messages,
  }
}

// Get status badge color
export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    FAILED: 'bg-red-100 text-red-800',
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

// Calculate days between dates
export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Generate idempotency key (simpler version without uuid)
export const generateIdempotencyKeySimple = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
