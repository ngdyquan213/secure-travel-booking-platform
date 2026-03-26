import { stitchPages, type StitchPageDefinition } from '@/shared/config/stitchPages'

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

const isDisabledElement = (element: HTMLElement) =>
  element.getAttribute('aria-disabled') === 'true' ||
  element.hasAttribute('disabled') ||
  element.className.includes('cursor-not-allowed')

const isAdminContext = (definition: StitchPageDefinition) => definition.category === 'Admin'
const isAccountContext = (definition: StitchPageDefinition) => definition.category === 'Account'

const currentDashboardHref = (definition: StitchPageDefinition) =>
  isAdminContext(definition)
    ? stitchPages.adminDashboard.href
    : stitchPages.accountDashboard.href

const currentBookingsHref = (definition: StitchPageDefinition) =>
  isAdminContext(definition) ? stitchPages.adminBookings.href : stitchPages.bookings.href

const currentDocumentsHref = (definition: StitchPageDefinition) =>
  isAdminContext(definition) ? stitchPages.adminDocuments.href : stitchPages.documents.href

const currentRefundsHref = (definition: StitchPageDefinition) =>
  isAdminContext(definition) ? stitchPages.adminRefunds.href : stitchPages.refunds.href

const currentSupportHref = (definition: StitchPageDefinition) =>
  isAccountContext(definition) ? stitchPages.support.href : stitchPages.helpCenter.href

const currentToursHref = (definition: StitchPageDefinition) =>
  isAdminContext(definition) ? stitchPages.adminTours.href : stitchPages.tours.href

const currentSchedulesHref = (definition: StitchPageDefinition) =>
  isAdminContext(definition) ? stitchPages.adminSchedules.href : stitchPages.tourSchedules.href

type RouteMatchContext = {
  definition: StitchPageDefinition
  element: HTMLElement
  intent: string
}

