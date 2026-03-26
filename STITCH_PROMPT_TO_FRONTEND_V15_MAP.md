# Stitch Prompt -> Frontend v1.5 File Map

Assumption: this map targets the `ver 1.5 practical` tree from your message:
- `src/widgets/**` is the target for page-level UI blocks
- `src/features/*/ui/**` is the target for feature-specific reusable UI
- `src/shared/**` is only for generic reusable UI

If your current repo still uses `sections/` or `features/*/components/`, treat this file as the rename guide while merging.

## Global rules

- `Prompt 00` and `Prompt 00A-00E` are reference-locking prompts. They mainly shape `layouts`, `navigation`, and the global style system. They are not business-feature prompts.
- `Prompt 01-39` are route prompts. Each one maps first to one file in `src/pages/**`, then you extract repeated blocks into `src/widgets/**` or `src/features/*/ui/**`.
- `Prompt 42-60` are reusable visual-system prompts. These mostly map to `src/widgets/**`, `src/features/*/ui/**`, `src/shared/ui/**`, `src/shared/components/**`, and `src/shared/navigation/**`.
- `Prompt 40-41` are control prompts only. They do not own any permanent file.
- Do not map Stitch prompts into `api/`, `queries/`, `model/`, `schema`, `types`, `storage`, `store`, or `providers/`. Those should be written manually after the UI structure is stable.

## Router wiring rule

- `Prompt 01-07` also need wiring in `src/app/router/routes/public.routes.tsx`
- `Prompt 08-11` also need wiring in `src/app/router/routes/auth.routes.tsx`
- `Prompt 12-15` also need wiring in `src/app/router/routes/checkout.routes.tsx`
- `Prompt 16-27` also need wiring in `src/app/router/routes/account.routes.tsx`
- `Prompt 28-36` also need wiring in `src/app/router/routes/admin.routes.tsx`
- `Prompt 37-39` also need wiring in `src/app/router/routes/error.routes.tsx`

## A. Foundation And Shell Prompts

| Prompt | Primary target files | Secondary target files | Notes |
| --- | --- | --- | --- |
| `00` Foundation Reference Page | No production route in the v1.5 tree | `src/shared/styles/globals.css`, `src/shared/styles/theme.css`, `src/shared/styles/variables.css` | Use as visual source of truth, not as a shipped page. If you want a rendered artifact, keep it outside the main tree or in a temporary internal route. |
| `00A` Public Layout Shell Reference | `src/app/layouts/PublicLayout.tsx` | `src/shared/navigation/MainHeader.tsx`, `src/shared/navigation/MainFooter.tsx` | Locks shell rules for `01-07`. |
| `00B` Auth Layout Shell Reference | `src/app/layouts/AuthLayout.tsx` | `src/shared/ui/Card.tsx`, `src/shared/ui/Alert.tsx` | Locks shell rules for `08-11`. |
| `00C` Checkout Layout Shell Reference | `src/app/layouts/CheckoutLayout.tsx` | `src/shared/components/PageHeader.tsx` | The checkout stepper can live inside this layout first because the v1.5 tree does not explicitly expose a `Stepper.tsx` file. |
| `00D` Account Layout Shell Reference | `src/app/layouts/AccountLayout.tsx` | `src/shared/navigation/UserSidebar.tsx`, `src/shared/navigation/Breadcrumbs.tsx` | Locks shell rules for `16-27`. |
| `00E` Admin Layout Shell Reference | `src/app/layouts/AdminLayout.tsx` | `src/shared/navigation/AdminSidebar.tsx`, `src/shared/components/PageHeader.tsx` | Locks shell rules for `28-36`. |

## B. Public Route Prompts

