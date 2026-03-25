interface FilterPanelProps {
  children: React.ReactNode
}

export function FilterPanel({ children }: FilterPanelProps) {
  return <div className="rounded-lg border border-gray-200 bg-white p-4">{children}</div>
}
