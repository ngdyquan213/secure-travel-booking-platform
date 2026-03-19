import { z } from 'zod'

export const PaymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  method: z.enum(['CARD', 'BANK', 'WALLET']),
  cardNumber: z.string().regex(/^\d{16}$/).optional(),
  cardHolder: z.string().optional(),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/).optional(),
  cvv: z.string().regex(/^\d{3,4}$/).optional(),
})

export const RefundSchema = z.object({
  bookingId: z.string(),
  reason: z.string().min(10),
  refundMethod: z.enum(['ORIGINAL', 'WALLET', 'BANK']),
})

export const CouponSchema = z.object({
  code: z.string().min(3),
  discount: z.number().min(0).max(100),
  minAmount: z.number().optional(),
  expiryDate: z.string().optional(),
})

export type Payment = z.infer<typeof PaymentSchema>
export type Refund = z.infer<typeof RefundSchema>
export type Coupon = z.infer<typeof CouponSchema>
