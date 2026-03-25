# Frontend Deploy-Ready Prompts

Use this file after the TravelBook visual system is already locked.

This file is not a Stitch prompt pack.
It is a coding/integration prompt pack for finishing the remaining frontend implementation work so the frontend can connect to backend services and be deployed.

## What This File Covers

These prompts are for the parts that design prompts do not finish:

- API wiring
- auth lifecycle
- route guards and providers
- backend contract alignment
- loading/error/empty handling with real data
- account and admin data flows
- checkout and payment flow wiring
- production env and build readiness
- integration and e2e confidence

Use these prompts with a coding agent, not a visual generation tool.

## Current Assumption

The TravelBook UI system is already visually approved:

- public, auth, checkout, account, admin, and error pages are already designed
- shared navigation, forms, status feedback, overlays, and component families are already visually locked
- the remaining work is implementation, integration, hardening, and deploy readiness

## Suggested Order

Run these in order:

1. Prompt A - Frontend Implementation Audit
2. Prompt B - API Client And Contract Alignment
3. Prompt C - Auth, Session, And Route Guard Hardening
4. Prompt D - Public Discovery Flow Wiring
5. Prompt E - Checkout And Payment Wiring
6. Prompt F - Account Area Data Integration
7. Prompt G - Admin Area Data Integration
8. Prompt H - Shared State, Feedback, And Error Handling
9. Prompt I - Test And Build Hardening
10. Prompt J - Final Deploy Readiness Review

---

## Prompt A - Frontend Implementation Audit

```text
Audit the current TravelBook frontend implementation and identify what is still missing before the frontend can be safely connected to the backend and deployed.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- app bootstrap, layouts, providers, router, and guards
- feature APIs, hooks, schemas, types, and query keys
- route pages and their section/component composition
- shared api, shared ui, navigation, and error handling
- environment config and runtime assumptions

Deliverables:
1. a short architecture status summary
2. a list of blockers by severity
3. a folder-by-folder gap list
4. the smallest safe implementation order

Rules:
- do not redesign the UI
- do not rewrite the architecture unless necessary
- prioritize missing backend wiring, missing data flow, and production blockers
- be specific about file paths
```

---

## Prompt B - API Client And Contract Alignment

```text
Implement and harden the frontend-backend API contract layer for TravelBook.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on these folders:
- src/shared/api
- src/features/*/api
- src/features/*/model
- src/shared/types
- src/shared/schemas

Tasks:
- verify base API client configuration
- align feature API modules with backend routes and payload shapes
- normalize response and error handling
- fix or add missing query key factories where needed
- make sure schemas and types match actual backend contracts
- remove stale mock assumptions from production paths

Deliverables:
1. implemented API contract fixes
2. a short mismatch report for any unresolved backend dependencies
3. notes on any endpoints that still require backend changes

Rules:
- do not change visual styling
- prefer incremental fixes over large rewrites
- keep feature boundaries intact
- clearly separate solved issues from backend blockers
```

---

## Prompt C - Auth, Session, And Route Guard Hardening

```text
Harden TravelBook authentication, session handling, and route protection for production use.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on these files and folders:
- src/app/providers
- src/app/router
- src/app/store
- src/features/auth
- src/shared/storage
- src/shared/api/authInterceptor.ts
- src/shared/components/ProtectedRoute.tsx

Tasks:
- verify login, logout, initialization, and session restore flow
- verify token persistence and refresh behavior
- verify guest-only, auth-only, and admin-only guards
- fix redirect loops and incorrect fallback navigation
- ensure expired sessions fail safely and predictably
- confirm protected routes behave correctly on reload

Deliverables:
1. implemented auth and guard fixes
2. a short list of edge cases covered
3. any backend auth assumptions still required

Rules:
- preserve the current app structure
- do not add unnecessary global state
- keep auth behavior predictable and debuggable
- prefer explicit failure handling over silent fallback
```

---

## Prompt D - Public Discovery Flow Wiring

```text
Connect the TravelBook public discovery experience to real data and production-safe state handling.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- src/pages/public
- src/sections/home
- src/sections/tours
- src/features/tours
- src/shared/components/SearchBar.tsx
- src/shared/components/FilterPanel.tsx

Tasks:
- wire tours, destinations, schedules, and promotions pages to real hooks and api modules
- connect search, filter, sort, date range, and quantity inputs to query state
- implement loading, empty, error, and retry behavior with real data
- verify detail and schedule pages receive correct route params
- remove hardcoded placeholder data from public discovery flows

Deliverables:
1. implemented public discovery data flow
2. a short list of remaining backend data gaps
3. notes on route params and query param behavior

Rules:
- do not redesign public pages
- preserve the existing component hierarchy
- keep query state understandable and shareable by URL when appropriate
- prioritize tours and schedules first if time is limited
```

---

## Prompt E - Checkout And Payment Wiring

```text
Implement and harden the TravelBook checkout and payment flow for real backend integration.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- src/pages/checkout
- src/sections/checkout
- src/features/bookings
- src/features/payments
- src/shared/constants/payment.ts

Tasks:
- connect checkout review, traveler info, payment submission, and payment status flows
- verify idempotent payment initiation and retry-safe behavior
- wire success, failure, and processing states to real backend responses
- ensure payment errors surface clearly without breaking navigation
- confirm booking summary and total calculations match backend expectations

Deliverables:
1. implemented checkout/payment integration
2. a short list of high-risk payment edge cases
3. unresolved backend/payment-provider assumptions if any

Rules:
- preserve the existing checkout UI
- do not fake payment success states
- prefer explicit state transitions over implicit magic
- keep failure recovery safe and calm
```

