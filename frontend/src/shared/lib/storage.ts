const isBrowser = typeof window !== 'undefined'

export function getStoredItem(key: string): string | null {
  if (!isBrowser) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStoredItem(key: string, value: string): void {
  if (!isBrowser) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage write errors so the app can still render.
  }
}

export function removeStoredItem(key: string): void {
  if (!isBrowser) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage removal errors so the app can still render.
  }
}
