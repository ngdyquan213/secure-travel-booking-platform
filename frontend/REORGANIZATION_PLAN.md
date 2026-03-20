# Frontend Reorganization Plan - Fix Lộn Xộn Structure

## Vấn Đề Hiện Tại

### 1. Duplicate/Conflicting Files
- `src/App.tsx` (cũ)
- `src/app/App.tsx` (mới - đây là file đúng)
- Routes ở 2 chỗ: `src/router/routes.tsx` và `src/app/router/*.routes.tsx`

### 2. Pages Không Được Tổ Chức
Hiện tại pages nằm lộn xộn:
- `src/pages/HomePage.tsx` (không có folder con)
- `src/pages/LoginPage.tsx`
- `src/pages/DashboardPage.tsx`

Cần tổ chức theo sections:
- `src/pages/public/HomePage.tsx`
- `src/pages/auth/LoginPage.tsx`
- `src/pages/account/DashboardPage.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/checkout/BookingPage.tsx`
- `src/pages/error/NotFoundPage.tsx`

### 3. Components Không Rõ Ràng
- Components ở `src/components/`
- UI components cần ở `src/components/ui/`
- Common components cần ở `src/components/common/`
- Form components cần ở `src/components/forms/`
- Navigation components cần ở `src/components/navigation/`

### 4. Features Không Có Cấu Trúc
Features được tạo ở `src/features/` nhưng thiếu components, schemas, types

### 5. Services Không Có
`src/services/` cần:
- `http/` folder
- `storage/` folder
- `query/` folder

## Solution: Complete Reorganization

### Step 1: Delete Old/Duplicate Files
- Remove `src/App.tsx` (cũ)
- Remove `src/router/routes.tsx` (cũ)
- Remove `src/stores/` (cũ, dùng providers thay)

### Step 2: Reorganize Pages (Phải Làm Ngay)
```
src/pages/
├── public/
│   ├── HomePage.tsx
│   ├── BlogListPage.tsx
│   ├── BlogDetailPage.tsx
│   ├── AboutPage.tsx
│   ├── ServicesPage.tsx
│   ├── ContactPage.tsx
│   ├── DestinationsPage.tsx
│   ├── PromotionsPage.tsx
│   └── HelpPage.tsx
├── auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── ResetPasswordPage.tsx
├── checkout/
│   ├── BookingPage.tsx
│   ├── TravelersPage.tsx
│   ├── PaymentPage.tsx
│   ├── ConfirmationPage.tsx
│   ├── PaymentSuccessPage.tsx
│   └── PaymentFailedPage.tsx
├── account/
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── EditProfilePage.tsx
│   ├── ChangePasswordPage.tsx
│   ├── BookingsPage.tsx
│   ├── BookingDetailPage.tsx
│   ├── TravelersPage.tsx
│   ├── DocumentsPage.tsx
│   ├── DocumentDetailPage.tsx
│   ├── WalletPage.tsx
│   ├── VouchersPage.tsx
│   ├── RefundsPage.tsx
│   ├── RefundDetailPage.tsx
│   ├── NotificationsPage.tsx
│   ├── SettingsPage.tsx
│   ├── SupportPage.tsx
│   └── PaymentHistoryPage.tsx
├── admin/
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   ├── BookingsPage.tsx
│   ├── ToursPage.tsx
│   ├── DocumentsPage.tsx
│   ├── PaymentsPage.tsx
│   ├── RefundsPage.tsx
│   ├── VouchersPage.tsx
│   ├── CouponsPage.tsx
│   ├── SchedulesPage.tsx
│   ├── PricingRulesPage.tsx
│   └── OperationsPage.tsx
└── error/
    ├── NotFoundPage.tsx
    ├── UnauthorizedPage.tsx
    ├── ForbiddenPage.tsx
    └── ServerErrorPage.tsx
```

### Step 3: Reorganize Components
```
src/components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Modal.tsx
│   ├── Alert.tsx
│   ├── Badge.tsx
│   ├── Spinner.tsx
│   ├── Toggle.tsx
│   ├── Table.tsx
│   ├── Pagination.tsx
│   ├── Tabs.tsx
│   └── index.ts (barrel export)
├── common/
│   ├── Avatar.tsx
│   ├── EmptyState.tsx
│   ├── Stepper.tsx
│   ├── SearchBar.tsx
│   ├── Breadcrumb.tsx
│   ├── PageHeader.tsx
│   ├── SectionHeader.tsx
│   ├── StatusBadge.tsx
│   └── index.ts
├── navigation/
│   ├── Navbar.tsx (mainHeader)
│   ├── Sidebar.tsx (mainSidebar)
│   ├── Footer.tsx
│   ├── Breadcrumb.tsx
│   └── index.ts
├── forms/
│   ├── FormField.tsx
│   ├── DatePicker.tsx
│   ├── FileUploadField.tsx
│   ├── DateRangeField.tsx
│   └── index.ts
├── ProtectedRoute.tsx
├── Header.tsx (nếu không dùng navigation/Navbar)
└── index.ts (barrel export)
```

### Step 4: Fix Routes
Routes phải:
- Import pages từ đúng vị trí `/pages/public/`, `/pages/auth/`, etc.
- Sử dụng guards đúng
- Layout được apply đúng

### Step 5: Reorganize Features
Mỗi feature phải có:
```
src/features/flights/
├── api.ts
├── hooks.ts
├── components/
│   ├── FlightCard.tsx
│   ├── FlightFilter.tsx
│   └── FlightForm.tsx
├── types.ts
├── schemas.ts
└── index.ts (barrel export)
```

### Step 6: Complete Services
```
src/services/
├── http.ts (HTTP client setup)
├── storage.ts (Token, user, theme storage)
└── query.ts (React Query config)
```

### Step 7: Complete Config & Constants
```
src/config/
├── app.ts
├── api.ts
├── routes.ts
├── constants.ts
├── theme.ts
└── env.ts

src/constants/
├── roles.ts
├── status.ts
├── payment.ts
├── upload.ts
└── queryKeys.ts
```

## Implementation Priority

**Phase 1: Critical (Phải làm ngay để app chạy được)**
- [ ] Delete duplicate files
- [ ] Reorganize pages vào đúng folders
- [ ] Fix routes imports
- [ ] Fix component imports

**Phase 2: High (Phải có để app hoàn chỉnh)**
- [ ] Reorganize components đúng folders
- [ ] Complete services layer
- [ ] Complete config & constants

**Phase 3: Medium (Cần có nhưng không urgent)**
- [ ] Reorganize features properly
- [ ] Add missing utilities
- [ ] Add missing hooks

**Phase 4: Low (Nice to have)**
- [ ] Add tests
- [ ] Add assets
- [ ] Add documentation

## Success Criteria

- [x] Không có duplicate files
- [x] Pages được tổ chức theo sections
- [x] Components được tổ chức theo type
- [x] Routes import từ đúng paths
- [x] All imports match actual file locations
- [x] App runs without import errors
- [x] Clear folder structure dễ navigate
