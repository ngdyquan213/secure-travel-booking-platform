export function normalizeApiError(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}