| Prompt | Primary page file | Extract reusable UI into | Notes |
| --- | --- | --- | --- |
| `01` Home Page | `src/pages/public/HomePage.tsx` | `src/widgets/home/HeroSection.tsx`, `src/widgets/home/FeaturedToursSection.tsx`, `src/widgets/home/PopularDestinationsSection.tsx`, `src/widgets/home/PromotionSection.tsx` | Header/footer come from `PublicLayout`. Trust strip, how-it-works, testimonials, and final CTA can stay page-local until they are reused. |
| `02` Tours Catalog | `src/pages/public/ToursPage.tsx` | `src/widgets/tours/TourCatalogSection.tsx`, `src/features/tours/ui/TourCard.tsx`, `src/features/tours/ui/TourSearchFilters.tsx`, `src/shared/components/SearchBar.tsx`, `src/shared/components/FilterPanel.tsx` | Pagination, loading, and empty state should reuse `src/shared/ui/Pagination.tsx`, `src/shared/ui/Skeleton.tsx`, and `src/shared/ui/EmptyState.tsx`. |
| `03` Tour Detail | `src/pages/public/TourDetailPage.tsx` | `src/widgets/tours/TourDetailHero.tsx`, `src/widgets/tours/DestinationHighlightSection.tsx`, `src/features/tours/ui/TourPriceBox.tsx`, `src/features/tours/ui/DestinationSection.tsx` | FAQ and inclusions/exclusions can stay page-local until reused elsewhere. |
| `04` Tour Schedules | `src/pages/public/TourSchedulesPage.tsx` | `src/widgets/tours/TourScheduleSection.tsx`, `src/features/tours/ui/TourScheduleList.tsx` | Selection row/card variants can stay inside `TourScheduleList.tsx` until reuse appears. |
| `05` Destinations | `src/pages/public/DestinationsPage.tsx` | `src/widgets/tours/DestinationHighlightSection.tsx`, `src/widgets/home/PopularDestinationsSection.tsx`, `src/features/tours/ui/DestinationSection.tsx` | If the page needs a unique editorial block, keep it page-local first. |
| `06` Promotions | `src/pages/public/PromotionsPage.tsx` | `src/widgets/home/PromotionSection.tsx`, `src/features/promotions/ui/PromotionCard.tsx`, `src/features/promotions/ui/PromotionBanner.tsx` | Terms/FAQ blocks can stay page-local unless promotions become a bigger module. |
| `07` Help Page | `src/pages/public/HelpPage.tsx` | `src/shared/components/SearchBar.tsx`, `src/shared/ui/Alert.tsx` | The contact/escalation area should stay page-local first. Only extract to shared if the same public support block repeats elsewhere. |

## C. Auth Route Prompts

| Prompt | Primary page file | Extract reusable UI into | Notes |
| --- | --- | --- | --- |
| `08` Login Page | `src/pages/auth/LoginPage.tsx` | `src/features/auth/ui/LoginForm.tsx` | Shell comes from `src/app/layouts/AuthLayout.tsx`. |
| `09` Register Page | `src/pages/auth/RegisterPage.tsx` | `src/features/auth/ui/RegisterForm.tsx` | Benefits panel can stay inside the page unless reused on marketing/auth pages. |
| `10` Forgot Password | `src/pages/auth/ForgotPasswordPage.tsx` | `src/features/auth/ui/ForgotPasswordForm.tsx` | |
| `11` Reset Password | `src/pages/auth/ResetPasswordPage.tsx` | `src/features/auth/ui/ResetPasswordForm.tsx` | Invalid-token state can live inside the page or form component. |

## D. Checkout Route Prompts

| Prompt | Primary page file | Extract reusable UI into | Notes |
| --- | --- | --- | --- |
| `12` Checkout Review | `src/pages/checkout/CheckoutPage.tsx` | `src/widgets/checkout/TravelerInfoSection.tsx`, `src/widgets/checkout/CheckoutSummarySection.tsx`, `src/features/bookings/ui/CheckoutPanel.tsx`, `src/features/bookings/ui/BookingSummary.tsx` | Sticky amount-due behavior is primarily a layout/widget concern. |
| `13` Payment Page | `src/pages/checkout/PaymentPage.tsx` | `src/widgets/checkout/PaymentSummarySection.tsx`, `src/features/payments/ui/PaymentMethodSelector.tsx`, `src/features/payments/ui/PaymentSummary.tsx`, `src/features/payments/ui/PaymentStatusPanel.tsx` | Security reassurance block can stay page-local unless reused in checkout/account pages. |
| `14` Payment Success | `src/pages/checkout/PaymentSuccessPage.tsx` | `src/features/payments/ui/PaymentStatusPanel.tsx`, `src/features/payments/ui/PaymentSummary.tsx` | Next-steps block can stay in the page. |
| `15` Payment Failed | `src/pages/checkout/PaymentFailedPage.tsx` | `src/features/payments/ui/PaymentStatusPanel.tsx` | Retry/support CTA block can stay page-local. |

