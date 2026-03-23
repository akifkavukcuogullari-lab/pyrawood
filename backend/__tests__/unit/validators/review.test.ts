import { createReviewSchema, reviewParamsSchema, reviewListSchema } from '../../../src/validators/review.validator';

const validProductId = 'a1b2c3d4-5678-4abc-9def-000000000001';

describe('createReviewSchema', () => {
  it('should accept valid review data with rating 1-5', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: {
        rating: 4,
        title: 'Beautiful craftsmanship',
        body: 'The walnut grain on this table is absolutely stunning.',
      },
    });
    expect(result.success).toBe(true);
  });

  it('should accept rating of 1', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: { rating: 1 },
    });
    expect(result.success).toBe(true);
  });

  it('should accept rating of 5', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: { rating: 5 },
    });
    expect(result.success).toBe(true);
  });

  it('should reject rating of 0', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: { rating: 0 },
    });
    expect(result.success).toBe(false);
  });

  it('should reject rating of 6', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: { rating: 6 },
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer rating', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: { rating: 3.5 },
    });
    expect(result.success).toBe(false);
  });

  it('should allow title and body to be optional', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: validProductId },
      body: { rating: 3 },
    });
    expect(result.success).toBe(true);
  });

  it('should reject non-UUID productId', () => {
    const result = createReviewSchema.safeParse({
      params: { productId: 'invalid' },
      body: { rating: 3 },
    });
    expect(result.success).toBe(false);
  });
});

describe('reviewParamsSchema', () => {
  it('should accept valid UUID productId', () => {
    const result = reviewParamsSchema.safeParse({
      params: { productId: validProductId },
    });
    expect(result.success).toBe(true);
  });

  it('should reject non-UUID productId', () => {
    const result = reviewParamsSchema.safeParse({
      params: { productId: 'not-uuid' },
    });
    expect(result.success).toBe(false);
  });
});

describe('reviewListSchema', () => {
  it('should accept valid params and query', () => {
    const result = reviewListSchema.safeParse({
      params: { productId: validProductId },
      query: { page: '2', limit: '10' },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query.page).toBe(2);
      expect(result.data.query.limit).toBe(10);
    }
  });

  it('should accept empty query', () => {
    const result = reviewListSchema.safeParse({
      params: { productId: validProductId },
      query: {},
    });
    expect(result.success).toBe(true);
  });
});
