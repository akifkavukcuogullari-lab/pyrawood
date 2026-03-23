import { addToCartSchema, updateCartItemSchema, cartItemParamsSchema } from '../../../src/validators/cart.validator';

describe('addToCartSchema', () => {
  it('should accept valid add-to-cart data', () => {
    const result = addToCartSchema.safeParse({
      body: {
        productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
        quantity: 2,
      },
    });
    expect(result.success).toBe(true);
  });

  it('should accept optional variantId as UUID', () => {
    const result = addToCartSchema.safeParse({
      body: {
        productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
        variantId: 'b2c3d4e5-6789-4abc-9def-000000000002',
        quantity: 1,
      },
    });
    expect(result.success).toBe(true);
  });

  it('should reject non-UUID productId', () => {
    const result = addToCartSchema.safeParse({
      body: { productId: 'not-a-uuid', quantity: 1 },
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-UUID variantId', () => {
    const result = addToCartSchema.safeParse({
      body: {
        productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
        variantId: 'invalid',
        quantity: 1,
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject quantity of 0', () => {
    const result = addToCartSchema.safeParse({
      body: {
        productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
        quantity: 0,
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative quantity', () => {
    const result = addToCartSchema.safeParse({
      body: {
        productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
        quantity: -3,
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer quantity', () => {
    const result = addToCartSchema.safeParse({
      body: {
        productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
        quantity: 2.5,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('updateCartItemSchema', () => {
  it('should accept valid update data', () => {
    const result = updateCartItemSchema.safeParse({
      body: { quantity: 5 },
      params: { id: 'a1b2c3d4-5678-4abc-9def-000000000001' },
    });
    expect(result.success).toBe(true);
  });

  it('should reject quantity less than 1', () => {
    const result = updateCartItemSchema.safeParse({
      body: { quantity: 0 },
      params: { id: 'a1b2c3d4-5678-4abc-9def-000000000001' },
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-UUID item id', () => {
    const result = updateCartItemSchema.safeParse({
      body: { quantity: 1 },
      params: { id: 'bad-id' },
    });
    expect(result.success).toBe(false);
  });
});

describe('cartItemParamsSchema', () => {
  it('should accept a valid UUID', () => {
    const result = cartItemParamsSchema.safeParse({
      params: { id: 'a1b2c3d4-5678-4abc-9def-000000000001' },
    });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid UUID', () => {
    const result = cartItemParamsSchema.safeParse({
      params: { id: 'not-uuid' },
    });
    expect(result.success).toBe(false);
  });
});
