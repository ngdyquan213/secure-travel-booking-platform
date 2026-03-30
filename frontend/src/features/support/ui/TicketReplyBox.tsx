import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

interface TicketReplyBoxProps {
  onSubmit: (message: string) => Promise<void> | void
  placeholder?: string
  submitLabel?: string
  disabled?: boolean
  className?: string
}

export function TicketReplyBox({
  onSubmit,
  placeholder = 'Add more detail for the support team...',
  submitLabel = 'Send reply',
  disabled = false,
  className,
}: TicketReplyBoxProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    const normalizedMessage = message.trim()

    if (normalizedMessage.length < 12) {
      setError('Please include a bit more context before sending your reply.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit(normalizedMessage)
      setMessage('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <textarea
        value={message}
        onChange={(event) => {
          setMessage(event.target.value)
          if (error) {
            setError('')
          }
        }}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        rows={5}
        className={cn(
          'w-full rounded-[1.5rem] border bg-white px-4 py-3 text-sm leading-7 text-[color:var(--color-on-surface)] outline-none transition-colors',
          'border-[color:var(--color-outline-variant)] focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary-soft)]',
          disabled && 'cursor-not-allowed bg-[color:var(--color-surface-low)]'
        )}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="hero"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={disabled}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
