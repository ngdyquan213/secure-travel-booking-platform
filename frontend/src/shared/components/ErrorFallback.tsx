interface ErrorFallbackProps {
  message?: string
}

export function ErrorFallback({ message = 'Something went wrong.' }: ErrorFallbackProps) {
  return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>
}
