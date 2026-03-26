import {
  defaultMockState,
  mockSchedules,
  mockTours,
  type Booking,
  type CurrencyCode,
  type NotificationItem,
  type Tour,
  type TourSchedule,
  type TravelBookMockState,
} from '@/shared/mock/stitchMockData'
import {
  findTourBySlug,
  paymentSuccessHref,
} from '@/shared/mock/stitchRouteHelpers'

type MockStoreListener = () => void
type MockStoreUpdater = (draft: TravelBookMockState) => void

const listeners = new Set<MockStoreListener>()
const storageKey = 'travelbook-stitch-mock-state'

const cloneState = (value: TravelBookMockState): TravelBookMockState =>
  JSON.parse(JSON.stringify(value)) as TravelBookMockState

const hydrateMockState = (): TravelBookMockState => {
  if (typeof window === 'undefined') {
    return cloneState(defaultMockState)
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey)
    if (!storedValue) {
      return cloneState(defaultMockState)
    }

    const parsedValue = JSON.parse(storedValue) as Partial<TravelBookMockState>

    return {
      ...cloneState(defaultMockState),
      ...parsedValue,
      catalogFilters: {
        ...defaultMockState.catalogFilters,
        ...parsedValue.catalogFilters,
      },
      documentsFilter: {
        ...defaultMockState.documentsFilter,
        ...parsedValue.documentsFilter,
      },
      notificationsFilter: {
        ...defaultMockState.notificationsFilter,
        ...parsedValue.notificationsFilter,
      },
      paymentDraft: {
        ...defaultMockState.paymentDraft,
        ...parsedValue.paymentDraft,
      },
      profile: {
        ...defaultMockState.profile,
        ...parsedValue.profile,
      },
    }
  } catch {
    return cloneState(defaultMockState)
  }
}

let mockState = hydrateMockState()

const persistState = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(mockState))
}

const emitChange = () => {
  listeners.forEach((listener) => {
    listener()
  })
}

const updateState = (updater: MockStoreUpdater) => {
  const draft = cloneState(mockState)
  updater(draft)
  mockState = draft
  persistState()
  emitChange()
}

const createNotification = (
  partial: Pick<NotificationItem, 'body' | 'kind' | 'title'> &
    Partial<Pick<NotificationItem, 'actionLabel' | 'actionType' | 'createdLabel'>>,
): NotificationItem => ({
  actionLabel: partial.actionLabel,
  actionType: partial.actionType,
  body: partial.body,
  createdLabel: partial.createdLabel ?? 'Just now',
  id: `notif_${Date.now()}`,
  kind: partial.kind,
  read: false,
  title: partial.title,
})

const firstScheduleForTour = (tourId: string) =>
  mockSchedules.find((schedule) => schedule.tourId === tourId) ?? null

export const getMockState = () => mockState

export const subscribeMockState = (listener: MockStoreListener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const setSelectedTour = (tourId: string) => {
  updateState((draft) => {
    draft.selectedTourId = tourId
    const firstSchedule = firstScheduleForTour(tourId)
    if (firstSchedule) {
      draft.selectedScheduleId = firstSchedule.id
    }
  })
}

export const setSelectedSchedule = (scheduleId: string) => {
  updateState((draft) => {
    draft.selectedScheduleId = scheduleId
    const schedule = mockSchedules.find((item) => item.id === scheduleId)
    if (schedule) {
      draft.selectedTourId = schedule.tourId
    }
  })
}

export const setTravelersCount = (travelersCount: number) => {
  updateState((draft) => {
    draft.travelersCount = Math.max(1, travelersCount)
    draft.catalogFilters.travelersLabel = `${draft.travelersCount} Travelers`
  })
}

export const updateCatalogFilters = (
  partial: Partial<TravelBookMockState['catalogFilters']>,
) => {
  updateState((draft) => {
    draft.catalogFilters = {
      ...draft.catalogFilters,
      ...partial,
    }
  })
}

export const updateNotificationsFilter = (
  partial: Partial<TravelBookMockState['notificationsFilter']>,
) => {
  updateState((draft) => {
    draft.notificationsFilter = {
      ...draft.notificationsFilter,
      ...partial,
    }
  })
}

export const updateDocumentsFilter = (
  partial: Partial<TravelBookMockState['documentsFilter']>,
) => {
  updateState((draft) => {
    draft.documentsFilter = {
      ...draft.documentsFilter,
      ...partial,
    }
  })
}

export const updateProfile = (partial: Partial<TravelBookMockState['profile']>) => {
  updateState((draft) => {
    draft.profile = {
      ...draft.profile,
      ...partial,
    }
    draft.travelers[0] = {
      ...draft.travelers[0],
      fullName: draft.profile.fullName,
      initials: draft.profile.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0] ?? '')
        .join('')
        .toUpperCase(),
    }
  })
}

