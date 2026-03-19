import { z } from 'zod'

export const TravelerSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  passport: z.string().min(6),
  nationality: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  type: z.enum(['ADULT', 'CHILD', 'INFANT']).optional(),
})

export const BookingSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['FLIGHT', 'HOTEL', 'TOUR']),
  itemId: z.string(),
  travelers: z.array(TravelerSchema).min(1),
  checkInDate: z.string(),
  checkOutDate: z.string().optional(),
  totalPrice: z.number().positive(),
  currency: z.string().default('USD'),
  specialRequests: z.string().optional(),
  couponCode: z.string().optional(),
})

export const BookingFilterSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  type: z.enum(['FLIGHT', 'HOTEL', 'TOUR']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
})

export type Traveler = z.infer<typeof TravelerSchema>
export type Booking = z.infer<typeof BookingSchema>
export type BookingFilter = z.infer<typeof BookingFilterSchema>
