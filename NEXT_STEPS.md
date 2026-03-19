# Frontend Implementation - Next Steps & Action Plan

## Current Status Summary

✅ **COMPLETE (46 files)**
- App providers (5 files)
- Router with guards (8 files)
- Route configuration (43 routes)
- Previous components & features (25+ files)

⚠️ **TODO (136 files)**
- 5 Layouts
- 41 Pages
- 13 Feature modules completion
- 30+ Components
- Services layer
- Schemas & types
- Utilities & config

## Immediate Next Steps

### Step 1: Create All 5 Layouts (Priority 1)
**Files to create in `/src/layouts/`:**

1. `PublicLayout.tsx` - Standard page layout with header/footer
2. `AuthLayout.tsx` - Centered form layout for login/register
3. `CheckoutLayout.tsx` - Two-column: sidebar + checkout form
4. `AccountLayout.tsx` - Sidebar navigation + content area
5. `AdminLayout.tsx` - Dashboard layout with top nav + sidebar

**Dependency:** All pages need a layout. Create these first.

### Step 2: Create All 41 Pages (Priority 2)
**Use the page template in `GENERATION_TEMPLATES.md`**

**Public pages (7):**
```
/src/pages/public/
- HomePage.tsx
- ToursPage.tsx
- TourDetailPage.tsx
- TourSchedulesPage.tsx
- DestinationsPage.tsx
- PromotionsPage.tsx
- HelpPage.tsx
```

**Auth pages (4):**
```
/src/pages/auth/
- LoginPage.tsx
- RegisterPage.tsx
- ForgotPasswordPage.tsx
- ResetPasswordPage.tsx
```

**Checkout pages (4):**
```
/src/pages/checkout/
- CheckoutPage.tsx
- PaymentPage.tsx
- PaymentSuccessPage.tsx
- PaymentFailedPage.tsx
```

**Account pages (14):**
```
/src/pages/account/
- DashboardPage.tsx
- ProfilePage.tsx
- EditProfilePage.tsx
- ChangePasswordPage.tsx
- TravelersPage.tsx
- BookingsPage.tsx
- BookingDetailPage.tsx
- VouchersPage.tsx
- DocumentsPage.tsx
- DocumentDetailPage.tsx
- RefundRequestPage.tsx
- RefundDetailPage.tsx
- NotificationsPage.tsx
- SupportPage.tsx
```

**Admin pages (9):**
```
/src/pages/admin/
- AdminDashboardPage.tsx
- AdminToursPage.tsx
- AdminTourSchedulesPage.tsx
- AdminPricingRulesPage.tsx
- AdminBookingsPage.tsx
- AdminBookingDetailPage.tsx
- AdminRefundsPage.tsx
- AdminDocumentsPage.tsx
- AdminOperationsPage.tsx
```

**Error pages (3):**
```
/src/pages/errors/
- NotFoundPage.tsx
- ForbiddenPage.tsx
- ServerErrorPage.tsx
```

### Step 3: Complete Feature Modules (Priority 3)
**For each of 13 modules, ensure:**
- ✅ `api/[feature].api.ts` - API endpoints
- [ ] `components/` - Feature-specific components (2-4 per module)
- [ ] `hooks/` - Custom hooks (useFeature, useFeatureDetail, useFeatureActions)
- [ ] `schemas/` - Zod validation schemas
- [ ] `types.ts` - TypeScript interfaces
- [ ] `index.ts` - Barrel export

**13 modules to complete:**
1. auth, 2. users, 3. tours, 4. bookings, 5. travelers,
6. vouchers, 7. documents, 8. payments, 9. coupons,
10. refunds, 11. notifications, 12. support, 13. admin

### Step 4: Build Service Layer (Priority 4)
**Create in `/src/services/`:**

```typescript
// http/apiClient.ts
- Axios instance with baseURL
- Default headers
- Error handling

// http/authInterceptor.ts
- Token attachment to requests
- Token refresh logic
- 401 handling

// http/errorInterceptor.ts
- Error normalization
- User-friendly messages
- Logging

// storage/token.storage.ts
- getToken(), setToken(), removeToken()

// storage/user.storage.ts
- getUser(), setUser(), removeUser()

// storage/theme.storage.ts
- getTheme(), setTheme()

// query/queryClient.ts
- QueryClient configuration
- Default options

// query/queryKeys.ts
- Query key factory pattern
```

### Step 5: Create Types & Schemas (Priority 5)
**Create in `/src/schemas/` and `/src/types/`:**

