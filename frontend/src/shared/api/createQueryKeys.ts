export function createQueryKeys(scope: string) {
  return {
    all: [scope] as const,
    list: (params?: unknown) => [scope, 'list', params] as const,
    detail: (id: string | number) => [scope, 'detail', id] as const,
  }
}
