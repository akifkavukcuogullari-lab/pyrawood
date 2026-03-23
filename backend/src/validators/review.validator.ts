import { z } from 'zod';

/**
 * Validates the :productId param as a UUID.
 */
export const reviewParamsSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
});

/**
 * Validates the body for creating a review.
 */
export const createReviewSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    title: z.string().max(255, 'Title must be 255 characters or less').optional(),
    body: z.string().optional(),
  }),
});

/**
 * Validates query parameters for listing reviews.
 */
export const reviewListSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});
