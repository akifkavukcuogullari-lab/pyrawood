import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    variantId: z.string().uuid('Invalid variant ID').optional(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid cart item ID'),
  }),
});

export const cartItemParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid cart item ID'),
  }),
});