```typescript
// schemas/
- auth.schema.ts
- user.schema.ts
- tour.schema.ts
- booking.schema.ts
- traveler.schema.ts
- document.schema.ts
- payment.schema.ts
- common.schema.ts
- pagination.schema.ts

// types/
- api.ts (API response types)
- common.ts (Common types)
- pagination.ts (Pagination types)
- env.d.ts (Environment types)
```

### Step 6: Add Utilities & Config (Priority 6)
**Create in `/src/utils/` and `/src/config/`:**

```typescript
// utils/
- formatCurrency.ts (Price formatting)
- formatDate.ts (Date/time formatting)
- downloadFile.ts (File download)
- buildQueryString.ts (Query building)
- normalizeApiError.ts (Error normalization)
- mapApiResponse.ts (Response mapping)
- guards.ts (Permission checks)
- cn.ts (Tailwind class merging)

// config/
- env.ts (Environment loader)
- appConfig.ts (App configuration)
- navigation.ts (Navigation structure)

// constants/
- routes.ts (Route paths)
- roles.ts (User roles)
- status.ts (Status constants)
- payment.ts (Payment constants)
- upload.ts (Upload limits)
- queryKeys.ts (Query keys)
```

### Step 7: Setup Styling & Assets (Priority 7)
**Create in `/src/styles/` and `/src/assets/`:**

```css
/* styles/globals.css */
- Global resets
- Base typography
- Utility classes

/* styles/theme.css */
- Theme variables
- Color palette
- Spacing system

/* styles/variables.css */
- CSS custom properties
- Dark mode variables
```

**Assets folders:**
- `/src/assets/images/` - Images
- `/src/assets/icons/` - SVG icons
- `/src/assets/illustrations/` - Illustrations

### Step 8: Test Infrastructure (Priority 8)
**Setup in `/src/tests/`:**

```typescript
// setup.ts
- Vitest configuration
- Mock setup
- Global test utilities

// fixtures/
- Mock data
- Fake API responses

// mocks/
- Mock services
- Mock handlers
- API mocks

// utils/
- Test helpers
- Custom matchers
- Test utilities
```

## Files Checklist

Use this checklist to track implementation:

### Layouts (5 files)
- [ ] PublicLayout.tsx
- [ ] AuthLayout.tsx
- [ ] CheckoutLayout.tsx
- [ ] AccountLayout.tsx
- [ ] AdminLayout.tsx

### Pages (41 files)
- [ ] Public (7 files)
- [ ] Auth (4 files)
- [ ] Checkout (4 files)
- [ ] Account (14 files)
- [ ] Admin (9 files)
- [ ] Errors (3 files)

### Features (60+ files)
- [ ] auth module
- [ ] users module
- [ ] tours module
- [ ] bookings module
- [ ] travelers module
- [ ] vouchers module
- [ ] documents module
- [ ] payments module
- [ ] coupons module
- [ ] refunds module
- [ ] notifications module
- [ ] support module
- [ ] admin module

### Services (6 files)
- [ ] apiClient.ts
- [ ] authInterceptor.ts
- [ ] errorInterceptor.ts
- [ ] token.storage.ts
- [ ] user.storage.ts
- [ ] theme.storage.ts

### Configuration (20+ files)
- [ ] Schemas (9 files)
- [ ] Types (4 files)
- [ ] Constants (6 files)
- [ ] Utils (8 files)
- [ ] Config (3 files)
- [ ] Styles (3 files)

### Other
- [ ] Test setup (4+ files)
- [ ] Assets (3 folders)
- [ ] Root config files (.env, .eslintrc, etc)

## Estimated Timeline

| Phase | Files | Hours | Notes |
|-------|-------|-------|-------|
| Layouts | 5 | 1 | Quick, template-based |
| Pages | 41 | 6 | Use template, focus structure |
| Features | 60 | 8 | Bulk of work, complex logic |
| Services | 6 | 2 | HTTP, storage, query clients |
| Config | 20 | 3 | Types, schemas, constants |
| Styles & Tests | 10 | 2 | Global styles, test setup |
| **Total** | **142** | **22** | ~3 days full-time dev |

## Quality Checkpoints

After each phase, verify:
- [ ] No TypeScript errors
- [ ] All imports resolved
- [ ] Consistent naming conventions
- [ ] Proper folder structure
- [ ] Documentation present
- [ ] Code follows established patterns

## Next Immediate Action

**START HERE:** Create the 5 layout files in `/src/layouts/` using the layout template in `GENERATION_TEMPLATES.md`. These are foundational and required for all pages.

## Notes

- All template code is in `GENERATION_TEMPLATES.md`
- Complete structure is in `COMPLETE_STRUCTURE_REVIEW.md`
- Use established patterns from already-created files
- Follow TypeScript conventions
- Add proper error handling
- Include loading states
- Add form validation
- Document complex logic
