import { productListParamsSchema, productIdSchema } from '../../../src/validators/product.validator';

describe('productListParamsSchema', () => {
  it('should accept valid query parameters', () => {
    const result = productListParamsSchema.safeParse({
      query: {
        search: 'walnut',
        category: 'dining',
        minPrice: '100',
        maxPrice: '5000',
        sort: 'price_asc',
        page: '1',
        limit: '24',
      },
    });
    expect(result.success).toBe(true);
  });

  it('should coerce string numbers to actual numbers', () => {
    const result = productListParamsSchema.safeParse({
      query: { minPrice: '200', page: '3', limit: '20' },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query.minPrice).toBe(200);
      expect(result.data.query.page).toBe(3);
      expect(result.data.query.limit).toBe(20);
    }
  });

  it('should accept all valid sort values', () => {
    const validSorts = ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'rating'];
    for (const sort of validSorts) {
      const result = productListParamsSchema.safeParse({ query: { sort } });
      expect(result.success).toBe(true);
    }
  });

  it('should reject invalid sort value', () => {
    const result = productListParamsSchema.safeParse({ query: { sort: 'invalid_sort' } });
    expect(result.success).toBe(false);
  });

  it('should accept empty query', () => {
    const result = productListParamsSchema.safeParse({ query: {} });
    expect(result.success).toBe(true);
  });

  it('should reject negative minPrice', () => {
    const result = productListParamsSchema.safeParse({ query: { minPrice: '-10' } });
    expect(result.success).toBe(false);
  });

  it('should reject limit exceeding 100', () => {
    const result = productListParamsSchema.safeParse({ query: { limit: '200' } });
    expect(result.success).toBe(false);
  });
});

describe('productIdSchema', () => {
  it('should accept a valid string id', () => {
    const result = productIdSchema.safeParse({
      params: { id: 'a1b2c3d4-5678-4abc-9def-000000000001' },
    });
    expect(result.success).toBe(true);
  });

  it('should accept a slug string', () => {
    const result = productIdSchema.safeParse({
      params: { id: 'walnut-harvest-dining-table-abc12345' },
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty id', () => {
    const result = productIdSchema.safeParse({
      params: { id: '' },
    });
    expect(result.success).toBe(false);
  });
});