## E. Account Route Prompts

| Prompt | Primary page file | Extract reusable UI into | Notes |
| --- | --- | --- | --- |
| `16` Account Dashboard | `src/pages/account/DashboardPage.tsx` | `src/widgets/account/ProfileOverviewSection.tsx`, `src/widgets/account/BookingHistorySection.tsx`, `src/widgets/account/NotificationCenterSection.tsx`, `src/widgets/account/DocumentOverviewSection.tsx` | Stats cards and quick-action cards can stay inside the page or widget until reused more broadly. |
| `17` Profile Page | `src/pages/account/ProfilePage.tsx` | `src/features/profile/ui/ProfileCard.tsx`, `src/features/profile/ui/ProfileForm.tsx` | |
| `18` Change Password | `src/pages/account/ChangePasswordPage.tsx` | `src/features/profile/ui/ChangePasswordForm.tsx` | |
| `19` Travelers Page | `src/pages/account/TravelersPage.tsx` | `src/features/travelers/ui/TravelerList.tsx`, `src/features/travelers/ui/TravelerForm.tsx` | |
| `20` Bookings List | `src/pages/account/BookingsPage.tsx` | `src/features/bookings/ui/BookingCard.tsx`, `src/features/bookings/ui/BookingStatusBadge.tsx`, `src/features/bookings/ui/BookingActions.tsx`, `src/shared/components/FilterPanel.tsx` | If you end up with table-card hybrid behavior, keep the layout shell in the page and keep card primitives in the feature. |
| `21` Booking Detail | `src/pages/account/BookingDetailPage.tsx` | `src/features/bookings/ui/BookingSummary.tsx`, `src/features/bookings/ui/BookingActions.tsx`, `src/features/payments/ui/PaymentSummary.tsx`, `src/features/vouchers/ui/VoucherDownloadButton.tsx`, `src/features/refunds/ui/RefundRequestForm.tsx` | This page is mostly composition of existing feature UI. |
| `22` Vouchers Page | `src/pages/account/VouchersPage.tsx` | `src/features/vouchers/ui/VoucherViewer.tsx`, `src/features/vouchers/ui/VoucherDownloadButton.tsx` | |
| `23` Documents Page | `src/pages/account/DocumentsPage.tsx` | `src/features/documents/ui/DocumentUploadPanel.tsx`, `src/features/documents/ui/DocumentList.tsx`, `src/features/documents/ui/DocumentCard.tsx`, `src/features/documents/ui/VerificationStatus.tsx`, `src/shared/forms/FileUploadField.tsx` | |
| `23A` Document Detail Placeholder | `src/pages/account/DocumentDetailPage.tsx` | `src/shared/ui/Alert.tsx`, `src/shared/ui/Card.tsx` | Keep this lightweight and intentional. |
| `24` Refunds Page | `src/pages/account/RefundsPage.tsx` | `src/features/refunds/ui/RefundTimeline.tsx` | List wrappers can stay page-local if there is only one refunds listing page. |
| `25` Refund Detail | `src/pages/account/RefundDetailPage.tsx` | `src/features/refunds/ui/RefundTimeline.tsx`, `src/features/refunds/ui/RefundPolicyNotice.tsx` | |
| `26` Notifications Page | `src/pages/account/NotificationsPage.tsx` | `src/features/notifications/ui/NotificationList.tsx`, `src/features/notifications/ui/NotificationFilterTabs.tsx` | |
| `27` Support Page | `src/pages/account/SupportPage.tsx` | `src/features/support/ui/TicketForm.tsx`, `src/features/support/ui/TicketList.tsx`, `src/features/support/ui/TicketReplyBox.tsx` | |

## F. Admin Route Prompts

