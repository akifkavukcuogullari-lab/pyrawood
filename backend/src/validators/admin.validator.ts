import { z } from 'zod';

// ── Product schemas ──────────────────────────────────────────────────

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be non-negative'),
    compareAtPrice: z.number().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().max(100).optional(),
    weight: z.number().min(0).optional(),
    metadata: z.record(z.unknown()).optional(),
    variants: z
      .array(
        z.object({
          name: z.string().min(1).max(255),
          sku: z.string().max(100).optional(),
          price: z.number().min(0).optional(),
          stock: z.number().int().min(0).optional(),
          attributes: z.record(z.string()).optional(),
        })
      )
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    compareAtPrice: z.number().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().max(100).optional(),
    weight: z.number().min(0).optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

// ── Image schemas ────────────────────────────────────────────────────

export const imageParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
    imgId: z.string().uuid('Invalid image ID'),
  }),
});

export const updateImageSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
    imgId: z.string().uuid('Invalid image ID'),
  }),
  body: z.object({
    altText: z.string().max(255).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPrimary: z.boolean().optional(),
  }),
});

// ── Variant schemas ──────────────────────────────────────────────────

export const createVariantSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    sku: z.string().max(100).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    attributes: z.record(z.string()).optional(),
  }),
});

export const updateVariantSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
    varId: z.string().uuid('Invalid variant ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    sku: z.string().max(100).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    attributes: z.record(z.string()).optional(),
  }),
});

export const variantParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
    varId: z.string().uuid('Invalid variant ID'),
  }),
});

// ── Order schemas ────────────────────────────────────────────────────

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
  body: z.object({
    status: z.enum(
      ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      { errorMap: () => ({ message: 'Invalid order status' }) }
    ),
  }),
});

// ── Pagination query schema ──────────────────────────────────────────

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    category: z.string().optional(),
  }),
});
