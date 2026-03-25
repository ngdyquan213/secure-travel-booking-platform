interface CurrencyTextProps {
  value: number
  currency?: string
}

export function CurrencyText({ value, currency = 'USD' }: CurrencyTextProps) {
  return <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)}</span>
}