| Prompt | Primary page file | Extract reusable UI into | Notes |
| --- | --- | --- | --- |
| `28` Admin Dashboard | `src/pages/admin/DashboardPage.tsx` | `src/widgets/admin/DashboardStatsSection.tsx`, `src/widgets/admin/BookingQueueSection.tsx`, `src/widgets/admin/RefundQueueSection.tsx`, `src/widgets/admin/OperationsBoardSection.tsx`, `src/features/admin/dashboard/ui/AdminStatsCards.tsx` | |
| `29` Admin Tour Management | `src/pages/admin/TourManagementPage.tsx` | `src/features/admin/tours/ui/TourManagementTable.tsx`, `src/features/admin/tours/ui/TourFormDrawer.tsx` | |
| `30` Admin Schedule Management | `src/pages/admin/ScheduleManagementPage.tsx` | `src/shared/ui/Table.tsx`, `src/shared/components/FilterPanel.tsx`, `src/shared/ui/Drawer.tsx` | The v1.5 tree intentionally has no `features/admin/schedules/` yet, so keep this page-level until schedule logic becomes large enough. |
| `31` Admin Pricing Management | `src/pages/admin/PricingManagementPage.tsx` | `src/features/admin/pricing/ui/PricingRuleForm.tsx`, `src/shared/ui/Table.tsx` | |
| `32` Admin Booking Management | `src/pages/admin/BookingManagementPage.tsx` | `src/features/admin/bookings/ui/BookingManagementTable.tsx` | |
| `33` Admin Booking Detail | `src/pages/admin/BookingDetailPage.tsx` | `src/features/bookings/ui/BookingSummary.tsx`, `src/features/payments/ui/PaymentSummary.tsx`, `src/shared/ui/Card.tsx` | The tree has no dedicated admin booking detail feature file yet, so page-level composition is enough. |
| `34` Admin Refund Management | `src/pages/admin/RefundManagementPage.tsx` | `src/features/admin/refunds/ui/RefundManagementTable.tsx` | |
| `35` Admin Document Management | `src/pages/admin/DocumentManagementPage.tsx` | `src/features/admin/documents/ui/DocumentReviewTable.tsx` | |
| `36` Admin Operations Page | `src/pages/admin/OperationsPage.tsx` | `src/widgets/admin/OperationsBoardSection.tsx`, `src/features/admin/operations/ui/OperationsBoard.tsx` | |

## G. Error Route Prompts

| Prompt | Primary page file | Extract reusable UI into | Notes |
| --- | --- | --- | --- |
| `37` Forbidden Page | `src/pages/errors/ForbiddenPage.tsx` | `src/shared/ui/Alert.tsx`, `src/shared/ui/Card.tsx` | Keep shell context-aware through router/layout composition. |
| `38` Not Found Page | `src/pages/errors/NotFoundPage.tsx` | `src/shared/ui/Alert.tsx`, `src/shared/ui/Card.tsx` | |
| `39` Server Error Page | `src/pages/errors/ServerErrorPage.tsx` | `src/shared/ui/Alert.tsx`, `src/shared/ui/Card.tsx` | |

## H. Shared System Prompts

