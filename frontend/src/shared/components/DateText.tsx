interface DateTextProps {
  value: string | number | Date
}

export function DateText({ value }: DateTextProps) {
  return <span>{new Date(value).toLocaleDateString()}</span>
}
