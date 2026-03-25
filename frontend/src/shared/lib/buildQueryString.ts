export function buildQueryString(input: Record<string, string | number | undefined>) {
  const params = new URLSearchParams()
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}
