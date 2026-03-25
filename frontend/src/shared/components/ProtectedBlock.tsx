interface ProtectedBlockProps {
  children: React.ReactNode
  canView?: boolean
}

export function ProtectedBlock({ children, canView = true }: ProtectedBlockProps) {
  return canView ? <>{children}</> : null
}