---

## Prompt F - Account Area Data Integration

```text
Complete the TravelBook account area implementation using real backend data and stable UX states.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- src/pages/account
- src/sections/account
- src/features/profile
- src/features/travelers
- src/features/bookings
- src/features/documents
- src/features/refunds
- src/features/vouchers
- src/features/notifications
- src/features/support

Tasks:
- wire dashboard, bookings, booking detail, profile, travelers, vouchers, documents, refunds, notifications, and support pages
- ensure each page supports loading, empty, success, and error states with real data
- verify forms save correctly and reflect server responses
- verify document upload and refund request flows
- remove placeholder content from account pages

Deliverables:
1. implemented account-area data integration
2. a short per-page status summary
3. unresolved backend dependencies, grouped by feature

Rules:
- preserve current page composition
- prioritize user-critical flows over secondary polish
- keep optimistic behavior limited and safe
- do not merge unrelated concerns into one hook or one page
```

---

## Prompt G - Admin Area Data Integration

```text
Complete the TravelBook admin area implementation using real backend data and operationally safe state handling.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- src/pages/admin
- src/sections/admin
- src/features/admin
- src/shared/ui/Table.tsx
- src/shared/navigation/AdminSidebar.tsx

Tasks:
- wire admin dashboard, tours, schedules, pricing, bookings, refunds, documents, and operations pages
- connect admin tables, queues, filters, pagination, and inline row actions
- verify admin detail pages receive correct ids and load correctly
- ensure operational states and review actions reflect real backend responses
- remove synthetic metrics or placeholder data from admin surfaces

Deliverables:
1. implemented admin data integration
2. a short list of unresolved admin endpoint or permission dependencies
3. notes on pagination, filters, and row-action behavior

Rules:
- preserve the approved admin IA and layouts
- keep admin flows dense but predictable
- favor explicit operator feedback over hidden background behavior
- do not introduce new admin destinations
```

---

## Prompt H - Shared State, Feedback, And Error Handling

```text
Harden shared TravelBook UI behavior so all major flows handle real application states consistently.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- src/shared/ui
- src/shared/components
- src/shared/navigation
- src/pages/errors

Tasks:
- verify shared loading, empty, error, success, and warning components work with real usage patterns
- ensure non-color-dependent feedback is consistent across the app
- align status badge usage across bookings, refunds, documents, notifications, and admin queues
- verify 403, 404, and 500 pages integrate correctly with routing and recovery flows
- remove duplicated local error/loading UI when shared components should be used

Deliverables:
1. implemented shared state-handling improvements
2. a list of duplicated patterns removed or standardized
3. any residual inconsistencies still needing manual review

Rules:
- do not redesign components visually
- prefer shared primitives over custom one-off states
- do not over-centralize if a feature-specific variant is clearly needed
```

---

## Prompt I - Test And Build Hardening

```text
Bring the TravelBook frontend to a deploy-safe quality bar through build, integration, and end-to-end hardening.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Focus on:
- src/tests
- build configuration
- env handling
- route stability
- critical end-to-end flows

Tasks:
- run and fix integration tests where realistic
- run and fix e2e coverage for auth, booking/checkout, and refund/document flows
- fix build-time issues, missing env assumptions, and runtime edge cases
- verify lazy routes, guards, and error fallbacks behave correctly in production build
- identify any test gaps that should block deployment

Deliverables:
1. build/test hardening changes
2. pass/fail summary for critical flows
3. a short blocker list for anything still preventing release

Rules:
- prioritize shipping confidence over perfect test coverage
- call out flaky or environment-coupled tests clearly
- do not hide failures behind skipped assertions unless justified
```

---

## Prompt J - Final Deploy Readiness Review

```text
Perform a final deploy-readiness review of the TravelBook frontend after implementation and integration work is complete.

Workspace:
- /Users/quan.nguyen/individual/newwwwwwwww/secure-travel-booking-platform/frontend

Review:
- env and config readiness
- API and auth integration completeness
- route and guard stability
- public discovery flow
- checkout and payment flow
- account flows
- admin flows
- shared state/error handling
- build output
- test confidence

Deliverables:
1. deployment readiness verdict: ready / ready with caveats / not ready
2. top blockers ordered by severity
3. final pre-release checklist
4. recommended first production smoke tests

Rules:
- focus on production risk, not polish preferences
- findings first, summary second
- if something is uncertain, say exactly what needs verification
```

---

## How To Use This File Well

- Run one prompt at a time.
- After each run, commit or checkpoint the result before moving on.
- Keep a short unresolved-blockers list between prompts.
- If the coding agent reports backend contract uncertainty, stop and confirm the backend response shape before continuing.
- If a prompt requires a large rewrite, split it into smaller feature slices instead of forcing one giant pass.

## Fastest Practical Path

If you want the shortest route to a usable deployment, prioritize:

1. Prompt B
2. Prompt C
3. Prompt D
4. Prompt E
5. Prompt F
6. Prompt G
7. Prompt I
8. Prompt J

This gets the frontend connected, stabilized, tested, and reviewed without over-polishing too early.
