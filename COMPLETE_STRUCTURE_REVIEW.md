# Complete Frontend Structure Review & Implementation Guide

## Current Implementation Status

### Phase 1: App Infrastructure & Providers ✅
- **Location:** `/src/app/providers/`
- **Created Files:**
  - AppProvider.tsx - Main provider wrapper
  - AuthProvider.tsx - Authentication context
  - QueryProvider.tsx - React Query setup
  - ThemeProvider.tsx - Theme management
  - ToastProvider.tsx - Toast notifications
  - **Status:** COMPLETE

### Phase 2: Router & Guards ✅
- **Location:** `/src/app/router/`
- **Created Files:**
  - `guards/AuthGuard.tsx` - Protected routes
  - `guards/GuestGuard.tsx` - Public auth routes
  - `guards/AdminGuard.tsx` - Admin routes
  - `public.routes.tsx` - Public page routes (7 routes)
  - `auth.routes.tsx` - Auth page routes (4 routes)
  - `checkout.routes.tsx` - Checkout flow (4 routes)
  - `account.routes.tsx` - Account/user routes (14 routes)
  - `admin.routes.tsx` - Admin routes (9 routes) + error routes
  - **Status:** COMPLETE (43 total routes)

### Phase 3: Layouts ⚠️ TODO
- **Location:** `/src/layouts/`
- **Required Files (5):**
  - `PublicLayout.tsx` - Header + Footer
  - `AuthLayout.tsx` - Centered auth form
  - `CheckoutLayout.tsx` - Checkout sidebar
  - `AccountLayout.tsx` - Account sidebar nav
  - `AdminLayout.tsx` - Admin sidebar + top nav

### Phase 4: Pages ⚠️ TODO
- **Location:** `/src/pages/`
- **Public Pages (7):** HomePage, ToursPage, TourDetailPage, TourSchedulesPage, DestinationsPage, PromotionsPage, HelpPage
- **Auth Pages (4):** LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
- **Checkout Pages (4):** CheckoutPage, PaymentPage, PaymentSuccessPage, PaymentFailedPage
- **Account Pages (14):** DashboardPage, ProfilePage, EditProfilePage, ChangePasswordPage, TravelersPage, BookingsPage, BookingDetailPage, VouchersPage, DocumentsPage, DocumentDetailPage, RefundRequestPage, RefundDetailPage, NotificationsPage, SupportPage
- **Admin Pages (9):** AdminDashboardPage, AdminToursPage, AdminTourSchedulesPage, AdminPricingRulesPage, AdminBookingsPage, AdminBookingDetailPage, AdminRefundsPage, AdminDocumentsPage, AdminOperationsPage
- **Error Pages (3):** NotFoundPage, ForbiddenPage, ServerErrorPage
- **Total:** 41 pages required

### Phase 5: Features Modules ⚠️ PARTIAL
- **Location:** `/src/features/`
- **Required Modules (11):**

1. **auth** - Authentication
   - api/auth.api.ts
   - components/ (LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm)
   - hooks/ (useAuth, useLogin, useRegister, useLogout)
   - store/auth.store.ts
   - schemas/auth.schema.ts
   - types.ts, index.ts

2. **users** - User management
   - api/users.api.ts
   - components/ (ProfileCard, ProfileForm, ChangePasswordForm)
   - hooks/ (useProfile, useUpdateProfile)
   - schemas/user.schema.ts
   - types.ts, index.ts

3. **tours** - Tours listing & details
   - api/tours.api.ts
   - components/ (TourCard, TourSearchFilters, TourScheduleList, TourPriceBox, DestinationSection)
   - hooks/ (useTours, useTourDetail, useTourSchedules)
   - schemas/tour.schema.ts
   - types.ts, index.ts

4. **bookings** - Booking management
   - api/bookings.api.ts
   - components/ (BookingCard, BookingStatusBadge, BookingSummary, CheckoutPanel, BookingActions)
   - hooks/ (useBookings, useBookingDetail, useCreateBooking)
   - schemas/booking.schema.ts
   - types.ts, index.ts

5. **travelers** - Traveler profiles
   - api/travelers.api.ts
   - components/ (TravelerList, TravelerForm)
   - hooks/ (useTravelers, useTravelerActions)
   - schemas/traveler.schema.ts
   - types.ts, index.ts

6. **vouchers** - Voucher management
   - api/vouchers.api.ts
   - components/ (VoucherViewer, VoucherDownloadButton)
   - hooks/ (useVouchers)
   - types.ts, index.ts

7. **documents** - Document uploads
   - api/documents.api.ts
   - components/ (DocumentUploadPanel, DocumentList, DocumentCard, VerificationStatus)
   - hooks/ (useDocuments, useUploadDocument)
   - schemas/document.schema.ts
   - types.ts, index.ts

8. **payments** - Payment processing
   - api/payments.api.ts
   - components/ (PaymentMethodSelector, PaymentSummary, PaymentStatusPanel)
   - hooks/ (usePayments, usePaymentStatus)
   - schemas/payment.schema.ts
   - types.ts, index.ts

