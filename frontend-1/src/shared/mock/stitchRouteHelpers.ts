import { stitchPages } from '@/shared/config/stitchPages'
import { mockTours } from '@/shared/mock/stitchMockData'

export const bookingDetailHref = (bookingId: string) =>
  stitchPages.bookingDetail.href.replace('TBK-2048', bookingId)

export const checkoutHref = (tourSlug: string) =>
  stitchPages.checkoutReview.href.replace('amalfi-coast-sailing', tourSlug)

export const paymentSuccessHref = (bookingId: string) =>
  stitchPages.paymentSuccess.href.replace('TBK-2048', bookingId)

export const refundDetailHref = (refundId: string) =>
  stitchPages.refundDetail.href.replace('RFD-1120', refundId)

export const tourDetailHref = (tourSlug: string) =>
  stitchPages.tourDetail.href.replace('amalfi-coast-sailing', tourSlug)

export const tourSchedulesHref = (tourSlug: string) =>
  stitchPages.tourSchedules.href.replace('amalfi-coast-sailing', tourSlug)

export const findTourBySlug = (tourSlug: string) =>
  mockTours.find((tour) => tour.slug === tourSlug) ?? null
