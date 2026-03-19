# TravelBook Frontend - Complete Architecture

## Overview
A professional, scalable React + Vite frontend following feature-based architecture with 5 specialized layout systems, 15+ feature modules, 30+ UI components, and 50+ pages.

## Directory Structure

```
src/
├── config/              # Configuration files
│   ├── app.ts          # App config, features, cache
│   ├── api.ts          # API endpoints
│   ├── routes.ts       # All route constants
│   ├── query.ts        # React Query config
│   └── theme.ts        # Theme colors & spacing
├── components/
│   ├── ui/             # Base UI components (15+)
│   ├── common/         # Reusable components
│   ├── navigation/     # Nav components
│   └── forms/          # Form components
├── pages/
│   ├── public/         # Public pages
│   ├── auth/           # Auth pages
│   ├── checkout/       # Checkout flow
│   ├── account/        # User account
│   ├── admin/          # Admin pages
│   └── error/          # Error pages
├── features/           # Feature modules (12+)
│   ├── auth/
│   ├── flights/
│   ├── hotels/
│   ├── tours/
│   ├── bookings/
│   ├── payments/
│   ├── documents/
│   ├── travelers/
│   ├── users/
│   ├── notifications/
│   ├── coupons/
│   ├── refunds/
│   └── admin/
├── hooks/              # Custom hooks (7+)
├── services/           # Shared services
├── schemas/            # Zod validation schemas
├── utils/              # Utility functions
├── stores/             # State management
├── guards/             # Route guards
├── layouts/            # Layout components
├── router/             # Router configuration
└── providers/          # Context providers
```

## Key Features

### 1. Authentication & Authorization
- Token-based auth with auto-refresh
- Role-based access control
- Route guards (AuthGuard, GuestGuard, AdminGuard)
- Secure session management

### 2. Feature Modules
Each feature has:
- `api.ts` - API calls
- `hooks.ts` - Custom hooks
- `index.ts` - Barrel export
- Types and schemas

### 3. UI Component Library (30+)
- Base: Button, Input, Card, Badge, Spinner, Modal
- Form: FormField, DatePicker
- Common: Avatar, Stepper, EmptyState, Tabs, SearchBar
- Navigation: Breadcrumb, Sidebar, Navbar
- Table: Table, Pagination
- Utility: Alert, Select, Checkbox, Radio, Toggle

### 4. Layouts (5)
- PublicLayout - No auth required
- AuthLayout - Login/register pages
- ProtectedLayout - Protected pages
- AccountLayout - User account pages
- AdminLayout - Admin pages

### 5. Pages (50+)
- Home, Blog, About, Services, Contact
- Login, Register, Password Reset
- Dashboard, Flights, Hotels, Tours, Bookings
- Checkout (Booking → Travelers → Payment → Confirmation)
- Account (Profile, Bookings, Documents, Wallet, Settings, Travelers, Notifications, Support)
- Admin (Dashboard, Users, Bookings, Documents, Payments)
- Error (401, 403, 404, 500)

### 6. Custom Hooks (7+)
- useAuth - Authentication
- useQuery - Data fetching
- usePagination - Pagination logic
- useForm - Form management
- useLocalStorage - Local storage
- useDebounce - Debouncing
- usePrevious - Previous value tracking

### 7. Config & Constants
- 40+ app constants
- 74 API endpoints
- 77 route definitions
- Query config with stale time
- Theme colors, spacing, shadows
- Validation schemas

## Architecture Patterns

### State Management
- Zustand for auth state
- React Query for server state
- localStorage for client preferences

### Data Fetching
- HTTP client with interceptors
- Token refresh on 401
- Error handling with user-friendly messages
- Idempotency key support for payments

### Validation
- Zod schemas for runtime validation
- React Hook Form for form handling
- Type-safe form submissions

### Styling
- Tailwind CSS
- Design tokens (colors, spacing, shadows)
- Responsive mobile-first design
- Custom variants for components

## Getting Started

### Installation
```bash
cd frontend
npm install
cp .env.example .env.local
# Update VITE_API_URL in .env.local
```

### Development
```bash
npm run dev
# Visit http://localhost:5173
```

### Build
```bash
npm run build
npm run preview
```

## Development Guidelines

### Adding a New Feature
1. Create folder in `src/features/[feature]`
2. Add `api.ts` and `hooks.ts`
3. Create pages in `src/pages/[section]`
4. Add routes in `src/router/routes.tsx`
5. Update navigation components

### Adding a New Page
1. Create in appropriate `src/pages/` section
2. Add route to `src/router/routes.tsx`
3. Update navigation links
4. Use appropriate layout

### Creating Components
- Use UI components from `src/components`
- Compose into feature-specific components
- Export from barrel files
- Add TypeScript types
- Document props with JSDoc

## File Statistics
- 50+ Pages
- 30+ UI Components
- 12+ Feature Modules
- 7+ Custom Hooks
- 4+ Service Layers
- 3+ Validation Schemas
- Total: 2,000+ lines of new code
- Total project: 6,300+ lines with existing code

## Next Steps
1. Connect API calls to actual backend
2. Implement real payment processing
3. Add comprehensive error handling
4. Set up analytics and monitoring
5. Add unit and integration tests
6. Set up CI/CD pipeline