| Prompt | Primary target files | Notes |
| --- | --- | --- |
| `42` Global Navigation System | `src/shared/navigation/MainHeader.tsx`, `src/shared/navigation/MainFooter.tsx`, `src/shared/navigation/UserSidebar.tsx`, `src/shared/navigation/AdminSidebar.tsx`, `src/shared/navigation/Breadcrumbs.tsx` | Also influences all `src/app/layouts/*.tsx`. |
| `43` Public Marketing Section Library | `src/widgets/home/HeroSection.tsx`, `src/widgets/home/FeaturedToursSection.tsx`, `src/widgets/home/PopularDestinationsSection.tsx`, `src/widgets/home/PromotionSection.tsx`, `src/widgets/tours/DestinationHighlightSection.tsx`, `src/shared/components/SectionHeader.tsx` | `section hero`, `feature card`, `testimonial card`, and `contact form` are not explicit files in the v1.5 tree, so keep them as local subcomponents inside widgets/pages first. |
| `44` Discovery Search And Filter System | `src/shared/components/SearchBar.tsx`, `src/shared/components/FilterPanel.tsx`, `src/shared/forms/DateRangeField.tsx`, `src/shared/forms/QuantityField.tsx`, `src/features/tours/ui/TourSearchFilters.tsx` | Reused by tours first, then account/admin if needed. |
| `45` Tour Discovery Component Family | `src/features/tours/ui/TourCard.tsx`, `src/features/tours/ui/TourScheduleList.tsx`, `src/features/tours/ui/TourPriceBox.tsx`, `src/features/tours/ui/DestinationSection.tsx`, `src/widgets/tours/TourDetailHero.tsx` | |
| `46` Auth Form Component System | `src/features/auth/ui/LoginForm.tsx`, `src/features/auth/ui/RegisterForm.tsx`, `src/features/auth/ui/ForgotPasswordForm.tsx`, `src/features/auth/ui/ResetPasswordForm.tsx` | |
| `47` Checkout Module Set | `src/widgets/checkout/TravelerInfoSection.tsx`, `src/widgets/checkout/CheckoutSummarySection.tsx`, `src/widgets/checkout/PaymentSummarySection.tsx`, `src/features/bookings/ui/CheckoutPanel.tsx`, `src/features/payments/ui/PaymentMethodSelector.tsx`, `src/features/payments/ui/PaymentSummary.tsx`, `src/features/payments/ui/PaymentStatusPanel.tsx` | |
| `48` Account Summary Section Set | `src/widgets/account/ProfileOverviewSection.tsx`, `src/widgets/account/BookingHistorySection.tsx`, `src/widgets/account/NotificationCenterSection.tsx`, `src/widgets/account/DocumentOverviewSection.tsx` | Dashboard stats and quick actions can remain local until reused across multiple account pages. |
| `49` Booking Component Family | `src/features/bookings/ui/BookingCard.tsx`, `src/features/bookings/ui/BookingStatusBadge.tsx`, `src/features/bookings/ui/BookingSummary.tsx`, `src/features/bookings/ui/BookingActions.tsx` | Admin queue row variants should stay in admin table files unless reuse becomes obvious. |
| `50` Profile And Traveler Form System | `src/features/profile/ui/ProfileCard.tsx`, `src/features/profile/ui/ProfileForm.tsx`, `src/features/profile/ui/ChangePasswordForm.tsx`, `src/features/travelers/ui/TravelerList.tsx`, `src/features/travelers/ui/TravelerForm.tsx` | |
| `51` Document Management Component Family | `src/features/documents/ui/DocumentUploadPanel.tsx`, `src/features/documents/ui/DocumentList.tsx`, `src/features/documents/ui/DocumentCard.tsx`, `src/features/documents/ui/VerificationStatus.tsx`, `src/shared/forms/FileUploadField.tsx` | |
| `52` Voucher And Refund Component Family | `src/features/vouchers/ui/VoucherViewer.tsx`, `src/features/vouchers/ui/VoucherDownloadButton.tsx`, `src/features/refunds/ui/RefundRequestForm.tsx`, `src/features/refunds/ui/RefundTimeline.tsx`, `src/features/refunds/ui/RefundPolicyNotice.tsx` | |
| `53` Notification And Support Component Family | `src/features/notifications/ui/NotificationList.tsx`, `src/features/notifications/ui/NotificationFilterTabs.tsx`, `src/features/support/ui/TicketList.tsx`, `src/features/support/ui/TicketForm.tsx`, `src/features/support/ui/TicketReplyBox.tsx` | |
| `54` Admin Table And Review System | `src/shared/ui/Table.tsx`, `src/shared/ui/Pagination.tsx`, `src/shared/components/FilterPanel.tsx`, `src/features/admin/tours/ui/TourManagementTable.tsx`, `src/features/admin/bookings/ui/BookingManagementTable.tsx`, `src/features/admin/refunds/ui/RefundManagementTable.tsx`, `src/features/admin/documents/ui/DocumentReviewTable.tsx` | |
| `55` Admin Operational Modules | `src/widgets/admin/DashboardStatsSection.tsx`, `src/widgets/admin/BookingQueueSection.tsx`, `src/widgets/admin/RefundQueueSection.tsx`, `src/widgets/admin/OperationsBoardSection.tsx`, `src/features/admin/dashboard/ui/AdminStatsCards.tsx`, `src/features/admin/pricing/ui/PricingRuleForm.tsx`, `src/features/admin/operations/ui/OperationsBoard.tsx` | |
| `56` Shared Status And Feedback System | `src/shared/ui/Badge.tsx`, `src/shared/ui/Alert.tsx`, `src/shared/ui/EmptyState.tsx`, `src/shared/components/ErrorFallback.tsx`, `src/shared/components/LoadingOverlay.tsx`, `src/shared/ui/Skeleton.tsx`, `src/shared/ui/Spinner.tsx` | Keep semantic mappings centralized here and consume them from features. |
| `57` Shared Form Primitive Library | `src/shared/ui/Button.tsx`, `src/shared/ui/Input.tsx`, `src/shared/ui/Textarea.tsx`, `src/shared/ui/Select.tsx`, `src/shared/ui/Checkbox.tsx`, `src/shared/ui/Radio.tsx`, `src/shared/forms/FormField.tsx`, `src/shared/forms/DateRangeField.tsx`, `src/shared/forms/QuantityField.tsx` | The v1.5 tree does not explicitly include `Toggle.tsx` or a standalone date-picker file. Keep them inside form fields first, or add them later only if truly reused. |
| `58` Shared Navigation And Flow Components | `src/shared/ui/Tabs.tsx`, `src/shared/ui/Pagination.tsx`, `src/shared/navigation/Breadcrumbs.tsx`, `src/shared/components/PageHeader.tsx` | The checkout `stepper` is not explicit in the tree. Keep it in `src/app/layouts/CheckoutLayout.tsx` first unless it becomes broadly reusable. |
| `59` Shared Display And Utility Components | `src/shared/ui/Card.tsx`, `src/shared/components/SectionHeader.tsx`, `src/shared/components/DateText.tsx`, `src/shared/components/CurrencyText.tsx` | The v1.5 tree does not explicitly include `Avatar` or `ProtectedBlock`. Keep those as page-local or guard-level UI until repetition is proven. |
| `60` Shared Overlay Components | `src/shared/ui/Modal.tsx`, `src/shared/ui/Drawer.tsx`, `src/shared/ui/ConfirmDialog.tsx`, `src/shared/ui/Tooltip.tsx` | |

