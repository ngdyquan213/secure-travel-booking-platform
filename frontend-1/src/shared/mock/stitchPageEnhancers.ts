import type { NavigateFunction } from 'react-router-dom'
import { stitchPages, type StitchPageDefinition } from '@/shared/config/stitchPages'
import {
  mockSchedules,
  mockTours,
  type Booking,
  type NotificationItem,
  type TravelBookMockState,
  type TravelDocument,
} from '@/shared/mock/stitchMockData'
import {
  bookingDetailHref,
  checkoutHref,
  refundDetailHref,
  tourDetailHref,
  tourSchedulesHref,
} from '@/shared/mock/stitchRouteHelpers'
import {
  addNotification,
  completeMockPayment,
  formatPrice,
  getBookingsSummary,
  getCurrentBooking,
  getCurrentRefund,
  getDocumentSummary,
  getMockState,
  getSchedulesForSelectedTour,
  getSelectedSchedule,
  getSelectedTour,
  getVisibleTours,
  markNotificationRead,
  setSelectedSchedule,
  setSelectedTour,
  setTravelersCount,
  subscribeMockState,
  updateCatalogFilters,
  updateDocumentsFilter,
  updateNotificationsFilter,
  updatePaymentDraft,
  updateProfile,
  uploadDocument,
} from '@/shared/mock/stitchMockStore'

type Cleanup = () => void
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
type EnhancerContext = {
  definition: StitchPageDefinition
  documentNode: Document
  navigate: NavigateFunction
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const getButtons = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLElement>('button, a, [role="button"], [role="link"]'))

const getElementText = (element: HTMLElement) => {
  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.material-symbols-outlined').forEach((iconNode) => {
    iconNode.remove()
  })

  return normalizeText(clone.textContent ?? '')
}

const findButtonByText = (
  root: ParentNode,
  text: string,
  mode: 'exact' | 'includes' = 'exact',
) => {
  const targetText = normalizeText(text)

  return getButtons(root).find((element) => {
    const elementText = getElementText(element)
    return mode === 'includes'
      ? elementText.includes(targetText)
      : elementText === targetText
  })
}

const findButtonsByText = (
  root: ParentNode,
  text: string,
  mode: 'exact' | 'includes' = 'exact',
) => {
  const targetText = normalizeText(text)

  return getButtons(root).filter((element) => {
    const elementText = getElementText(element)
    return mode === 'includes'
      ? elementText.includes(targetText)
      : elementText === targetText
  })
}

const findFieldByLabel = (root: ParentNode, labelText: string): FieldElement | null => {
  const targetText = normalizeText(labelText)
  const labelNode = Array.from(root.querySelectorAll<HTMLLabelElement>('label')).find(
    (label) => normalizeText(label.textContent ?? '') === targetText,
  )

  if (!labelNode) {
    return null
  }

  return (
    labelNode.parentElement?.querySelector<FieldElement>('input, select, textarea') ?? null
  )
}

const findInputByPlaceholder = (root: ParentNode, placeholderText: string) => {
  const targetText = normalizeText(placeholderText)

  return (
    Array.from(root.querySelectorAll<HTMLInputElement>('input')).find(
      (input) => normalizeText(input.placeholder ?? '').includes(targetText),
    ) ?? null
  )
}

const findSectionByHeading = (root: ParentNode, headingText: string) => {
  const targetText = normalizeText(headingText)
  const headingNode = Array.from(root.querySelectorAll<HTMLElement>('h1, h2, h3, h4')).find(
    (heading) => normalizeText(heading.textContent ?? '') === targetText,
  )

  return headingNode?.closest<HTMLElement>('section') ?? null
}

const setBridgeRoute = (element: HTMLElement | null | undefined, route: string) => {
  if (!element) {
    return
  }

  element.dataset.routerBridge = route

  if (element.tagName.toLowerCase() === 'a') {
    const anchorNode = element as HTMLAnchorElement
    anchorNode.href = route
    anchorNode.target = '_top'
  } else if (
    element.tagName.toLowerCase() !== 'button' &&
    !element.hasAttribute('tabindex')
  ) {
    element.tabIndex = 0
    element.setAttribute('role', 'link')
  }
}

const clearBridgeRoute = (element: HTMLElement | null | undefined) => {
  if (!element) {
    return
  }

  element.removeAttribute('data-router-bridge')

  if (element.tagName.toLowerCase() === 'a') {
    element.removeAttribute('target')
    element.href = '#'
  }
}

const ensureAnchorRoute = (
  documentNode: Document,
  element: HTMLElement | null | undefined,
  route: string,
) => {
  if (!element) {
    return null
  }

  if (element.tagName.toLowerCase() === 'a') {
    setBridgeRoute(element, route)
    return element
  }

  const anchorNode = documentNode.createElement('a')
  anchorNode.className = `${element.className} inline-flex items-center justify-center no-underline`
  anchorNode.innerHTML = element.innerHTML
  anchorNode.href = route
  anchorNode.target = '_top'
  anchorNode.dataset.routerBridge = route
  anchorNode.setAttribute('role', 'link')

  for (const attribute of element.getAttributeNames()) {
    if (
      attribute === 'class' ||
      attribute === 'data-router-bridge' ||
      attribute === 'href' ||
      attribute === 'target' ||
      attribute === 'role'
    ) {
      continue
    }

    const value = element.getAttribute(attribute)
    if (value !== null) {
      anchorNode.setAttribute(attribute, value)
    }
  }

  element.replaceWith(anchorNode)
  return anchorNode
}

const createElement = (documentNode: Document, markup: string) => {
  const template = documentNode.createElement('template')
  template.innerHTML = markup.trim()

  return template.content.firstElementChild as HTMLElement | null
}

const replaceChildrenWithMarkup = (
  documentNode: Document,
  container: HTMLElement | null | undefined,
  markup: string,
) => {
  if (!container) {
    return
  }

  const node = createElement(documentNode, `<div>${markup}</div>`)
  if (!node) {
    return
  }

  container.replaceChildren(...Array.from(node.childNodes))
}

const findTourById = (tourId: string | null | undefined) =>
  mockTours.find((tour) => tour.id === tourId) ?? null

const findScheduleById = (scheduleId: string | null | undefined) =>
  mockSchedules.find((schedule) => schedule.id === scheduleId) ?? null

const splitDateLabel = (value: string) => {
  const segments = value.split(/\s+[—-]\s+/)
  if (segments.length < 2) {
    return [value, value]
  }

  return [segments[0], segments.slice(1).join(' - ')]
}

