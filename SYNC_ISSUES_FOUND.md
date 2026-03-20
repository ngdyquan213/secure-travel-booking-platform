# Frontend Sync Issues - Chi Tiết

## 🔴 CRITICAL ISSUES (App sẽ crash)

### Issue 1: App.tsx Entry Point Path Conflict
**Vị trí file thực tế:** `/frontend/src/app/App.tsx`
**Vị trí file cũ:** `/frontend/src/App.tsx`
**Routes đang tìm:** `./App` từ main.tsx

**Problem:**
- `main.tsx` import: `import App from './App'` (looking for `/app/App.tsx`)
- App.tsx nằm ở `/app/App.tsx` ✓ OK
- Nhưng cũng có file cũ `/App.tsx` nằm ngoài `/app/` ✗ CONFLICT

**Solution needed:** Xóa file cũ `/frontend/src/App.tsx`

---

### Issue 2: Page Paths Not Matching Routes
**Routes tìm pages ở:**
- `/pages/public/HomePage`
- `/pages/public/ToursPage`
- `/pages/auth/LoginPage`
- etc.

**Pages thực tế nằm ở:**
- `/pages/HomePage` (không có `/public/` subfolder)
- `/pages/LoginPage` (không có `/auth/` subfolder)
- `/pages/FlightsPage`, `/pages/HotelsPage` (nằm root pages)

**Routes broken:**
```
❌ public.routes.tsx → 7 pages sẽ fail import
❌ auth.routes.tsx → 4 pages sẽ fail import
❌ checkout.routes.tsx → pages sẽ fail import
❌ account.routes.tsx → pages sẽ fail import
❌ admin.routes.tsx → pages sẽ fail import
```

**Solution needed:** Reorganize pages vào đúng subfolder hoặc fix routes

---

### Issue 3: Provider Structure Mismatch
**AppProvider.tsx hiện tại:**
```tsx
export function AppProvider({ children }: AppProviderProps)
```

**main.tsx sử dụng:**
```tsx
import { AppProvider } from './providers/AppProvider'
<AppProvider>
  <App />
</AppProvider>
```

**Problem:** Đúng, nhưng import path cần kiểm tra - main.tsx nằm ở `/app/main.tsx`

**Status:** ✓ OK (relative path được)

---

### Issue 4: Routes Not Exported Properly
**App.tsx dùng:**
```tsx
import { publicRoutes } from './router/public.routes'
export const publicRoutes: RouteObject[]
```

**Problem:** publicRoutes là RouteObject[] nhưng App.tsx đang render nó như:
```tsx
<Routes>
  {publicRoutes}
  {authRoutes}
</Routes>
```

**Issue:** `<Routes>` chỉ chấp nhận `<Route>` elements, không phải arrays!

**Solution needed:** Convert routes thành `<Route>` elements hoặc dùng route mapping

---

## 🟠 HIGH PRIORITY ISSUES

### Issue 5: Missing Page Files (Referenced nhưng không tồn tại)
**Routes reference nhưng pages thiếu:**

Auth Pages:
- ❌ `ForgotPasswordPage`
- ❌ `ResetPasswordPage`

Public Pages:
- ❌ `DestinationsPage`
- ❌ `PromotionsPage`
- ❌ `HelpPage`
- ❌ `TourSchedulesPage`

Checkout Pages:
- ❌ All 4 checkout pages

Account Pages:
- ❌ All 14 account pages

Admin Pages:
- ❌ All 9 admin pages

**Impact:** App sẽ crash với import errors

---

### Issue 6: Layout Imports in Routes
**Routes import layouts từ:**
```tsx
import PublicLayout from '../../layouts/PublicLayout'
```

**Need to verify:** 
- Layouts exist ở đúng vị trí ✓
- Layouts export default ✓

---

### Issue 7: Guards Not Properly Integrated
**Routes dùng:**
```tsx
import { GuestGuard } from './guards/GuestGuard'
```

**Files tồn tại:**
- ✓ `/app/router/guards/AuthGuard.tsx`
- ✓ `/app/router/guards/GuestGuard.tsx`
- ✓ `/app/router/guards/AdminGuard.tsx`

**But:** AuthGuard/AdminGuard không được dùng trong routes hiện tại

---

## 🟡 MEDIUM PRIORITY

### Issue 8: Missing Service Layer
Routes/Pages cần services nhưng không tồn tại:
- ❌ `/services/http.ts` (API client)
- ❌ `/services/storage.ts` (token storage)
- ❌ `/config/api.ts` (endpoints)

---

### Issue 9: Missing Type Definitions
- ❌ `/types/api.ts`
- ❌ `/types/common.ts`
- ❌ `/types/env.d.ts`

---

## Summary

| Issue | Severity | Fix Time | Impact |
|-------|----------|----------|--------|
| Old App.tsx file | 🔴 CRITICAL | 2 min | Build conflict |
| Page path mismatch | 🔴 CRITICAL | 30 min | All routes fail |
| Routes format wrong | 🔴 CRITICAL | 20 min | App crashes |
| Missing 30+ pages | 🟠 HIGH | 2 hours | Route errors |
| Missing services | 🟠 HIGH | 1 hour | API calls fail |
| Missing guards usage | 🟡 MEDIUM | 30 min | No protection |
| Missing types | 🟡 MEDIUM | 20 min | Type errors |

**Total to fix frontend:** ~4-5 hours

**Current state:** ~40% Ready (infrastructure OK, pages/services missing)