9. **coupons** - Coupon/discount codes
   - api/coupons.api.ts
   - components/ (CouponInput)
   - hooks/ (useCoupons)
   - types.ts, index.ts

10. **refunds** - Refund processing
    - api/refunds.api.ts
    - components/ (RefundRequestForm, RefundTimeline)
    - hooks/ (useRefunds, useRefundDetail)
    - types.ts, index.ts

11. **notifications** - Notifications
    - api/notifications.api.ts
    - hooks/ (useNotifications)
    - types.ts, index.ts

12. **support** - Support tickets
    - api/support.api.ts
    - components/ (TicketList, TicketForm)
    - hooks/ (useSupportTickets)
    - types.ts, index.ts

13. **admin** - Admin features (nested structure)
    - dashboard/, tours/, bookings/, refunds/, documents/, pricing/, operations/
    - index.ts

### Phase 6: Components Library ⚠️ PARTIAL
- **Location:** `/src/components/`
- **UI Components (15):** Button, Input, Select, Textarea, Checkbox, Radio, Modal, Drawer, Tabs, Table, Pagination, Badge, Card, Skeleton, EmptyState, Alert, Tooltip, ConfirmDialog
- **Common Components (8):** PageHeader, SectionHeader, SearchBar, FilterPanel, StatusBadge, CurrencyText, DateText, ProtectedBlock, ErrorFallback
- **Navigation (5):** MainHeader, MainFooter, UserSidebar, AdminSidebar, Breadcrumbs
- **Form Components (4):** FormField, FileUploadField, DateRangeField, QuantityField

### Phase 7: Services ⚠️ TODO
- **Location:** `/src/services/`
- **HTTP Services:** apiClient.ts, authInterceptor.ts, errorInterceptor.ts
- **Storage Services:** token.storage.ts, user.storage.ts, theme.storage.ts
- **Query Services:** queryClient.ts, queryKeys.ts

### Phase 8: Hooks ⚠️ PARTIAL
- **Location:** `/src/hooks/`
- **Hooks (6+):** useDebounce, usePagination, useQueryParams, useFileUpload, useConfirm, useDisclosure, useLocalStorage

### Phase 9: Schemas & Validation ⚠️ TODO
- **Location:** `/src/schemas/`
- **Common:** common.schema.ts, pagination.schema.ts

### Phase 10: Types ⚠️ TODO
- **Location:** `/src/types/`
- **Files:** api.ts, common.ts, pagination.ts, env.d.ts

### Phase 11: Constants ⚠️ TODO
- **Location:** `/src/constants/`
- **Files:** routes.ts, roles.ts, status.ts, payment.ts, upload.ts, queryKeys.ts

### Phase 12: Utilities ⚠️ TODO
- **Location:** `/src/utils/`
- **Files:** formatCurrency.ts, formatDate.ts, downloadFile.ts, buildQueryString.ts, normalizeApiError.ts, mapApiResponse.ts, guards.ts

### Phase 13: Config ⚠️ TODO
- **Location:** `/src/config/`
- **Files:** env.ts, appConfig.ts, navigation.ts

### Phase 14: Styles ⚠️ TODO
- **Location:** `/src/styles/`
- **Files:** globals.css, theme.css, variables.css

### Phase 15: Assets ⚠️ TODO
- **Location:** `/src/assets/`
- **Folders:** images/, icons/, illustrations/

### Phase 16: Tests ⚠️ TODO
- **Location:** `/src/tests/`
- **Folders:** fixtures/, mocks/, utils/
- **Setup:** setup.ts

## Summary of Current Status

✅ **COMPLETE (120+ lines created):**
- 5 Providers in `/src/app/providers/`
- App.tsx & main.tsx in `/src/app/`
- 5 Route files with 43 total routes in `/src/app/router/`
- 3 Guards in `/src/app/router/guards/`

⚠️ **TODO (2,500+ lines needed):**
- 5 Layouts
- 41 Pages
- 13 Feature modules with components, hooks, APIs
- 30+ Components
- 6+ Services
- Schemas, Types, Constants, Utils, Config, Styles, Assets, Tests

## Next Steps

1. **Create all 5 Layouts** → All page routes depend on these
2. **Create all 41 Pages** → Each should be ~30-100 lines
3. **Create Feature Modules** → API + Components + Hooks for each feature
4. **Build Component Library** → Reusable components for all pages
5. **Setup Services** → HTTP client, storage, query management
6. **Add Schemas & Validation** → Form validation and API schemas
7. **Create Types & Constants** → Type definitions and constants
8. **Create Utils** → Helper functions for common tasks
9. **Setup Config** → Environment, app config, navigation
10. **Add Styles & Assets** → Global styles, images, icons
11. **Setup Tests** → Test structure and utilities

## Estimated Token Cost
- Pages: ~1,500 lines (3,000 tokens)
- Layouts: ~350 lines (700 tokens)
- Features: ~3,500 lines (7,000 tokens)
- Components: ~1,500 lines (3,000 tokens)
- Services: ~500 lines (1,000 tokens)
- Others: ~1,000 lines (2,000 tokens)
- **Total: ~8,000+ lines (16,000+ tokens)**

Due to token constraints, recommend implementing in sections and using this checklist for guidance.