const parseTravelerCount = (value: string) => {
  const match = value.match(/\d+/)
  if (!match) {
    return null
  }

  const parsedValue = Number.parseInt(match[0], 10)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

const getVisibleTravelers = (state: TravelBookMockState) => {
  const travelers = state.travelers.slice(0, state.travelersCount)

  while (travelers.length < state.travelersCount) {
    const position = travelers.length + 1
    travelers.push({
      fullName: `Traveler ${position}`,
      id: `traveler_placeholder_${position}`,
      initials: `T${position}`,
      passportSuffix: `${4100 + position}`,
      role: position === 1 ? 'Lead Traveler' : 'Companion',
    })
  }

  return travelers
}

const getBookingStatusLabel = (booking: Booking) => {
  if (booking.status === 'pending_payment') {
    return 'Pending Payment'
  }

  if (booking.status === 'refund_in_progress') {
    return 'Refund in Progress'
  }

  return 'Confirmed'
}

const getBookingStatusClasses = (booking: Booking) => {
  if (booking.status === 'pending_payment') {
    return 'bg-amber-100 text-amber-700'
  }

  if (booking.status === 'refund_in_progress') {
    return 'bg-amber-50 text-amber-700'
  }

  return 'bg-secondary-container text-on-secondary-container'
}

const getDocumentTone = (document: TravelDocument) => {
  if (document.status === 'verified') {
    return {
      badge: 'bg-secondary/10 text-secondary border border-secondary/20',
      badgeLabel: 'Verified',
      icon: 'verified',
      iconShell: 'bg-blue-50 text-primary',
      primaryAction: 'View',
      secondaryAction: 'Download',
    }
  }

  if (document.status === 'processing') {
    return {
      badge: 'bg-amber-100 text-amber-800 border border-amber-200',
      badgeLabel: 'Processing',
      icon: 'pending',
      iconShell: 'bg-amber-50 text-amber-700',
      primaryAction: 'View Details',
      secondaryAction: '',
    }
  }

  if (document.status === 'expiring') {
    return {
      badge: 'bg-orange-100 text-orange-800 border border-orange-200',
      badgeLabel: 'Expiring Soon',
      icon: 'warning',
      iconShell: 'bg-orange-50 text-orange-700',
      primaryAction: 'Replace',
      secondaryAction: 'View Current',
    }
  }

  return {
    badge: 'bg-slate-100 text-slate-500 border border-slate-200',
    badgeLabel: 'Missing',
    icon: 'not_interested',
    iconShell: 'bg-slate-100 text-slate-400',
    primaryAction: 'Upload',
    secondaryAction: '',
  }
}

const getNotificationTone = (notification: NotificationItem) => {
  if (notification.kind === 'action') {
    return {
      badge: 'bg-error-container/30 text-[#e56c3e] border border-error-container/50',
      badgeLabel: 'Action Required',
      border: 'border-[#e56c3e]',
      icon: 'error_outline',
      iconShell: 'bg-error-container text-error',
    }
  }

  if (notification.kind === 'security') {
    return {
      badge: 'bg-surface-container-highest text-on-surface-variant',
      badgeLabel: notification.read ? 'Security' : 'Unread',
      border: 'border-slate-300',
      icon: 'security',
      iconShell: 'bg-surface-container-highest text-on-surface-variant',
    }
  }

  return {
    badge: 'bg-secondary-container text-on-secondary-container',
    badgeLabel: 'Informational',
    border: 'border-secondary',
    icon: notification.actionType === 'refunds' ? 'payments' : 'verified',
    iconShell: 'bg-secondary-container text-secondary',
  }
}

const getNotificationTargetRoute = (
  notification: NotificationItem,
  state: TravelBookMockState,
) => {
  if (notification.actionType === 'documents') {
    return stitchPages.documents.href
  }

  if (notification.actionType === 'refunds') {
    const refund = getCurrentRefund(state)
    return refund ? refundDetailHref(refund.id) : stitchPages.refunds.href
  }

  if (notification.actionType === 'booking-detail') {
    const booking = getCurrentBooking(state) ?? state.bookings[0]
    return booking ? bookingDetailHref(booking.id) : stitchPages.bookings.href
  }

  if (notification.actionType === 'profile') {
    return stitchPages.profile.href
  }

  if (notification.actionType === 'support') {
    return stitchPages.support.href
  }

  if (notification.actionType === 'bookings') {
    return stitchPages.bookings.href
  }

  return null
}

const renderEmptyState = (message: string) => `
  <div class="rounded-2xl border border-dashed border-outline-variant/60 bg-white p-10 text-center">
    <p class="text-lg font-bold text-primary">No matching items</p>
    <p class="mt-2 text-sm text-on-surface-variant">${escapeHtml(message)}</p>
  </div>
`

const setupCatalogPage = ({ documentNode, navigate }: EnhancerContext): Cleanup => {
  const destinationInput = findInputByPlaceholder(documentNode, 'Where to next?')
  const datesInput = findInputByPlaceholder(documentNode, 'Add dates')
  const travelersInput = findInputByPlaceholder(documentNode, '2 Adults')
  const searchButton = findButtonByText(documentNode, 'Search')
  const durationButton = findButtonByText(documentNode, 'Duration')
  const groupButton = findButtonByText(documentNode, 'Group Size')
  const priceButton = findButtonByText(documentNode, 'Price Range')
  const clearButton = findButtonByText(documentNode, 'Clear all')
  const resultsGrid =
    Array.from(documentNode.querySelectorAll<HTMLElement>('section')).find((section) =>
      section.className.includes('lg:grid-cols-3'),
    ) ?? null

  const render = () => {
    const state = getMockState()
    const visibleTours = getVisibleTours(state)

    if (destinationInput) {
      destinationInput.value = state.catalogFilters.query
    }

    if (datesInput) {
      datesInput.value = state.catalogFilters.datesLabel
    }

    if (travelersInput) {
      travelersInput.value = state.catalogFilters.travelersLabel
    }

    const styleFilterButton = (
      button: HTMLElement | undefined,
      active: boolean,
      tinted = false,
    ) => {
      if (!button) {
        return
      }

      button.className = active
        ? tinted
          ? 'px-5 py-2 rounded-full bg-primary/5 text-primary text-sm font-semibold flex items-center gap-1'
          : 'px-5 py-2 rounded-full border border-primary bg-primary text-white text-sm font-semibold transition-colors'
        : tinted
          ? 'px-5 py-2 rounded-full bg-primary/5 text-primary/60 text-sm font-semibold flex items-center gap-1'
          : 'px-5 py-2 rounded-full border border-outline-variant/30 text-sm font-medium hover:bg-surface-container-high transition-colors'
    }

    styleFilterButton(durationButton, state.catalogFilters.activeFilter === 'duration')
    styleFilterButton(groupButton, state.catalogFilters.activeFilter === 'groupSize')
    styleFilterButton(priceButton, state.catalogFilters.activeFilter === 'priceRange')
    styleFilterButton(
      clearButton,
      Boolean(
        state.catalogFilters.activeFilter ||
          state.catalogFilters.query ||
          state.catalogFilters.datesLabel,
      ),
      true,
    )

    if (!resultsGrid) {
      return
    }

    if (!visibleTours.length) {
      replaceChildrenWithMarkup(
        documentNode,
        resultsGrid,
        renderEmptyState('Try another destination, remove filters, or change traveler count.'),
      )
      return
    }

    replaceChildrenWithMarkup(
      documentNode,
      resultsGrid,
      visibleTours
        .map(
          (tour) => `
            <div class="group relative flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer" data-mock-action="open-tour" data-tour-id="${escapeHtml(tour.id)}" data-router-bridge="${escapeHtml(tourDetailHref(tour.slug))}" role="link" tabindex="0">
              <a
                aria-label="Open ${escapeHtml(tour.title)} details"
                class="absolute inset-0 z-10"
                href="${escapeHtml(tourDetailHref(tour.slug))}"
                data-router-bridge="${escapeHtml(tourDetailHref(tour.slug))}"
                target="_top"
              ></a>
              <div class="relative h-64 overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${escapeHtml(tour.heroImage)}" alt="${escapeHtml(tour.title)}" />
                <div class="absolute top-4 left-4">
                  <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">${escapeHtml(tour.confirmationLabel)}</span>
                </div>
              </div>
              <div class="relative z-20 p-6 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-2 gap-4">
                  <h3 class="font-headline font-bold text-xl text-primary leading-tight">${escapeHtml(tour.title)}</h3>
                  <span class="text-sm font-medium text-on-surface-variant flex items-center gap-1">
                    <span class="material-symbols-outlined text-base">schedule</span>${escapeHtml(tour.durationLabel)}
                  </span>
                </div>
                <p class="text-on-surface-variant text-sm mb-6 line-clamp-2">${escapeHtml(tour.teaser)}</p>
                <div class="mt-auto flex items-center justify-between gap-4">
                  <div>
                    <span class="text-xs font-bold text-primary/40 block uppercase">Starting from</span>
                    <span class="text-2xl font-extrabold text-primary">${escapeHtml(formatPrice(tour.priceFrom, tour.currency))}</span>
                  </div>
                  <a class="relative z-20 bg-surface-container-high hover:bg-primary hover:text-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold transition-all" href="${escapeHtml(tourDetailHref(tour.slug))}" target="_top" data-mock-action="open-tour" data-tour-id="${escapeHtml(tour.id)}" data-router-bridge="${escapeHtml(tourDetailHref(tour.slug))}">View Itinerary</a>
                </div>
              </div>
            </div>
          `,
        )
        .join(''),
    )
  }

  const commitSearch = () => {
    updateCatalogFilters({
      datesLabel: datesInput?.value ?? '',
      query: destinationInput?.value ?? '',
    })

    const travelerCount = parseTravelerCount(travelersInput?.value ?? '')
    if (travelerCount) {
      setTravelersCount(travelerCount)
    }
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const tourButton = targetNode.closest<HTMLElement>('[data-mock-action="open-tour"]')
    if (tourButton) {
      event.preventDefault()
      event.stopPropagation()
      const tour = findTourById(tourButton.dataset.tourId)
      if (!tour) {
        return
      }

      setSelectedTour(tour.id)
      navigate(tourDetailHref(tour.slug))
      return
    }

    const filterButton = targetNode.closest<HTMLElement>('button')
    if (!filterButton) {
      return
    }

    const filterText = getElementText(filterButton)

    if (filterText === 'search') {
      event.preventDefault()
      commitSearch()
      return
    }

    if (filterText === 'duration') {
      event.preventDefault()
      updateCatalogFilters({
        activeFilter:
          getMockState().catalogFilters.activeFilter === 'duration' ? null : 'duration',
      })
      return
    }

    if (filterText === 'group size') {
      event.preventDefault()
      updateCatalogFilters({
        activeFilter:
          getMockState().catalogFilters.activeFilter === 'groupSize' ? null : 'groupSize',
      })
      return
    }

    if (filterText === 'price range') {
      event.preventDefault()
      updateCatalogFilters({
        activeFilter:
          getMockState().catalogFilters.activeFilter === 'priceRange' ? null : 'priceRange',
      })
      return
    }

    if (filterText === 'clear all') {
      event.preventDefault()
      updateCatalogFilters({
        activeFilter: null,
        datesLabel: '',
        query: '',
      })
      setTravelersCount(2)
    }
  }

  const handleDestinationInput = () => {
    updateCatalogFilters({ query: destinationInput?.value ?? '' })
  }

  const handleDatesInput = () => {
    updateCatalogFilters({ datesLabel: datesInput?.value ?? '' })
  }

  const handleTravelersChange = () => {
    commitSearch()
  }

  const unsubscribe = subscribeMockState(render)

  render()

  documentNode.addEventListener('click', handleClick)
  destinationInput?.addEventListener('input', handleDestinationInput)
  datesInput?.addEventListener('input', handleDatesInput)
  travelersInput?.addEventListener('change', handleTravelersChange)
  searchButton?.addEventListener('click', handleTravelersChange)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
    destinationInput?.removeEventListener('input', handleDestinationInput)
    datesInput?.removeEventListener('input', handleDatesInput)
    travelersInput?.removeEventListener('change', handleTravelersChange)
    searchButton?.removeEventListener('click', handleTravelersChange)
  }
}

const setupTourDetailPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const render = () => {
    const tour = getSelectedTour()
    if (!tour) {
      return
    }

    const breadcrumbLabel = documentNode.querySelector<HTMLElement>('nav.mb-6 span.text-primary')
    const heroImage = documentNode.querySelector<HTMLImageElement>('section.relative img')
    const primaryTitle = documentNode.querySelector<HTMLElement>('h1')
    const locationLabel = Array.from(
      documentNode.querySelectorAll<HTMLElement>('div.flex.items-center.gap-2.text-secondary.font-medium'),
    )[0]
    const priceLabel = Array.from(
      documentNode.querySelectorAll<HTMLElement>('p.text-3xl.font-headline.font-extrabold.text-primary'),
    )[0]
    const metricsGrid =
      documentNode.querySelector<HTMLElement>(
        'div.grid.grid-cols-2.md\\:grid-cols-4.gap-6.p-6.bg-surface-container-low.rounded-xl',
      ) ?? null
    const overviewSection = findSectionByHeading(documentNode, 'Experience Overview')
    const itinerarySection = findSectionByHeading(documentNode, 'Trip Itinerary')
    const highlightsSection = findSectionByHeading(documentNode, 'Destination Highlights')

    if (breadcrumbLabel) {
      breadcrumbLabel.textContent = tour.title
    }

    if (heroImage) {
      heroImage.src = tour.heroImage
      heroImage.alt = tour.title
    }

    if (primaryTitle) {
      primaryTitle.textContent = tour.title
    }

    if (locationLabel) {
      locationLabel.innerHTML = `
        <span class="material-symbols-outlined text-lg">location_on</span>
        ${escapeHtml(tour.location)}
      `
    }

    if (priceLabel) {
      priceLabel.textContent = `From ${formatPrice(tour.priceFrom, tour.currency)}`
    }

    if (metricsGrid) {
      replaceChildrenWithMarkup(
        documentNode,
        metricsGrid,
        `
          <div class="space-y-1">
            <p class="text-xs text-on-surface-variant font-label tracking-wide uppercase">Duration</p>
            <p class="font-bold text-primary">${escapeHtml(tour.durationLabel)}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs text-on-surface-variant font-label tracking-wide uppercase">Group Size</p>
            <p class="font-bold text-primary">${escapeHtml(tour.groupSizeLabel)}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs text-on-surface-variant font-label tracking-wide uppercase">Activity Level</p>
            <p class="font-bold text-primary">${escapeHtml(tour.activityLevel)}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs text-on-surface-variant font-label tracking-wide uppercase">Availability</p>
            <p class="font-bold text-secondary">${escapeHtml(tour.availabilityLabel)}</p>
          </div>
        `,
      )
    }

    const overviewContainer =
      overviewSection?.querySelector<HTMLElement>('div.prose') ?? null
    replaceChildrenWithMarkup(
      documentNode,
      overviewContainer,
      tour.overview
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join(''),
    )

    const itineraryContainer =
      itinerarySection?.querySelector<HTMLElement>('div.space-y-6') ?? null
    replaceChildrenWithMarkup(
      documentNode,
      itineraryContainer,
      tour.itinerary
        .map(
          (stop, index) => `
            <div class="group flex gap-6">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">${index + 1}</div>
                <div class="w-px h-full bg-outline-variant mt-2 ${index === tour.itinerary.length - 1 ? 'hidden' : ''}"></div>
              </div>
              <div class="pb-8">
                <h4 class="font-headline font-bold text-lg text-primary mb-2">${escapeHtml(stop.title)}</h4>
                <p class="text-on-surface-variant text-sm leading-relaxed">${escapeHtml(stop.description)}</p>
              </div>
            </div>
          `,
        )
        .join(''),
    )

    const highlightsGrid =
      highlightsSection?.querySelector<HTMLElement>('div.grid') ?? null
    replaceChildrenWithMarkup(
      documentNode,
      highlightsGrid,
      tour.highlights
        .map(
          (highlight) => `
            <div class="group rounded-2xl overflow-hidden bg-surface-container shadow-sm">
              <div class="h-48 overflow-hidden">
                <img alt="${escapeHtml(highlight.title)}" class="w-full h-full object-cover" src="${escapeHtml(highlight.image)}" />
              </div>
              <div class="p-6">
                <h4 class="font-headline font-bold text-primary mb-2">${escapeHtml(highlight.title)}</h4>
                <p class="text-sm text-on-surface-variant">${escapeHtml(highlight.description)}</p>
              </div>
            </div>
          `,
        )
        .join(''),
    )

    const schedulesRoute = tourSchedulesHref(tour.slug)
    findButtonsByText(documentNode, 'View Schedules').forEach((button) => {
      ensureAnchorRoute(documentNode, button, schedulesRoute)
    })
  }

  const unsubscribe = subscribeMockState(render)
  render()

  return () => {
    unsubscribe()
  }
}

const setupSchedulesPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const headerTitle = documentNode.querySelector<HTMLElement>('h1')
  const scheduleContainer =
    documentNode.querySelector<HTMLElement>('div.lg\\:col-span-2.space-y-4') ?? null
  const summaryCard =
    documentNode.querySelector<HTMLElement>('aside .bg-surface-container-low.rounded-xl.p-8.space-y-8') ??
    null

  const render = () => {
    const state = getMockState()
    const tour = getSelectedTour(state)
    const schedules = getSchedulesForSelectedTour(state)
    const selectedSchedule = getSelectedSchedule(state)

    if (!tour) {
      return
    }

    const backButton = findButtonByText(documentNode, 'Back to Tour Details')
    if (backButton) {
      ensureAnchorRoute(documentNode, backButton, tourDetailHref(tour.slug))
    }

    if (headerTitle) {
      headerTitle.textContent = tour.title
    }

    const metaLabels = Array.from(
      documentNode.querySelectorAll<HTMLElement>('header .flex.items-center.gap-1\\.5 span.font-medium'),
    )
    if (metaLabels[0]) {
      metaLabels[0].textContent = tour.durationLabel
    }
    if (metaLabels[1]) {
      metaLabels[1].textContent = tour.location
    }

    replaceChildrenWithMarkup(
      documentNode,
      scheduleContainer,
      `
        <h2 class="text-xl font-bold font-headline mb-6">Select Departure Date</h2>
        ${schedules
          .map((schedule) => {
            const isSelected = schedule.id === selectedSchedule?.id
            return `
              <div
                class="${isSelected ? 'bg-surface-container-lowest border-2 border-secondary shadow-sm' : 'bg-surface-container border border-transparent hover:border-outline-variant cursor-pointer'} rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
                data-mock-action="select-schedule"
                data-schedule-id="${escapeHtml(schedule.id)}"
                role="button"
                tabindex="0"
              >
                <div class="flex-1 flex gap-8 items-center">
                  <div class="flex items-center justify-center w-12 h-12 rounded-full ${isSelected ? 'bg-secondary/10 text-secondary' : 'bg-white text-outline'}">
                    <span class="material-symbols-outlined" style="${isSelected ? "font-variation-settings: 'FILL' 1;" : ''}">${isSelected ? 'check_circle' : 'calendar_today'}</span>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm font-semibold text-outline tracking-wider uppercase">${escapeHtml(schedule.label)}</div>
                    <div class="text-lg font-bold">${escapeHtml(schedule.title)}</div>
                    <div class="text-xs text-on-surface-variant">${schedule.seatsLeft} seats left</div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full ${schedule.availability === 'limited' ? 'bg-amber-100 text-amber-800' : 'bg-secondary-container text-on-secondary-container'} text-xs font-bold uppercase tracking-tight">
                    ${schedule.availability === 'limited' ? 'Limited Availability' : 'Instant Confirmation'}
                  </span>
                  <div class="text-2xl font-extrabold text-primary">${escapeHtml(formatPrice(schedule.unitPrice, schedule.currency))}<span class="text-sm font-normal text-on-surface-variant tracking-normal"> / person</span></div>
                </div>
              </div>
            `
          })
          .join('')}
      `,
    )

    if (!summaryCard || !selectedSchedule) {
      return
    }

    const totalAmount = selectedSchedule.unitPrice * state.travelersCount
    replaceChildrenWithMarkup(
      documentNode,
      summaryCard,
      `
        <div class="space-y-4">
          <h3 class="text-xl font-bold font-headline">Summary</h3>
          <div class="relative w-full h-40 rounded-lg overflow-hidden">
            <img alt="${escapeHtml(tour.title)}" class="w-full h-full object-cover" src="${escapeHtml(tour.heroImage)}" />
          </div>
          <div class="pt-4 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">Dates</span>
              <span class="font-bold text-primary">${escapeHtml(selectedSchedule.label)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">Guests</span>
              <span class="font-bold text-primary">${state.travelersCount} Travelers</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-on-surface-variant">Selected Cabin</span>
              <span class="font-bold text-primary">${escapeHtml(selectedSchedule.title)}</span>
            </div>
            <div class="border-t border-outline-variant/30 pt-3 flex justify-between items-baseline">
              <span class="font-bold text-primary">Total Amount</span>
              <div class="text-right">
                <div class="text-2xl font-black text-primary">${escapeHtml(formatPrice(totalAmount, selectedSchedule.currency))}</div>
                <div class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">VAT Inclusive</div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <a class="w-full inline-flex items-center justify-center py-4 navy-gradient text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 no-underline" href="${escapeHtml(checkoutHref(tour.slug))}" target="_top" data-router-bridge="${escapeHtml(checkoutHref(tour.slug))}">
            Continue to Booking
          </a>
          <p class="text-[11px] text-center text-on-surface-variant px-4 leading-relaxed">
            By proceeding, you agree to our booking terms and cancellation policies for this departure.
          </p>
        </div>
      `,
    )
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const scheduleButton = targetNode.closest<HTMLElement>('[data-mock-action="select-schedule"]')
    if (!scheduleButton?.dataset.scheduleId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    setSelectedSchedule(scheduleButton.dataset.scheduleId)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    const targetNode = event.target
    if (!(targetNode instanceof HTMLElement)) {
      return
    }

    const scheduleId = targetNode.dataset.scheduleId
    if (!scheduleId) {
      return
    }

    event.preventDefault()
    setSelectedSchedule(scheduleId)
  }

  const unsubscribe = subscribeMockState(render)
  render()

  documentNode.addEventListener('click', handleClick)
  documentNode.addEventListener('keydown', handleKeyDown)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
    documentNode.removeEventListener('keydown', handleKeyDown)
  }
}

const setupCheckoutPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const backButton = findButtonByText(documentNode, 'Back to Schedules')
  const selectionCard =
    findButtonByText(documentNode, 'Edit Selection')?.closest<HTMLElement>('div.bg-surface-container-lowest') ??
    null
  const travelerCard =
    findButtonByText(documentNode, 'Modify Details')?.closest<HTMLElement>('div.bg-surface-container-lowest') ??
    null
  const priceCard =
    findButtonByText(documentNode, 'Continue to Payment')?.closest<HTMLElement>('div.bg-surface-container-lowest') ??
    null

  const render = () => {
    const state = getMockState()
    const tour = getSelectedTour(state)
    const schedule = getSelectedSchedule(state)
    const travelers = getVisibleTravelers(state)

    if (!tour || !schedule) {
      return
    }

    setBridgeRoute(backButton, tourSchedulesHref(tour.slug))

    const subtotal = schedule.unitPrice * state.travelersCount
    const taxes = Math.round(subtotal * 0.081 * 100) / 100
    const total = subtotal + taxes

    replaceChildrenWithMarkup(
      documentNode,
      selectionCard,
      `
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
            <img alt="${escapeHtml(tour.title)}" class="w-full h-full object-cover" src="${escapeHtml(tour.heroImage)}" />
          </div>
          <div class="flex-1 space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <span class="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full mb-2 tracking-wide uppercase">Tour Details</span>
                <h2 class="text-2xl font-bold font-headline text-primary">${escapeHtml(tour.title)}</h2>
              </div>
              <button class="text-secondary font-semibold text-sm hover:underline" data-router-bridge="${escapeHtml(tourSchedulesHref(tour.slug))}">Edit Selection</button>
            </div>
            <div class="grid grid-cols-2 gap-y-4 gap-x-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div>
                  <p class="text-xs text-outline font-medium uppercase tracking-wider">Destination</p>
                  <p class="font-bold">${escapeHtml(tour.location)}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">calendar_today</span>
                </div>
                <div>
                  <p class="text-xs text-outline font-medium uppercase tracking-wider">Dates</p>
                  <p class="font-bold">${escapeHtml(schedule.label)}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">schedule</span>
                </div>
                <div>
                  <p class="text-xs text-outline font-medium uppercase tracking-wider">Duration</p>
                  <p class="font-bold">${escapeHtml(tour.durationLabel)}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary">group</span>
                </div>
                <div>
                  <p class="text-xs text-outline font-medium uppercase tracking-wider">Guests</p>
                  <p class="font-bold">${state.travelersCount} Travelers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      travelerCard,
      `
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold font-headline text-primary">Traveler Information</h3>
          <button class="text-secondary font-semibold text-sm hover:underline" data-router-bridge="${escapeHtml(stitchPages.travelers.href)}">Modify Details</button>
        </div>
        <div class="space-y-6">
          ${travelers
            .map(
              (traveler) => `
                <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full ${traveler.role === 'Lead Traveler' ? 'bg-primary-container text-white' : 'bg-outline-variant text-primary'} flex items-center justify-center font-bold text-lg">${escapeHtml(traveler.initials)}</div>
                    <div>
                      <p class="font-bold text-primary">${escapeHtml(traveler.fullName)}</p>
                      <p class="text-sm text-outline">${escapeHtml(traveler.role)}</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-teal-600">check_circle</span>
                </div>
              `,
            )
            .join('')}
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      priceCard,
      `
        <h3 class="text-xl font-bold font-headline text-primary mb-6">Price Summary</h3>
        <div class="space-y-4 mb-8">
          <div class="flex justify-between items-center text-on-surface-variant">
            <span>${escapeHtml(schedule.title)}</span>
            <span class="font-medium">${escapeHtml(formatPrice(subtotal, schedule.currency))}</span>
          </div>
          <div class="flex justify-between items-center text-on-surface-variant">
            <span>Port Fees &amp; Taxes</span>
            <span class="font-medium">${escapeHtml(formatPrice(taxes, schedule.currency))}</span>
          </div>
          <div class="flex justify-between items-center text-on-surface-variant">
            <span>Travel Protection</span>
            <span class="text-teal-600 font-semibold">Included</span>
          </div>
          <div class="pt-4 border-t border-outline-variant/20 flex justify-between items-end">
            <div>
              <p class="text-xs text-outline font-bold uppercase tracking-widest">Total Amount</p>
              <p class="text-3xl font-extrabold font-headline text-primary">${escapeHtml(formatPrice(total, schedule.currency))}</p>
            </div>
            <span class="text-xs text-outline pb-1 font-medium">${escapeHtml(schedule.currency)}</span>
          </div>
        </div>
        <button class="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity" data-router-bridge="${escapeHtml(stitchPages.payment.href)}">
          Continue to Payment
        </button>
      `,
    )
  }

  const unsubscribe = subscribeMockState(render)
  render()

  return () => {
    unsubscribe()
  }
}

const setupPaymentPage = ({ documentNode, navigate }: EnhancerContext): Cleanup => {
  const cardMethod = findButtonByText(documentNode, 'Credit Card')
  const paypalMethod = findButtonByText(documentNode, 'PayPal')
  const bankMethod = findButtonByText(documentNode, 'Bank Transfer')
  const cardholderInput = findFieldByLabel(documentNode, 'Cardholder Name') as HTMLInputElement | null
  const cardNumberInput = findFieldByLabel(documentNode, 'Card Number') as HTMLInputElement | null
  const expiryInput = findFieldByLabel(documentNode, 'Expiry Date') as HTMLInputElement | null
  const cvvInput = findFieldByLabel(documentNode, 'CVV') as HTMLInputElement | null
  const backToReview = findButtonByText(documentNode, 'Back to Review')
  const completeButton = findButtonByText(documentNode, 'Complete Payment')
  const summaryCard =
    documentNode.querySelector<HTMLElement>('aside .bg-surface-container-lowest.rounded-2xl') ?? null

  const render = () => {
    const state = getMockState()
    const tour = getSelectedTour(state)
    const schedule = getSelectedSchedule(state)
    const paymentDraft = state.paymentDraft

    if (!tour || !schedule) {
      return
    }

    const styleMethodButton = (
      button: HTMLElement | undefined,
      active: boolean,
      icon: string,
      label: string,
    ) => {
      if (!button) {
        return
      }

      replaceChildrenWithMarkup(
        documentNode,
        button,
        `
          <span class="material-symbols-outlined ${active ? 'text-primary' : 'text-outline'}">${icon}</span>
          <span class="${active ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant'}">${label}</span>
        `,
      )

      button.className = active
        ? 'flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary-fixed/30 transition-all duration-300'
        : 'flex items-center gap-3 p-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition-all duration-300'
    }

    styleMethodButton(cardMethod, paymentDraft.method === 'card', 'credit_card', 'Credit Card')
    styleMethodButton(
      paypalMethod,
      paymentDraft.method === 'paypal',
      'account_balance_wallet',
      'PayPal',
    )
    styleMethodButton(
      bankMethod,
      paymentDraft.method === 'bank',
      'account_balance',
      'Bank Transfer',
    )

    if (cardholderInput) {
      cardholderInput.value = paymentDraft.cardholder
    }
    if (cardNumberInput) {
      cardNumberInput.value = paymentDraft.cardNumber
    }
    if (expiryInput) {
      expiryInput.value = paymentDraft.expiry
    }
    if (cvvInput) {
      cvvInput.value = paymentDraft.cvv
    }

    setBridgeRoute(backToReview, checkoutHref(tour.slug))

    if (completeButton) {
      clearBridgeRoute(completeButton)
      completeButton.dataset.mockAction = 'complete-payment'
    }

    const subtotal = schedule.unitPrice * state.travelersCount
    const taxes = Math.round(subtotal * 0.081 * 100) / 100
    const total = subtotal + taxes

    replaceChildrenWithMarkup(
      documentNode,
      summaryCard,
      `
        <div class="space-y-6">
          <div class="relative w-full h-32 rounded-xl overflow-hidden mb-6">
            <img alt="${escapeHtml(tour.title)}" class="w-full h-full object-cover" src="${escapeHtml(tour.heroImage)}" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div class="absolute bottom-3 left-4">
              <h3 class="text-white font-manrope font-extrabold text-lg">${escapeHtml(tour.title)}</h3>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary/60">calendar_today</span>
              <div>
                <p class="text-xs font-bold text-primary/40 uppercase tracking-widest">Date</p>
                <p class="text-on-surface font-semibold">${escapeHtml(schedule.label)}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary/60">group</span>
              <div>
                <p class="text-xs font-bold text-primary/40 uppercase tracking-widest">Guests</p>
                <p class="text-on-surface font-semibold">${state.travelersCount} Travelers</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-primary/60">payments</span>
              <div>
                <p class="text-xs font-bold text-primary/40 uppercase tracking-widest">Method</p>
                <p class="text-on-surface font-semibold">${paymentDraft.method === 'card' ? 'Credit Card' : paymentDraft.method === 'paypal' ? 'PayPal' : 'Bank Transfer'}</p>
              </div>
            </div>
          </div>
          <div class="pt-6 border-t border-surface-variant/50 space-y-3">
            <div class="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span class="font-inter font-medium">${escapeHtml(formatPrice(subtotal, schedule.currency))}</span>
            </div>
            <div class="flex justify-between text-sm text-on-surface-variant">
              <span>Taxes &amp; Fees</span>
              <span class="font-inter font-medium">${escapeHtml(formatPrice(taxes, schedule.currency))}</span>
            </div>
            <div class="flex justify-between items-center pt-4">
              <span class="text-lg font-manrope font-bold text-primary">Total Amount</span>
              <span class="text-2xl font-manrope font-extrabold text-primary">${escapeHtml(formatPrice(total, schedule.currency))}</span>
            </div>
          </div>
          <button class="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-manrope font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" data-mock-action="complete-payment">
            Complete Payment
          </button>
        </div>
      `,
    )
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const targetButton = targetNode.closest<HTMLElement>('button, a')
    if (!targetButton) {
      return
    }

    const buttonText = getElementText(targetButton)

    if (buttonText === normalizeText('Credit Card')) {
      event.preventDefault()
      event.stopPropagation()
      updatePaymentDraft({ method: 'card' })
      return
    }

    if (buttonText === normalizeText('PayPal')) {
      event.preventDefault()
      event.stopPropagation()
      updatePaymentDraft({ method: 'paypal' })
      return
    }

    if (buttonText === normalizeText('Bank Transfer')) {
      event.preventDefault()
      event.stopPropagation()
      updatePaymentDraft({ method: 'bank' })
      return
    }

    const paymentButton = targetNode.closest<HTMLElement>('[data-mock-action="complete-payment"]')
    if (!paymentButton) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    const result = completeMockPayment()
    if (result) {
      navigate(result.nextHref)
    }
  }

  const handleInput = () => {
    updatePaymentDraft({
      cardNumber: cardNumberInput?.value ?? '',
      cardholder: cardholderInput?.value ?? '',
      cvv: cvvInput?.value ?? '',
      expiry: expiryInput?.value ?? '',
    })
  }

  const unsubscribe = subscribeMockState(render)
  render()

  documentNode.addEventListener('click', handleClick)
  cardholderInput?.addEventListener('input', handleInput)
  cardNumberInput?.addEventListener('input', handleInput)
  expiryInput?.addEventListener('input', handleInput)
  cvvInput?.addEventListener('input', handleInput)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
    cardholderInput?.removeEventListener('input', handleInput)
    cardNumberInput?.removeEventListener('input', handleInput)
    expiryInput?.removeEventListener('input', handleInput)
    cvvInput?.removeEventListener('input', handleInput)
  }
}

const setupPaymentSuccessPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const render = () => {
    const state = getMockState()
    const booking = getCurrentBooking(state)
    const tour = findTourById(booking?.tourId)
    const schedule = findScheduleById(booking?.scheduleId)

    if (!booking || !tour || !schedule) {
      return
    }

    const backButton = findButtonByText(documentNode, 'Back')
    setBridgeRoute(backButton, stitchPages.accountDashboard.href)

    const summaryCard =
      documentNode.querySelector<HTMLElement>('div.bg-surface-container-lowest.rounded-2xl.p-8.shadow-sm') ??
      null
    const paymentCard =
      documentNode.querySelector<HTMLElement>('div.bg-primary.text-white.rounded-2xl.p-8.h-full') ??
      null
    const manageSection = findSectionByHeading(documentNode, 'Manage Your Trip')

    const taxes = Math.round(booking.amountPaid * 0.081 * 100) / 100
    const subtotal = booking.amountPaid - taxes

    replaceChildrenWithMarkup(
      documentNode,
      summaryCard,
      `
        <div class="flex flex-col md:flex-row gap-6 mb-8">
          <div class="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
            <img alt="${escapeHtml(tour.title)}" class="w-full h-full object-cover" src="${escapeHtml(tour.heroImage)}" />
          </div>
          <div class="flex-1">
            <span class="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">${escapeHtml(getBookingStatusLabel(booking))}</span>
            <h2 class="font-headline text-2xl font-bold text-primary mb-1">${escapeHtml(tour.title)}</h2>
            <p class="text-on-surface-variant flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-sm">location_on</span>
              ${escapeHtml(tour.location)}
            </p>
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-surface-variant">
              <div>
                <p class="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Booking Ref</p>
                <p class="font-semibold text-primary">${escapeHtml(booking.reference)}</p>
              </div>
              <div>
                <p class="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Date</p>
                <p class="font-semibold text-primary">${escapeHtml(schedule.label)}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-surface-variant">
          <div>
            <p class="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Travelers</p>
            <p class="font-medium">${booking.travelersCount} Travelers</p>
          </div>
          <div>
            <p class="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Departure</p>
            <p class="font-medium">${escapeHtml(schedule.title)}</p>
          </div>
          <div>
            <p class="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Status</p>
            <p class="font-medium">${escapeHtml(booking.paymentLabel)}</p>
          </div>
          <div>
            <p class="text-[10px] font-label uppercase tracking-widest text-outline mb-1">Check-in</p>
            <p class="font-medium">14:00 PM</p>
          </div>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      paymentCard,
      `
        <div>
          <h3 class="font-headline text-lg font-bold mb-6 flex items-center justify-between">
            Payment Details
            <span class="material-symbols-outlined text-secondary">verified</span>
          </h3>
          <div class="space-y-4 mb-8">
            <div class="flex justify-between items-center text-sm">
              <span class="opacity-70">Subtotal</span>
              <span>${escapeHtml(formatPrice(subtotal, booking.currency))}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="opacity-70">Taxes &amp; Fees</span>
              <span>${escapeHtml(formatPrice(taxes, booking.currency))}</span>
            </div>
            <div class="pt-4 border-t border-white/10 flex justify-between items-center text-xl font-bold">
              <span>Total Paid</span>
              <span>${escapeHtml(formatPrice(booking.amountPaid, booking.currency))}</span>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[10px] font-label uppercase tracking-widest opacity-60">
            <span>Transaction ID</span>
            <span>TXN_${escapeHtml(booking.id.replace(/\D+/g, ''))}</span>
          </div>
          <div class="flex justify-between items-center text-[10px] font-label uppercase tracking-widest opacity-60">
            <span>Payment Method</span>
            <span class="flex items-center gap-1">VISA •••• 4242</span>
          </div>
          <div class="mt-4 p-3 bg-white/5 rounded-lg text-[11px] text-center opacity-70 leading-relaxed">
            Confirmation was sent to ${escapeHtml(state.profile.email)}.
          </div>
        </div>
      `,
    )

    const manageGrid = manageSection?.querySelector<HTMLElement>('div.grid')
    replaceChildrenWithMarkup(
      documentNode,
      manageGrid,
      `
        <div class="group bg-white p-6 rounded-2xl border border-surface-variant hover:border-secondary transition-colors cursor-pointer flex items-center gap-4" data-router-bridge="${escapeHtml(stitchPages.vouchers.href)}">
          <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors">
            <span class="material-symbols-outlined text-primary group-hover:text-secondary">confirmation_number</span>
          </div>
          <div>
            <p class="font-bold text-primary">Access Vouchers</p>
            <p class="text-xs text-on-surface-variant">Digital tickets &amp; passes</p>
          </div>
        </div>
        <div class="group bg-white p-6 rounded-2xl border border-surface-variant hover:border-secondary transition-colors cursor-pointer flex items-center gap-4" data-router-bridge="${escapeHtml(stitchPages.accountDashboard.href)}">
          <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors">
            <span class="material-symbols-outlined text-primary group-hover:text-secondary">dashboard</span>
          </div>
          <div>
            <p class="font-bold text-primary">Travel Dashboard</p>
            <p class="text-xs text-on-surface-variant">Full itinerary &amp; docs</p>
          </div>
        </div>
        <div class="group bg-white p-6 rounded-2xl border border-surface-variant hover:border-secondary transition-colors cursor-pointer flex items-center gap-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100" data-router-bridge="${escapeHtml(stitchPages.accountDashboard.href)}">
          <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors">
            <span class="material-symbols-outlined text-primary group-hover:text-secondary">calendar_month</span>
          </div>
          <div>
            <p class="font-bold text-primary">Sync Calendar</p>
            <p class="text-xs text-on-surface-variant">Add trip to your schedule</p>
          </div>
        </div>
      `,
    )

    setBridgeRoute(findButtonByText(documentNode, 'View Booking Details'), bookingDetailHref(booking.id))
    setBridgeRoute(findButtonByText(documentNode, 'Return to Home'), stitchPages.home.href)
  }

  const unsubscribe = subscribeMockState(render)
  render()

  return () => {
    unsubscribe()
  }
}

const setupDashboardPage = ({ documentNode, navigate }: EnhancerContext): Cleanup => {
  const reviewStatusButton = findButtonByText(documentNode, 'Review Status')
  const editProfileButton = findButtonByText(documentNode, 'Edit Profile')
  const accessVouchersButton = findButtonByText(documentNode, 'Access Vouchers')
  const uploadDocumentsButton = findButtonByText(documentNode, 'Upload Documents')
  const viewAllButton = findButtonByText(documentNode, 'View All')
  const bookingsColumn = viewAllButton?.parentElement?.parentElement as HTMLElement | null

  const render = () => {
    const state = getMockState()
    const bookingsSummary = getBookingsSummary(state)
    const documentSummary = getDocumentSummary(state)
    const visibleBookings = state.bookings.slice(0, 3)

    setBridgeRoute(reviewStatusButton, stitchPages.documents.href)
    setBridgeRoute(editProfileButton, stitchPages.profile.href)
    setBridgeRoute(accessVouchersButton, stitchPages.vouchers.href)
    setBridgeRoute(uploadDocumentsButton, stitchPages.documents.href)
    setBridgeRoute(viewAllButton, stitchPages.bookings.href)
    setBridgeRoute(findButtonByText(documentNode, 'Manage Travelers'), stitchPages.travelers.href)
    setBridgeRoute(findButtonByText(documentNode, 'Contact Support'), stitchPages.support.href)

    const welcomeParagraph = Array.from(documentNode.querySelectorAll<HTMLElement>('p')).find((node) =>
      normalizeText(node.textContent ?? '').includes('welcome back'),
    )
    if (welcomeParagraph) {
      welcomeParagraph.textContent = `Welcome back, ${state.profile.fullName.split(' ')[0]}. Here is your travel overview.`
    }

    const profileCard = editProfileButton?.closest<HTMLElement>('div.bg-surface-container-lowest') ?? null
    replaceChildrenWithMarkup(
      documentNode,
      profileCard,
      `
        <div class="relative mb-6">
          <div class="w-24 h-24 rounded-full border-4 border-surface-container p-1">
            <img alt="${escapeHtml(state.profile.fullName)}" class="w-full h-full object-cover rounded-full" src="${escapeHtml(state.profile.avatarUrl)}" />
          </div>
        </div>
        <h3 class="text-xl font-bold text-primary">${escapeHtml(state.profile.fullName)}</h3>
        <p class="text-outline text-sm mb-6">${escapeHtml(`${state.profile.city}, ${state.profile.country}`)}</p>
        <div class="w-full grid grid-cols-1 gap-4 mb-6">
          <div class="bg-surface-container-low py-3 rounded-xl">
            <p class="text-[10px] uppercase tracking-widest text-outline font-bold">Total Trips</p>
            <p class="text-sm font-bold text-primary">${state.bookings.length} Trips</p>
          </div>
        </div>
        <button class="w-full py-2.5 border border-outline-variant text-primary rounded-lg font-bold text-sm hover:bg-surface-container transition-colors" data-router-bridge="${escapeHtml(stitchPages.profile.href)}">
          Edit Profile
        </button>
      `,
    )

    const activeBookingsCard = Array.from(
      documentNode.querySelectorAll<HTMLElement>('div.bg-surface-container.p-8.rounded-2xl'),
    ).find((card) => normalizeText(card.textContent ?? '').includes('active bookings'))
    replaceChildrenWithMarkup(
      documentNode,
      activeBookingsCard,
      `
        <span class="material-symbols-outlined text-primary text-3xl">flight_takeoff</span>
        <div>
          <p class="text-3xl font-extrabold text-primary">${String(bookingsSummary.activeCount).padStart(2, '0')}</p>
          <p class="text-outline font-medium">Active Bookings</p>
        </div>
      `,
    )

    const documentStatusCard =
      documentNode.querySelector<HTMLElement>('div.bg-secondary-container.p-8.rounded-2xl') ?? null
    replaceChildrenWithMarkup(
      documentNode,
      documentStatusCard,
      `
        <span class="material-symbols-outlined text-on-secondary-container text-3xl">fact_check</span>
        <div>
          <p class="text-3xl font-extrabold text-on-secondary-container uppercase">${documentSummary.actionRequiredCount ? 'Action Required' : 'Ready'}</p>
          <p class="text-on-secondary-fixed-variant font-medium">Document Status</p>
        </div>
      `,
    )

    const vouchersCard = accessVouchersButton?.closest<HTMLElement>('div.col-span-2') ?? null
    replaceChildrenWithMarkup(
      documentNode,
      vouchersCard,
      `
        <div class="flex items-center gap-6">
          <div class="h-16 w-16 bg-tertiary-fixed rounded-2xl flex items-center justify-center">
            <span class="material-symbols-outlined text-on-tertiary-fixed text-3xl">confirmation_number</span>
          </div>
          <div>
            <h4 class="text-lg font-bold text-primary">Digital Vouchers</h4>
            <p class="text-outline text-sm">${bookingsSummary.vouchersReady} travel vouchers are ready for your upcoming trips.</p>
          </div>
        </div>
        <div class="text-right">
          <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" data-router-bridge="${escapeHtml(stitchPages.vouchers.href)}">Access Vouchers</button>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      bookingsColumn,
      `
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold text-primary">Upcoming Bookings</h3>
          <a class="text-sm font-semibold text-secondary hover:underline" href="${escapeHtml(stitchPages.bookings.href)}" data-router-bridge="${escapeHtml(stitchPages.bookings.href)}">View All</a>
        </div>
        ${visibleBookings
          .map((booking) => {
            const tour = findTourById(booking.tourId)
            return `
              <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group gap-6">
                <div class="flex items-center gap-6">
                  <div class="h-16 w-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img alt="${escapeHtml(booking.title)}" class="w-full h-full object-cover" src="${escapeHtml(tour?.heroImage ?? '')}" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-outline uppercase tracking-widest">${escapeHtml(booking.reference)}</p>
                    <h4 class="text-lg font-bold text-primary">${escapeHtml(booking.title)}</h4>
                    <p class="text-sm text-outline">${escapeHtml(booking.datesLabel)}</p>
                  </div>
                </div>
                <div class="flex items-center gap-10">
                  <div class="text-right">
                    <p class="font-bold text-primary">${escapeHtml(formatPrice(booking.amountPaid, booking.currency))}</p>
                    <p class="text-xs text-outline">${escapeHtml(getBookingStatusLabel(booking))}</p>
                  </div>
                  <button class="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity" data-mock-action="dashboard-booking" data-booking-id="${escapeHtml(booking.id)}">View Detail</button>
                </div>
              </div>
            `
          })
          .join('')}
      `,
    )
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const bookingButton = targetNode.closest<HTMLElement>('[data-mock-action="dashboard-booking"]')
    if (!bookingButton?.dataset.bookingId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    navigate(bookingDetailHref(bookingButton.dataset.bookingId))
  }

  const unsubscribe = subscribeMockState(render)
  render()
  documentNode.addEventListener('click', handleClick)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
  }
}

