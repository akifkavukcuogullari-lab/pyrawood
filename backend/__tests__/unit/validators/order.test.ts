import { createOrderSchema, orderParamsSchema } from '../../../src/validators/order.validator';

const validOrderData = {
  body: {
    shippingAddress: {
      fullName: 'Elena Woodsworth',
      addressLine1: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'Oregon',
      postalCode: '97201',
      country: 'US',
    },
    paymentIntentId: 'pi_3OxPl2ABC123def456',
  },
};

describe('createOrderSchema', () => {
  it('should accept valid order data with all required fields', () => {
    const result = createOrderSchema.safeParse(validOrderData);
    expect(result.success).toBe(true);
  });

  it('should accept optional addressLine2, phone, and notes', () => {
    const result = createOrderSchema.safeParse({
      body: {
        ...validOrderData.body,
        shippingAddress: {
          ...validOrderData.body.shippingAddress,
          addressLine2: 'Suite 100',
          phone: '+1-503-555-0101',
        },
        notes: 'Please deliver before 5 PM.',
      },
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing fullName', () => {
    const { fullName, ...rest } = validOrderData.body.shippingAddress;
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: rest,
        paymentIntentId: 'pi_test_123',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing addressLine1', () => {
    const { addressLine1, ...rest } = validOrderData.body.shippingAddress;
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: rest,
        paymentIntentId: 'pi_test_123',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing city', () => {
    const { city, ...rest } = validOrderData.body.shippingAddress;
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: rest,
        paymentIntentId: 'pi_test_123',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing state', () => {
    const { state, ...rest } = validOrderData.body.shippingAddress;
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: rest,
        paymentIntentId: 'pi_test_123',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing postalCode', () => {
    const { postalCode, ...rest } = validOrderData.body.shippingAddress;
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: rest,
        paymentIntentId: 'pi_test_123',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing country', () => {
    const { country, ...rest } = validOrderData.body.shippingAddress;
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: rest,
        paymentIntentId: 'pi_test_123',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty paymentIntentId', () => {
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: validOrderData.body.shippingAddress,
        paymentIntentId: '',
      },
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing paymentIntentId', () => {
    const result = createOrderSchema.safeParse({
      body: {
        shippingAddress: validOrderData.body.shippingAddress,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('orderParamsSchema', () => {
  it('should accept a valid UUID', () => {
    const result = orderParamsSchema.safeParse({
      params: { id: 'a1b2c3d4-5678-4abc-9def-000000000001' },
    });
    expect(result.success).toBe(true);
  });

  it('should reject a non-UUID string', () => {
    const result = orderParamsSchema.safeParse({
      params: { id: 'not-a-uuid' },
    });
    expect(result.success).toBe(false);
  });
});
