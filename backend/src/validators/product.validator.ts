import { z } from 'zod';

/**
 * Validates query parameters for the product list endpoint.
 * All fields are optional. Numbers are coerced from strings.
 */
export const productListParamsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z
      .enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'rating'])
      .optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

/**
 * Validates the :id parameter — accepts UUID format or a slug string.
 */
export const productIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});