const setupBookingsPage = ({ documentNode, navigate }: EnhancerContext): Cleanup => {
  let activeTab: 'upcoming' | 'past' | 'cancelled' = 'upcoming'
  let searchTerm = ''

  const searchInput = findInputByPlaceholder(documentNode, 'Search trips')
  const upcomingButton = findButtonByText(documentNode, 'Upcoming')
  const pastButton = findButtonByText(documentNode, 'Past')
  const cancelledButton = findButtonByText(documentNode, 'Cancelled')
  const listContainer =
    Array.from(documentNode.querySelectorAll<HTMLElement>('div.space-y-6')).find((container) =>
      normalizeText(container.textContent ?? '').includes('view detail'),
    ) ?? null

  const styleTabButton = (button: HTMLElement | undefined, active: boolean) => {
    if (!button) {
      return
    }

    button.className = active
      ? 'px-8 py-2.5 rounded-xl text-sm font-semibold bg-white text-primary shadow-soft transition-all'
      : 'px-8 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-primary transition-all'
  }

  const getCategory = (booking: Booking, index: number) => {
    if (booking.status === 'refund_in_progress') {
      return 'cancelled' as const
    }

    if (booking.status === 'pending_payment' || index === 0) {
      return 'upcoming' as const
    }

    return 'past' as const
  }

  const render = () => {
    const state = getMockState()
    const normalizedQuery = normalizeText(searchTerm)
    const visibleBookings = state.bookings.filter((booking, index) => {
      const category = getCategory(booking, index)
      const searchMatch =
        !normalizedQuery ||
        normalizeText(`${booking.reference} ${booking.title} ${booking.datesLabel}`).includes(
          normalizedQuery,
        )

      return category === activeTab && searchMatch
    })

    if (searchInput) {
      searchInput.value = searchTerm
    }

    styleTabButton(upcomingButton, activeTab === 'upcoming')
    styleTabButton(pastButton, activeTab === 'past')
    styleTabButton(cancelledButton, activeTab === 'cancelled')

    if (!listContainer) {
      return
    }

    if (!visibleBookings.length) {
      replaceChildrenWithMarkup(
        documentNode,
        listContainer,
        renderEmptyState('Switch the tab or search for another booking reference.'),
      )
      return
    }

    replaceChildrenWithMarkup(
      documentNode,
      listContainer,
      visibleBookings
        .map((booking) => {
          const tour = findTourById(booking.tourId)
          return `
            <div class="bg-white rounded-2xl p-6 shadow-soft group hover:translate-y-[-2px] transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-8 border-none">
              <div class="w-full lg:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                <img alt="${escapeHtml(booking.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${escapeHtml(tour?.heroImage ?? '')}" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference</span>
                  <p class="font-manrope font-bold text-primary">${escapeHtml(booking.reference)}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trip Name</span>
                  <h3 class="font-manrope font-bold text-primary leading-tight">${escapeHtml(booking.title)}</h3>
                  <p class="text-xs text-slate-500">${escapeHtml(tour?.country ?? 'TravelBook')}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dates &amp; Guests</span>
                  <p class="text-sm font-medium text-slate-700">${escapeHtml(booking.datesLabel)}</p>
                  <p class="text-xs text-slate-500 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">group</span>
                    ${booking.travelersCount} Travelers
                  </p>
                </div>
                <div class="flex items-center">
                  <span class="px-4 py-1.5 rounded-full ${getBookingStatusClasses(booking)} text-xs font-bold font-manrope">${escapeHtml(getBookingStatusLabel(booking))}</span>
                </div>
              </div>
              <div class="flex lg:flex-col gap-2 shrink-0">
                <button class="bg-primary-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap" data-mock-action="booking-detail" data-booking-id="${escapeHtml(booking.id)}">View Detail</button>
                <div class="flex gap-2">
                  <button class="p-2.5 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container transition-colors" data-router-bridge="${escapeHtml(stitchPages.vouchers.href)}" title="Get Vouchers">
                    <span class="material-symbols-outlined text-xl">confirmation_number</span>
                  </button>
                  <button class="p-2.5 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container transition-colors" data-router-bridge="${escapeHtml(stitchPages.documents.href)}" title="Check Documents">
                    <span class="material-symbols-outlined text-xl">description</span>
                  </button>
                </div>
              </div>
            </div>
          `
        })
        .join(''),
    )
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const bookingButton = targetNode.closest<HTMLElement>('[data-mock-action="booking-detail"]')
    if (bookingButton?.dataset.bookingId) {
      event.preventDefault()
      event.stopPropagation()
      navigate(bookingDetailHref(bookingButton.dataset.bookingId))
      return
    }

    const button = targetNode.closest<HTMLElement>('button')
    if (!button) {
      return
    }

    const label = getElementText(button)
    if (label === 'upcoming') {
      activeTab = 'upcoming'
      render()
      return
    }

    if (label === 'past') {
      activeTab = 'past'
      render()
      return
    }

    if (label === 'cancelled') {
      activeTab = 'cancelled'
      render()
    }
  }

  const handleSearch = () => {
    searchTerm = searchInput?.value ?? ''
    render()
  }

  const unsubscribe = subscribeMockState(render)
  render()

  documentNode.addEventListener('click', handleClick)
  searchInput?.addEventListener('input', handleSearch)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
    searchInput?.removeEventListener('input', handleSearch)
  }
}

const setupProfilePage = ({ documentNode }: EnhancerContext): Cleanup => {
  const fullNameInput = findFieldByLabel(documentNode, 'Full Name') as HTMLInputElement | null
  const regionSelect = findFieldByLabel(documentNode, 'Region') as HTMLSelectElement | null
  const emailInput = findFieldByLabel(documentNode, 'Email Address') as HTMLInputElement | null
  const phoneInput = findFieldByLabel(documentNode, 'Phone Number') as HTMLInputElement | null
  const saveButton = findButtonByText(documentNode, 'Save Changes')
  const discardButton = findButtonByText(documentNode, 'Discard Changes')
  const changePasswordButton = findButtonByText(documentNode, 'Change Password')

  const render = () => {
    const profile = getMockState().profile

    if (fullNameInput) {
      fullNameInput.value = profile.fullName
    }

    if (regionSelect) {
      regionSelect.value = profile.region
    }

    if (emailInput) {
      emailInput.value = profile.email
    }

    if (phoneInput) {
      phoneInput.value = profile.phone
    }

    const sidebarImage = documentNode.querySelector<HTMLImageElement>('aside img')
    const sidebarName = Array.from(documentNode.querySelectorAll<HTMLElement>('aside p')).find((node) =>
      node.className.includes('text-sky-950'),
    )

    if (sidebarImage) {
      sidebarImage.src = profile.avatarUrl
      sidebarImage.alt = profile.fullName
    }

    if (sidebarName) {
      sidebarName.textContent = profile.fullName
    }

    setBridgeRoute(changePasswordButton, stitchPages.resetPassword.href)
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    if (saveButton && saveButton.contains(targetNode)) {
      event.preventDefault()
      event.stopPropagation()
      updateProfile({
        fullName: fullNameInput?.value ?? '',
        phone: phoneInput?.value ?? '',
        region: regionSelect?.value ?? '',
      })
      addNotification({
        actionLabel: 'Go to Profile',
        actionType: 'profile',
        body: 'Your profile details were updated successfully.',
        createdLabel: 'Just now',
        id: `notif_profile_${Date.now()}`,
        kind: 'info',
        read: false,
        title: 'Profile Saved',
      })
      return
    }

    if (discardButton && discardButton.contains(targetNode)) {
      event.preventDefault()
      event.stopPropagation()
      render()
    }
  }

  const unsubscribe = subscribeMockState(render)
  render()

  documentNode.addEventListener('click', handleClick)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
  }
}

const setupDocumentsPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const searchInput = findInputByPlaceholder(documentNode, 'Search documents')
  const documentTypeSelect = findFieldByLabel(documentNode, 'Document Type') as HTMLSelectElement | null
  const documentsContainer =
    documentNode.querySelector<HTMLElement>('div.lg\\:col-span-2.space-y-6') ?? null
  const uploadSection = findSectionByHeading(documentNode, 'Upload New Document')
  const uploadDropzone =
    uploadSection?.querySelector<HTMLElement>('div.group.cursor-pointer') ?? null
  const helpButton = findButtonByText(documentNode, 'Go to Help Center')
  const dashboardButton = findButtonByText(documentNode, 'Return to Dashboard')

  const render = () => {
    const state = getMockState()
    const query = normalizeText(state.documentsFilter.query)
    const visibleDocuments = state.documents.filter((document) =>
      !query
        ? true
        : normalizeText(`${document.type} ${document.travelerName} ${document.fileName}`).includes(query),
    )

    if (searchInput) {
      searchInput.value = state.documentsFilter.query
    }

    if (documentTypeSelect) {
      documentTypeSelect.value = state.documentsFilter.type || 'Select type...'
    }

    setBridgeRoute(helpButton, stitchPages.helpCenter.href)
    setBridgeRoute(dashboardButton, stitchPages.accountDashboard.href)

    if (uploadDropzone) {
      uploadDropzone.dataset.mockAction = 'upload-document'
    }

    if (!documentsContainer) {
      return
    }

    if (!visibleDocuments.length) {
      replaceChildrenWithMarkup(
        documentNode,
        documentsContainer,
        renderEmptyState('No documents match the current search.'),
      )
      return
    }

    replaceChildrenWithMarkup(
      documentNode,
      documentsContainer,
      visibleDocuments
        .map((document) => {
          const tone = getDocumentTone(document)
          return `
            <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent hover:border-primary/5 transition-all flex items-start gap-6 group">
              <div class="w-16 h-16 rounded-2xl ${tone.iconShell} flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-3xl">${tone.icon}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2 gap-4">
                  <div>
                    <h3 class="text-xl font-bold text-primary group-hover:text-primary-container transition-colors">${escapeHtml(document.type)}</h3>
                    <p class="text-on-surface-variant text-sm mt-0.5">Traveler: ${escapeHtml(document.travelerName)}</p>
                    <p class="text-xs text-outline mt-2">${escapeHtml(document.expiresLabel)}</p>
                  </div>
                  <span class="px-3 py-1 rounded-full ${tone.badge} text-xs font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">${tone.icon}</span>
                    ${tone.badgeLabel}
                  </span>
                </div>
                <div class="mt-6 flex gap-3 flex-wrap">
                  <button class="px-5 py-2 rounded-xl ${document.status === 'verified' ? 'bg-primary text-white' : document.status === 'missing' ? 'bg-secondary text-white' : 'bg-surface-container-highest text-primary'} text-sm font-semibold hover:opacity-90 transition-all" data-mock-action="refresh-document" data-document-type="${escapeHtml(document.type)}">
                    ${tone.primaryAction}
                  </button>
                  ${
                    tone.secondaryAction
                      ? `<button class="px-5 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-semibold hover:bg-surface-container transition-all">${tone.secondaryAction}</button>`
                      : ''
                  }
                </div>
              </div>
            </div>
          `
        })
        .join(''),
    )
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const refreshButton = targetNode.closest<HTMLElement>('[data-mock-action="refresh-document"]')
    if (refreshButton?.dataset.documentType) {
      event.preventDefault()
      event.stopPropagation()
      uploadDocument(refreshButton.dataset.documentType)
      return
    }

    if (uploadDropzone && uploadDropzone.contains(targetNode)) {
      event.preventDefault()
      event.stopPropagation()
      const selectedType =
        documentTypeSelect?.value && documentTypeSelect.value !== 'Select type...'
          ? documentTypeSelect.value
          : 'Passport'
      uploadDocument(selectedType)
    }
  }

  const handleSearch = () => {
    updateDocumentsFilter({ query: searchInput?.value ?? '' })
  }

  const handleSelect = () => {
    updateDocumentsFilter({ type: documentTypeSelect?.value ?? '' })
  }

  const unsubscribe = subscribeMockState(render)
  render()

  documentNode.addEventListener('click', handleClick)
  searchInput?.addEventListener('input', handleSearch)
  documentTypeSelect?.addEventListener('change', handleSelect)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
    searchInput?.removeEventListener('input', handleSearch)
    documentTypeSelect?.removeEventListener('change', handleSelect)
  }
}

const setupNotificationsPage = ({ documentNode, navigate }: EnhancerContext): Cleanup => {
  const allButton = findButtonByText(documentNode, 'All')
  const unreadButton = findButtonByText(documentNode, 'Unread')
  const actionButton = findButtonByText(documentNode, 'Action Required')
  const searchInput = findInputByPlaceholder(documentNode, 'Search activity')
  const loadMoreButton = findButtonByText(documentNode, 'Load older notifications')
  const listContainer = loadMoreButton?.parentElement?.previousElementSibling as HTMLElement | null

  const styleTabButton = (button: HTMLElement | undefined, active: boolean) => {
    if (!button) {
      return
    }

    button.className = active
      ? 'px-6 py-2.5 bg-primary text-white font-label text-sm font-semibold rounded-full shadow-md'
      : 'px-6 py-2.5 bg-surface-container-highest text-on-surface-variant font-label text-sm font-semibold rounded-full hover:bg-surface-dim transition-all'
  }

  const render = () => {
    const state = getMockState()
    const query = normalizeText(state.notificationsFilter.query)
    const visibleNotifications = state.notifications.filter((notification) => {
      const searchMatch =
        !query ||
        normalizeText(`${notification.title} ${notification.body}`).includes(query)

      if (!searchMatch) {
        return false
      }

      if (state.notificationsFilter.tab === 'unread') {
        return !notification.read
      }

      if (state.notificationsFilter.tab === 'action') {
        return notification.kind === 'action'
      }

      return true
    })

    if (searchInput) {
      searchInput.value = state.notificationsFilter.query
    }

    styleTabButton(allButton, state.notificationsFilter.tab === 'all')
    styleTabButton(unreadButton, state.notificationsFilter.tab === 'unread')
    styleTabButton(actionButton, state.notificationsFilter.tab === 'action')

    const helpCard = Array.from(documentNode.querySelectorAll<HTMLElement>('div')).find(
      (node) => normalizeText(node.querySelector('h4')?.textContent ?? '') === 'help center',
    )
    const profileQuickCard = Array.from(documentNode.querySelectorAll<HTMLElement>('div')).find(
      (node) =>
        normalizeText(node.querySelector('h4')?.textContent ?? '') === 'account management',
    )

    setBridgeRoute(helpCard?.querySelector<HTMLElement>('button') ?? null, stitchPages.support.href)
    setBridgeRoute(
      profileQuickCard?.querySelector<HTMLElement>('button') ?? null,
      stitchPages.profile.href,
    )

    if (!listContainer) {
      return
    }

    if (!visibleNotifications.length) {
      replaceChildrenWithMarkup(
        documentNode,
        listContainer,
        renderEmptyState('All caught up. Try another filter to see older activity.'),
      )
      return
    }

    replaceChildrenWithMarkup(
      documentNode,
      listContainer,
      visibleNotifications
        .map((notification) => {
          const tone = getNotificationTone(notification)
          const actionRoute = getNotificationTargetRoute(notification, state)
          return `
            <div class="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-5 border-l-4 ${tone.border} relative">
              ${!notification.read ? '<div class="absolute top-6 right-6 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>' : ''}
              <div class="w-12 h-12 rounded-full ${tone.iconShell} flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined">${tone.icon}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1 gap-4">
                  <h3 class="font-headline font-bold text-primary text-lg">${escapeHtml(notification.title)}</h3>
                  <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">${escapeHtml(notification.createdLabel)}</span>
                </div>
                <p class="text-on-surface-variant mb-4 font-body">${escapeHtml(notification.body)}</p>
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="px-3 py-1 ${tone.badge} text-[10px] font-bold rounded-full uppercase tracking-widest">${tone.badgeLabel}</span>
                  ${
                    notification.actionLabel
                      ? `<button class="${notification.kind === 'action' ? 'navy-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity' : 'text-primary hover:underline text-sm font-semibold transition-all'}" data-mock-action="notification-route" data-notification-id="${escapeHtml(notification.id)}" data-target-route="${escapeHtml(actionRoute ?? '')}">
                          ${escapeHtml(notification.actionLabel)}
                        </button>`
                      : ''
                  }
                </div>
              </div>
            </div>
          `
        })
        .join(''),
    )
  }

  const handleClick = (event: MouseEvent) => {
    const targetNode = event.target
    if (!(targetNode instanceof Element)) {
      return
    }

    const routeButton = targetNode.closest<HTMLElement>('[data-mock-action="notification-route"]')
    if (routeButton?.dataset.notificationId) {
      event.preventDefault()
      event.stopPropagation()
      markNotificationRead(routeButton.dataset.notificationId)
      if (routeButton.dataset.targetRoute) {
        navigate(routeButton.dataset.targetRoute)
      }
      return
    }

    const button = targetNode.closest<HTMLElement>('button')
    if (!button) {
      return
    }

    const label = getElementText(button)
    if (label === 'all') {
      updateNotificationsFilter({ tab: 'all' })
      return
    }

    if (label === 'unread') {
      updateNotificationsFilter({ tab: 'unread' })
      return
    }

    if (label === 'action required') {
      updateNotificationsFilter({ tab: 'action' })
      return
    }

    if (label.includes('load older notifications')) {
      addNotification({
        actionLabel: 'Contact Support',
        actionType: 'support',
        body: 'A support agent replied to your latest request about document verification.',
        createdLabel: '5 days ago',
        id: `notif_support_${Date.now()}`,
        kind: 'info',
        read: true,
        title: 'Support Update',
      })
    }
  }

  const handleSearch = () => {
    updateNotificationsFilter({ query: searchInput?.value ?? '' })
  }

  const unsubscribe = subscribeMockState(render)
  render()

  documentNode.addEventListener('click', handleClick)
  searchInput?.addEventListener('input', handleSearch)

  return () => {
    unsubscribe()
    documentNode.removeEventListener('click', handleClick)
    searchInput?.removeEventListener('input', handleSearch)
  }
}

const setupBookingDetailPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const render = () => {
    const state = getMockState()
    const booking = getCurrentBooking(state)
    const tour = findTourById(booking?.tourId)
    const schedule = findScheduleById(booking?.scheduleId)

    if (!booking || !tour || !schedule) {
      return
    }

    setBridgeRoute(findButtonByText(documentNode, 'Back to Bookings'), stitchPages.bookings.href)
    setBridgeRoute(findButtonByText(documentNode, 'Download Vouchers'), stitchPages.vouchers.href)
    setBridgeRoute(findButtonByText(documentNode, 'Contact Support'), stitchPages.support.href)

    const snapshotSection = Array.from(documentNode.querySelectorAll<HTMLElement>('section')).find(
      (section) => normalizeText(section.textContent ?? '').includes('booking reference'),
    )
    const overviewSection = Array.from(documentNode.querySelectorAll<HTMLElement>('section')).find(
      (section) => normalizeText(section.textContent ?? '').includes('trip itinerary'),
    )
    const travelersSection = findSectionByHeading(documentNode, 'Travelers')
    const verificationCard = Array.from(documentNode.querySelectorAll<HTMLElement>('div')).find(
      (node) => normalizeText(node.querySelector('h3')?.textContent ?? '') === 'documents verification',
    )
    const paymentCard = Array.from(documentNode.querySelectorAll<HTMLElement>('div')).find(
      (node) => normalizeText(node.querySelector('h3')?.textContent ?? '') === 'payment summary',
    )

    const [departureLabel, returnLabel] = splitDateLabel(schedule.label)
    const travelers = getVisibleTravelers({
      ...state,
      travelersCount: booking.travelersCount,
    })

    replaceChildrenWithMarkup(
      documentNode,
      snapshotSection,
      `
        <div class="flex flex-col gap-2">
          <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Booking Reference</span>
          <div class="flex items-center gap-4 flex-wrap">
            <h2 class="text-2xl font-bold font-headline text-primary">${escapeHtml(booking.title)}</h2>
            <span class="px-3 py-1 ${getBookingStatusClasses(booking)} text-xs font-bold rounded-full uppercase tracking-wider">${escapeHtml(getBookingStatusLabel(booking))}</span>
          </div>
          <p class="text-on-surface-variant font-medium">${escapeHtml(booking.reference)}</p>
        </div>
        <div class="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
          <img alt="${escapeHtml(booking.title)}" src="${escapeHtml(tour.heroImage)}" />
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      overviewSection,
      `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Departure</span>
            <p class="text-lg font-bold text-primary">${escapeHtml(departureLabel)}</p>
            <p class="text-sm text-on-surface-variant">${escapeHtml(tour.location)}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Return</span>
            <p class="text-lg font-bold text-primary">${escapeHtml(returnLabel)}</p>
            <p class="text-sm text-on-surface-variant">${escapeHtml(tour.location)}</p>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Duration</span>
            <p class="text-lg font-bold text-primary">${escapeHtml(tour.durationLabel)}</p>
            <p class="text-sm text-on-surface-variant">${escapeHtml(schedule.title)}</p>
          </div>
        </div>
        <div class="flex flex-col gap-6">
          <h3 class="font-headline font-bold text-lg text-primary">Trip Itinerary</h3>
          <div class="space-y-6 relative border-l-2 border-outline-variant/30 ml-2 pl-8">
            ${tour.itinerary
              .map(
                (stop, index) => `
                  <div class="relative">
                    <div class="absolute -left-10 top-1 w-4 h-4 rounded-full ${index === 0 ? 'bg-secondary' : 'bg-outline-variant'} border-4 border-surface-container-low"></div>
                    <h4 class="font-bold text-primary">${escapeHtml(stop.title)}</h4>
                    <p class="text-sm text-on-surface-variant leading-relaxed mt-1">${escapeHtml(stop.description)}</p>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      travelersSection,
      `
        <h3 class="font-headline font-bold text-lg text-primary mb-6">Travelers</h3>
        <div class="flex flex-col gap-4">
          ${travelers
            .map(
              (traveler) => `
                <div class="flex items-center justify-between p-4 bg-surface rounded-xl">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">${escapeHtml(traveler.initials)}</div>
                    <div>
                      <p class="font-bold text-primary">${escapeHtml(traveler.fullName)}</p>
                      <p class="text-xs text-on-surface-variant">${escapeHtml(`${traveler.role} • Passport ending in ...${traveler.passportSuffix}`)}</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-secondary">check_circle</span>
                </div>
              `,
            )
            .join('')}
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      verificationCard,
      `
        <h3 class="font-headline font-bold text-primary">Documents &amp; Verification</h3>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">confirmation_number</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-primary leading-tight">Vouchers</p>
              <p class="text-xs text-secondary font-medium">${booking.status === 'confirmed' ? 'Available for download' : 'Available after payment clears'}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">verified_user</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-primary leading-tight">ID Verification</p>
              <p class="text-xs ${booking.documentState === 'ready' ? 'text-secondary' : 'text-error'} font-medium">${booking.documentState === 'ready' ? 'Verified' : 'Action Required'}</p>
            </div>
          </div>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      paymentCard,
      `
        <div class="flex justify-between items-center">
          <h3 class="font-headline font-bold text-on-primary-container">Payment Summary</h3>
          <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-secondary text-white rounded">${booking.status === 'pending_payment' ? 'Pending' : 'Success'}</span>
        </div>
        <div class="flex flex-col gap-1 py-4 border-y border-white/10">
          <div class="flex justify-between text-sm">
            <span class="text-on-primary-container">Total Amount Paid</span>
            <span class="font-bold text-lg">${escapeHtml(formatPrice(booking.amountPaid, booking.currency))}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
          <span class="text-[11px] text-on-primary-container font-medium">${escapeHtml(booking.paymentLabel)}</span>
        </div>
      `,
    )
  }

  const unsubscribe = subscribeMockState(render)
  render()

  return () => {
    unsubscribe()
  }
}

const setupRefundDetailPage = ({ documentNode }: EnhancerContext): Cleanup => {
  const render = () => {
    const state = getMockState()
    const refund = getCurrentRefund(state)
    const booking = state.bookings.find((item) => item.id === refund?.bookingId) ?? null
    const tour = findTourById(booking?.tourId)

    if (!refund || !booking || !tour) {
      return
    }

    setBridgeRoute(findButtonByText(documentNode, 'Back to Refunds'), stitchPages.refunds.href)
    setBridgeRoute(findButtonByText(documentNode, 'View Booking Details'), bookingDetailHref(booking.id))
    findButtonsByText(documentNode, 'Contact Support').forEach((button) => {
      setBridgeRoute(button, stitchPages.support.href)
    })

    const summarySection = Array.from(documentNode.querySelectorAll<HTMLElement>('section')).find(
      (section) => normalizeText(section.textContent ?? '').includes('refund identification'),
    )
    const contextSection = findSectionByHeading(documentNode, 'Request Context')
    const linkedBookingSection = findSectionByHeading(documentNode, 'Linked Booking')
    const amountSection = Array.from(documentNode.querySelectorAll<HTMLElement>('section')).find(
      (section) => normalizeText(section.textContent ?? '').includes('total refund amount'),
    )

    replaceChildrenWithMarkup(
      documentNode,
      summarySection,
      `
        <div class="flex justify-between items-start gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase">Refund Identification</span>
            <h3 class="font-headline text-2xl font-bold text-primary">${escapeHtml(refund.reference)}</h3>
          </div>
          <div class="bg-amber-50 text-amber-700 px-4 py-2 rounded-full flex items-center gap-2 border border-amber-100">
            <span class="material-symbols-outlined text-[18px]">pending</span>
            <span class="text-sm font-semibold">${refund.status === 'issued' ? 'Refund issued' : refund.status === 'pending_review' ? 'Pending review' : 'Processing in progress'}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div>
            <span class="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase block mb-1">Booking Reference</span>
            <a class="text-primary font-semibold hover:text-teal-600 underline underline-offset-4 decoration-slate-200 hover:decoration-teal-600 transition-all" href="${escapeHtml(bookingDetailHref(booking.id))}" data-router-bridge="${escapeHtml(bookingDetailHref(booking.id))}">${escapeHtml(booking.reference.replace('#', ''))}</a>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase block mb-1">Status Update</span>
            <span class="text-on-surface font-medium">${escapeHtml(refund.status.replaceAll('_', ' '))}</span>
          </div>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      contextSection,
      `
        <h4 class="font-headline text-lg font-bold text-primary mb-4">Request Context</h4>
        <div class="flex flex-col gap-4">
          <div>
            <span class="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase block mb-1">Reason for Refund</span>
            <p class="text-on-surface font-medium leading-relaxed">${escapeHtml(refund.reason)}</p>
          </div>
          <div class="pt-4 border-t border-slate-200">
            <span class="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase block mb-1">Additional Notes</span>
            <p class="text-on-surface-variant text-sm italic">"${escapeHtml(refund.notes)}"</p>
          </div>
        </div>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      linkedBookingSection,
      `
        <h4 class="font-headline text-sm font-bold text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">link</span>
          Linked Booking
        </h4>
        <div class="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
          <img alt="${escapeHtml(tour.title)}" class="w-16 h-16 rounded-lg object-cover" src="${escapeHtml(tour.heroImage)}" />
          <div class="flex flex-col overflow-hidden">
            <span class="text-primary font-bold truncate">${escapeHtml(tour.title)}</span>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-[11px] text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]">calendar_today</span>
                ${escapeHtml(booking.datesLabel)}
              </span>
              <span class="text-[11px] text-slate-500 flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]">group</span>
                ${booking.travelersCount} Travelers
              </span>
            </div>
          </div>
        </div>
        <button class="w-full mt-4 text-center py-3 text-sm font-bold text-primary border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors" data-router-bridge="${escapeHtml(bookingDetailHref(booking.id))}">
          View Booking Details
        </button>
      `,
    )

    replaceChildrenWithMarkup(
      documentNode,
      amountSection,
      `
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary-container rounded-full opacity-50 blur-3xl"></div>
        <div class="relative z-10">
          <span class="text-[10px] font-bold text-on-primary-container tracking-[0.2em] uppercase">Total Refund Amount</span>
          <div class="text-4xl font-headline font-extrabold mt-2">${escapeHtml(formatPrice(refund.amount, refund.currency))}</div>
        </div>
        <div class="relative z-10 pt-6 border-t border-white/10 flex flex-col gap-4">
          <div class="flex justify-between items-center text-sm">
            <span class="text-on-primary-container font-medium">Original Payment</span>
            <span class="font-semibold">Visa ending in 4242</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-on-primary-container font-medium">Linked Booking</span>
            <span class="font-semibold">${escapeHtml(booking.reference)}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-on-primary-container font-medium">Refund Method</span>
            <span class="font-semibold">Original Payment Method</span>
          </div>
        </div>
      `,
    )
  }

  const unsubscribe = subscribeMockState(render)
  render()

  return () => {
    unsubscribe()
  }
}

export function enhanceMockInteractions({
  definition,
  documentNode,
  navigate,
}: EnhancerContext): Cleanup {
  if (definition.slug === stitchPages.tours.slug) {
    return setupCatalogPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.tourDetail.slug) {
    return setupTourDetailPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.tourSchedules.slug) {
    return setupSchedulesPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.checkoutReview.slug) {
    return setupCheckoutPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.payment.slug) {
    return setupPaymentPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.paymentSuccess.slug) {
    return setupPaymentSuccessPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.accountDashboard.slug) {
    return setupDashboardPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.bookings.slug) {
    return setupBookingsPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.profile.slug) {
    return setupProfilePage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.documents.slug) {
    return setupDocumentsPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.notifications.slug) {
    return setupNotificationsPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.bookingDetail.slug) {
    return setupBookingDetailPage({ definition, documentNode, navigate })
  }

  if (definition.slug === stitchPages.refundDetail.slug) {
    return setupRefundDetailPage({ definition, documentNode, navigate })
  }

  return () => {}
}
