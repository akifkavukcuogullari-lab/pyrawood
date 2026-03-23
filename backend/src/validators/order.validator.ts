import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z.string().min(1, 'Full name is required').max(255),
      addressLine1: z.string().min(1, 'Address line 1 is required').max(500),
      addressLine2: z.string().max(500).optional(),
      city: z.string().min(1, 'City is required').max(255),
      state: z.string().min(1, 'State is required').max(255),
      postalCode: z.string().min(1, 'Postal code is required').max(20),
      country: z.string().min(1, 'Country is required').max(100),
      phone: z.string().max(30).optional(),
    }),
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
    notes: z.string().max(1000).optional(),
  }),
});

export const orderParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});