const resolveRouteFromIntent = ({
  definition,
  element,
  intent,
}: RouteMatchContext): string | null => {
  if (!intent || isDisabledElement(element)) {
    return null
  }

  const tagName = element.tagName.toLowerCase()

  if (intent.includes('forgot password')) {
    return stitchPages.forgotPassword.href
  }

  if (intent.includes('send reset link')) {
    return stitchPages.resetPassword.href
  }

  if (intent.includes('update password')) {
    return stitchPages.login.href
  }

  if (intent.includes('create account') || intent.includes('complete registration')) {
    return stitchPages.accountDashboard.href
  }

  if (intent.includes('sign in')) {
    if (definition.slug === stitchPages.login.slug && tagName === 'button') {
      return stitchPages.accountDashboard.href
    }

    if (
      definition.slug === stitchPages.register.slug ||
      definition.slug === stitchPages.forgotPassword.slug ||
      definition.slug === stitchPages.resetPassword.slug
    ) {
      return stitchPages.login.href
    }
  }

  if (intent === 'register') {
    return stitchPages.register.href
  }

  if (
    intent === 'home' ||
    intent.includes('return to home') ||
    intent.includes('go home') ||
    intent.includes('back home')
  ) {
    return stitchPages.home.href
  }

  if (intent.includes('travelbook') && tagName === 'a') {
    return stitchPages.home.href
  }

  if (intent.includes('browse tours') || intent.includes('browse all tours')) {
    return stitchPages.tours.href
  }

  if (intent.includes('view destinations')) {
    return stitchPages.destinations.href
  }

  if (intent.includes('view itinerary')) {
    return stitchPages.tourDetail.href
  }

  if (intent.includes('view schedules')) {
    return stitchPages.tourSchedules.href
  }

  if (intent.includes('back to schedules')) {
    return stitchPages.tourSchedules.href
  }

  if (intent.includes('back to tour details')) {
    return stitchPages.tourDetail.href
  }

  if (intent.includes('continue to booking')) {
    return stitchPages.checkoutReview.href
  }

  if (intent.includes('continue to payment')) {
    return stitchPages.payment.href
  }

  if (intent.includes('complete payment')) {
    return stitchPages.paymentSuccess.href
  }

  if (intent.includes('retry payment')) {
    return stitchPages.payment.href
  }

  if (intent.includes('back to review')) {
    return stitchPages.checkoutReview.href
  }

  if (intent.includes('edit selection')) {
    return stitchPages.tourSchedules.href
  }

  if (intent.includes('modify details')) {
    return stitchPages.travelers.href
  }

  if (
    intent.includes('view booking details') ||
    intent.includes('booking details') ||
    intent.includes('view detail')
  ) {
    return stitchPages.bookingDetail.href
  }

  if (
    intent.includes('access vouchers') ||
    intent.includes('get vouchers') ||
    intent === 'vouchers'
  ) {
    return stitchPages.vouchers.href
  }

  if (
    intent.includes('check documents') ||
    intent.includes('upload documents') ||
    intent.includes('review status') ||
    intent.includes('browse documents') ||
    intent === 'documents'
  ) {
    return currentDocumentsHref(definition)
  }

  if (
    intent.includes('refund dashboard') ||
    intent.includes('view refund help') ||
    intent === 'refunds'
  ) {
    return currentRefundsHref(definition)
  }

  if (
    intent.includes('view notifications') ||
    (intent === 'notifications' && isAccountContext(definition))
  ) {
    return stitchPages.notifications.href
  }

  if (
    intent.includes('manage travelers') ||
    intent.includes('traveler section') ||
    intent === 'travelers'
  ) {
    return stitchPages.travelers.href
  }

  if (intent.includes('manage profile') || intent === 'profile' || intent === 'settings') {
    return stitchPages.profile.href
  }

  if (intent.includes('book new trip')) {
    return stitchPages.tours.href
  }

  if (intent.includes('contact support')) {
    return currentSupportHref(definition)
  }

  if (intent.includes('help center') || intent === 'help') {
    return stitchPages.helpCenter.href
  }

  if (intent.includes('help outline')) {
    return stitchPages.helpCenter.href
  }

  if (intent === 'support') {
    return currentSupportHref(definition)
  }

  if (
    intent === 'dashboard' ||
    intent.includes('travel dashboard') ||
    intent.includes('account dashboard')
  ) {
    return currentDashboardHref(definition)
  }

  if (
    intent === 'bookings' ||
    intent.includes('my bookings') ||
    intent.includes('review booking help') ||
    intent.includes('quick return to bookings')
  ) {
    return currentBookingsHref(definition)
  }

  if (intent === 'tours') {
    return currentToursHref(definition)
  }

  if (intent === 'destinations') {
    return stitchPages.destinations.href
  }

  if (intent === 'promotions') {
    return stitchPages.promotions.href
  }

  if (intent === 'schedules') {
    return currentSchedulesHref(definition)
  }

  if (intent === 'pricing') {
    return stitchPages.adminPricing.href
  }

  if (intent === 'operations') {
    return stitchPages.adminOperations.href
  }

  if (intent.includes('logout')) {
    return stitchPages.home.href
  }

  if (intent.includes('account circle')) {
    return stitchPages.login.href
  }

  if (
    intent.includes('privacy policy') ||
    intent.includes('terms of service') ||
    intent.includes('terms') ||
    intent.includes('cookie') ||
    intent.includes('about us')
  ) {
    return stitchPages.helpCenter.href
  }

  return null
}

const getIntentPayload = (element: HTMLElement) => {
  const cloneNode = element.cloneNode(true) as HTMLElement
  cloneNode.querySelectorAll('.material-symbols-outlined').forEach((iconNode) => {
    iconNode.remove()
  })

  const baseIntent = normalizeText(
    [
      element.getAttribute('title') ?? '',
      element.getAttribute('aria-label') ?? '',
      cloneNode.textContent ?? '',
    ].join(' '),
  )

  if (baseIntent) {
    return baseIntent
  }

  const iconTexts = Array.from(
    element.querySelectorAll<HTMLElement>('.material-symbols-outlined'),
  ).flatMap((iconNode) => [
    iconNode.getAttribute('data-icon') ?? '',
    iconNode.textContent ?? '',
  ])

  return normalizeText(
    [
      element.getAttribute('data-icon') ?? '',
      ...iconTexts,
    ].join(' '),
  )
}

export const bridgeSelector =
  'a, button, [role="button"], [class*="cursor-pointer"], [title]'

export function resolveBridgeRoute(
  element: HTMLElement,
  definition: StitchPageDefinition,
): string | null {
  return resolveRouteFromIntent({
    definition,
    element,
    intent: getIntentPayload(element),
  })
}

export function resolveSubmitBridgeRoute(
  definition: StitchPageDefinition,
): string | null {
  if (
    definition.slug === stitchPages.login.slug ||
    definition.slug === stitchPages.register.slug
  ) {
    return stitchPages.accountDashboard.href
  }

  if (definition.slug === stitchPages.forgotPassword.slug) {
    return stitchPages.resetPassword.href
  }

  if (definition.slug === stitchPages.resetPassword.slug) {
    return stitchPages.login.href
  }

  return null
}
