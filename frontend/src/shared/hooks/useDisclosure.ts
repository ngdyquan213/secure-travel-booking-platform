export function useDisclosure(initial = false) {
  return {
    isOpen: initial,
    open: () => undefined,
    close: () => undefined,
    toggle: () => undefined,
  }
}