## I. Drift-Control Prompts

| Prompt | File ownership |
| --- | --- |
| `40` Continuity Repair | No dedicated file. Re-run it against the last generated page/component before merging. |
| `41` New Component Approval | No dedicated file. Use it as a gate before you create any new `shared/`, `widgets/`, or `features/*/ui/` file. |

## J. Places Where The Prompt Pack Is Wider Than The v1.5 Tree

- `Prompt 43` mentions `feature card`, `testimonial card`, and `contact form`, but the v1.5 tree does not give them dedicated files. Keep them inside the relevant widget/page until they repeat on at least 2-3 screens.
- `Prompt 57` mentions `toggle` and `date picker`, but the v1.5 tree only exposes `Checkbox`, `Radio`, `DateRangeField`, and `QuantityField`. Do not add extra primitives early unless the product really needs them.
- `Prompt 58` mentions `stepper`, but the v1.5 tree does not expose a dedicated file for it. The safest place is `src/app/layouts/CheckoutLayout.tsx`.
- `Prompt 59` mentions `avatar` and `protected block`, but those are not explicit in the v1.5 tree. Keep them page-local or guard-local first.
- `Prompt 30` and `Prompt 33` are intentionally page-level in this tree because there is no `features/admin/schedules/` or dedicated admin booking-detail UI module yet.

## K. Fast Merge Strategy

1. Run and merge `00`, then `00A-00E`
2. Build `42`, `56`, `57`, `58`, `60` first so the primitive system exists
3. Build `43`, `44`, `45`, `46`, `47`, `48`, `49`, `50`, `51`, `52`, `53`, `54`, `55`
4. Then map `01-39` into route pages, extracting only the reusable blocks already approved above
5. Use `40` whenever Stitch drifts, and `41` before creating any extra file not already in the tree

That order keeps the tree aligned with your rule:
- `pages/` only compose screens
- `widgets/` own large page sections
- `features/*/ui/` own business-facing reusable UI
- `shared/` stays generic
