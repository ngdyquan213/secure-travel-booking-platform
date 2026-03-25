interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{status}</span>
}
