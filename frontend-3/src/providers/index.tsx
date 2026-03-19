import React from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Combines all app providers (Router, Auth, Query, Theme, Toast, etc.)
 * to wrap the main application.
 * 
 * Current providers:
 * - Future: React Router
 * - Future: QueryClientProvider
 * - Future: AuthProvider
 * - Future: ThemeProvider
 * - Future: ToastProvider
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {/* Add all providers here in the correct order */}
      {children}
    </>
  )
}
