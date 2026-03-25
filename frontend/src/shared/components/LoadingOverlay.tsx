interface LoadingOverlayProps {
  show?: boolean
}

export function LoadingOverlay({ show = true }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
    </div>
  )
}
