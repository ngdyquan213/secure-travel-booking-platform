# Frontend Architecture

This document describes the professional, feature-based architecture of the TravelBook frontend application.

## Directory Structure

```
frontend/src/
├── config/              # Application configuration
│   ├── constants.ts     # Global constants, routes, feature flags
│   └── ...
├── services/            # Core services
│   ├── http.ts          # HTTP client with interceptors
│   ├── storage.ts       # Local storage management
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useQuery.ts      # Data fetching hooks
│   └── ...
├── guards/              # Route guards
│   └── index.ts         # AuthGuard, GuestGuard, AdminGuard, usePermission
├── providers/           # App providers (Auth, Query, Theme, Toast)
│   └── index.tsx        # Centralized providers
├── layouts/             # Page layouts
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   ├── ProtectedLayout.tsx
│   ├── AccountLayout.tsx
│   └── AdminLayout.tsx
├── router/              # Route configuration
│   └── routes.tsx       # Centralized route definitions
├── pages/               # Page components (organized by section)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── account/         # Account-related pages
│   │   ├── ProfilePage.tsx
│   │   ├── BookingsPage.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── WalletPage.tsx
│   │   └── SettingsPage.tsx
│   ├── admin/           # Admin pages
│   │   ├── UsersPage.tsx
│   │   └── AdminBookingsPage.tsx
│   └── ...
├── features/            # Feature modules (domain-driven)
│   ├── auth/
│   │   ├── api.ts       # API calls
│   │   └── index.ts     # Barrel export
│   ├── flights/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── hotels/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── tours/
│   ├── bookings/
│   ├── payments/
│   ├── documents/
│   └── ...
├── components/          # Shared UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── types/               # TypeScript types
│   └── api.ts           # API response/request types
├── utils/               # Utility functions
│   ├── helpers.ts
│   └── ...
└── App.tsx              # Root component
```

## Key Design Patterns

### 1. Feature-Based Organization
Each major feature (flights, hotels, bookings, etc.) is a self-contained module:
- `api.ts` - API calls specific to that feature
- `hooks.ts` - Custom React hooks for data fetching and mutations
- `index.ts` - Barrel exports for clean imports

Example:
```typescript
// Import from feature
import { useSearchFlights, flightsApi } from '@/features/flights'

// Or import specific items
import { useFlightById } from '@/features/flights/hooks'
```

### 2. Layout-Based Routing
Different layouts for different sections:
- **PublicLayout** - Home, Blog, About, Services, Contact
- **AuthLayout** - Login, Register (centered, minimal)
- **ProtectedLayout** - Authenticated user pages with Header/Footer
- **AccountLayout** - User profile, bookings, documents (with sidebar)
- **AdminLayout** - Admin dashboard (with admin sidebar)

### 3. Service Layer
- **HttpClient** - Centralized HTTP communication with interceptors
- **StorageService** - Consistent localStorage management
- **AuthHook** - Centralized authentication state management

### 4. Route Guards
Custom hooks prevent unauthorized access:
```typescript
useAuthGuard()        // Check if authenticated
useGuestGuard()       // Check if NOT authenticated
useAdminGuard()       // Check if admin
usePermission(role)   // Check specific permission
```

### 5. Query Hooks
Custom hooks for data fetching with consistent error handling:
```typescript
// For reads (queries)
const { data, isLoading, error } = useQuery('/endpoint')

// For mutations (POST, PUT, DELETE)
const [{ data, isLoading }, execute] = useMutation(fn)
```

## Constants & Configuration

All magic strings are defined in `config/constants.ts`:
- Routes (`ROUTES.PUBLIC`, `ROUTES.PROTECTED`, etc.)
- Feature flags (`FEATURES.ENABLE_TOURS`, etc.)
- Validation rules (`VALIDATION.PASSWORD_MIN_LENGTH`, etc.)
- Booking types and statuses

Usage:
```typescript
import { ROUTES, BOOKING_STATUS } from '@/config/constants'
```

## Type Safety

All API types are centralized in `types/api.ts`:
- Request/Response types
- Entity types (User, Flight, Hotel, etc.)
- Error types

## How to Add a New Feature

1. **Create feature folder**: `src/features/newFeature/`
2. **Create API file**: `api.ts` with API calls
3. **Create hooks file**: `hooks.ts` with custom React hooks
4. **Export barrel**: `index.ts` with exports
5. **Use in pages**: Import from `@/features/newFeature`

Example:
```typescript
// src/features/coupons/api.ts
export const couponsApi = {
  getAvailableCoupons: async () => { ... },
  applyCoupon: async (code: string) => { ... },
}

// src/features/coupons/hooks.ts
export function useAvailableCoupons() {
  return useQuery('/coupons')
}

// src/features/coupons/index.ts
export * from './api'
export * from './hooks'

// src/pages/CheckoutPage.tsx
import { useAvailableCoupons } from '@/features/coupons'
```

## Security

- **Token Management**: Handled by StorageService and HttpClient
- **Protected Routes**: Checked by layout guards
- **CSRF Protection**: Idempotency keys for payments
- **HTTP Interceptors**: Auto token refresh on 401

## Performance

- **Code Splitting**: Routes are naturally separated
- **Query Hooks**: Built-in caching potential (can be upgraded to React Query)
- **Component Lazy Loading**: Ready to implement with React.lazy()

## Testing

Ready for:
- Unit tests for utility functions and hooks
- Integration tests for features
- E2E tests for user flows