export const updatePaymentDraft = (
  partial: Partial<TravelBookMockState['paymentDraft']>,
) => {
  updateState((draft) => {
    draft.paymentDraft = {
      ...draft.paymentDraft,
      ...partial,
    }
  })
}

export const markNotificationRead = (notificationId: string) => {
  updateState((draft) => {
    const notification = draft.notifications.find((item) => item.id === notificationId)
    if (notification) {
      notification.read = true
    }
  })
}

export const addNotification = (notification: NotificationItem) => {
  updateState((draft) => {
    draft.notifications.unshift(notification)
  })
}

export const uploadDocument = (documentType: string) => {
  updateState((draft) => {
    const normalizedType = documentType || 'Other'
    const existingDocument = draft.documents.find((item) => item.type === normalizedType)
    if (existingDocument) {
      existingDocument.status = 'processing'
      existingDocument.fileName = `${normalizedType.toLowerCase().replace(/\s+/g, '-')}-refresh.pdf`
      existingDocument.expiresLabel = 'Review expected in 24h'
    } else {
      draft.documents.unshift({
        expiresLabel: 'Review expected in 24h',
        fileName: `${normalizedType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        id: `doc_${Date.now()}`,
        status: 'processing',
        travelerName: draft.travelers[0]?.fullName ?? draft.profile.fullName,
        type: normalizedType,
      })
    }

    draft.notifications.unshift(
      createNotification({
        actionLabel: 'Open Documents',
        actionType: 'documents',
        body: `${normalizedType} was uploaded and is waiting for verification.`,
        kind: 'info',
        title: 'Document Uploaded',
      }),
    )
  })
}

export const completeMockPayment = () => {
  const currentState = getMockState()
  const schedule = getSelectedSchedule(currentState)
  const tour = getSelectedTour(currentState)

  if (!schedule || !tour) {
    return null
  }

  const bookingId = `TBK-${Date.now().toString().slice(-6)}`
  const currency = schedule.currency
  const amountPaid = schedule.unitPrice * currentState.travelersCount

  const booking: Booking = {
    amountPaid,
    currency,
    datesLabel: schedule.label,
    documentState: currentState.documents.some((item) => item.status === 'missing')
      ? 'action_required'
      : 'ready',
    id: bookingId,
    paymentLabel: 'Payment Confirmed',
    reference: `#${bookingId}`,
    scheduleId: schedule.id,
    status: 'confirmed',
    title: tour.title,
    tourId: tour.id,
    travelersCount: currentState.travelersCount,
  }

  updateState((draft) => {
    draft.bookings.unshift(booking)
    draft.currentBookingId = booking.id
    draft.catalogFilters.travelersLabel = `${draft.travelersCount} Travelers`
    draft.notifications.unshift(
      createNotification({
        actionLabel: 'View Details',
        actionType: 'booking-detail',
        body: `${tour.title} is confirmed for ${schedule.label}.`,
        kind: 'info',
        title: 'Booking Confirmed',
      }),
    )
  })

  return {
    booking,
    nextHref: paymentSuccessHref(booking.id),
  }
}

export const syncMockStateFromPath = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'

  if (normalizedPath.startsWith('/tours/')) {
    const segments = normalizedPath.split('/').filter(Boolean)
    const tourSlug = segments[1]
    const routeTour = findTourBySlug(tourSlug)
    if (routeTour && routeTour.id !== getMockState().selectedTourId) {
      setSelectedTour(routeTour.id)
    }
  }

  if (normalizedPath.startsWith('/checkout/tours/')) {
    const segments = normalizedPath.split('/').filter(Boolean)
    const tourSlug = segments[2]
    const routeTour = findTourBySlug(tourSlug)

    if (routeTour && routeTour.id !== getMockState().selectedTourId) {
      setSelectedTour(routeTour.id)
    }
  }

  if (normalizedPath.startsWith('/account/bookings/')) {
    const bookingId = normalizedPath.split('/').filter(Boolean)[2]
    if (bookingId && bookingId !== getMockState().currentBookingId) {
      updateState((draft) => {
        draft.currentBookingId = bookingId
      })
    }
  }

  if (normalizedPath.startsWith('/account/refunds/')) {
    const refundId = normalizedPath.split('/').filter(Boolean)[2]
    if (refundId && refundId !== getMockState().currentRefundId) {
      updateState((draft) => {
        draft.currentRefundId = refundId
      })
    }
  }

  if (normalizedPath.startsWith('/checkout/success/')) {
    const bookingId = normalizedPath.split('/').filter(Boolean)[2]
    if (bookingId && bookingId !== getMockState().currentBookingId) {
      updateState((draft) => {
        draft.currentBookingId = bookingId
      })
    }
  }
}

export const getSelectedTour = (state = getMockState()): Tour | null =>
  mockTours.find((tour) => tour.id === state.selectedTourId) ?? null

export const getSelectedSchedule = (state = getMockState()): TourSchedule | null =>
  mockSchedules.find((schedule) => schedule.id === state.selectedScheduleId) ?? null

export const getCurrentBooking = (state = getMockState()): Booking | null =>
  state.bookings.find((booking) => booking.id === state.currentBookingId) ?? state.bookings[0] ?? null

export const getCurrentRefund = (state = getMockState()) =>
  state.refunds.find((refund) => refund.id === state.currentRefundId) ?? state.refunds[0] ?? null

export const getSchedulesForSelectedTour = (state = getMockState()) =>
  mockSchedules.filter((schedule) => schedule.tourId === state.selectedTourId)

export const formatPrice = (amount: number, currency: CurrencyCode) =>
  new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
  }).format(amount)

export const getBookingsSummary = (state = getMockState()) => ({
  activeCount: state.bookings.filter((booking) => booking.status !== 'refund_in_progress').length,
  confirmedCount: state.bookings.filter((booking) => booking.status === 'confirmed').length,
  vouchersReady: state.bookings.filter(
    (booking) => booking.status === 'confirmed' && booking.documentState === 'ready',
  ).length,
})

export const getDocumentSummary = (state = getMockState()) => ({
  actionRequiredCount: state.documents.filter(
    (document) => document.status === 'missing' || document.status === 'expiring',
  ).length,
  readyCount: state.documents.filter((document) => document.status === 'verified').length,
})

export const getVisibleTours = (state = getMockState()) => {
  const query = state.catalogFilters.query.trim().toLowerCase()
  const activeFilter = state.catalogFilters.activeFilter

  return mockTours.filter((tour) => {
    const queryMatch =
      !query ||
      `${tour.title} ${tour.location} ${tour.country} ${tour.teaser}`
        .toLowerCase()
        .includes(query)

    if (!queryMatch) {
      return false
    }

    if (activeFilter === 'duration') {
      return tour.durationDays <= 6
    }

    if (activeFilter === 'groupSize') {
      return Number.parseInt(tour.groupSizeLabel.replace(/\D+/g, ''), 10) <= 14
    }

    if (activeFilter === 'priceRange') {
      return tour.priceFrom <= 1800
    }

    return true
  })
}
