import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const TEST_JWT_SECRET = 'test-jwt-secret-for-unit-tests';

// ── Mock Data Factories ─────────────────────────────────────────────

export function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'b3d7c8a0-1234-4abc-9def-000000000001',
    name: 'Elena Woodsworth',
    email: 'elena@pyrawood.com',
    role: 'customer' as const,
    avatarUrl: undefined,
    passwordHash: '$2b$12$hashedpasswordplaceholder',
    createdAt: '2025-06-15T10:00:00.000Z',
    updatedAt: '2025-06-15T10:00:00.000Z',
    ...overrides,
  };
}

export function createMockProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'a1b2c3d4-5678-4abc-9def-000000000001',
    name: 'Walnut Harvest Dining Table',
    slug: 'walnut-harvest-dining-table-abc12345',
    description: 'A beautifully crafted walnut dining table for family gatherings.',
    price: 1299,
    compareAtPrice: 1599,
    categoryId: 'cat00001-0000-4000-a000-000000000001',
    isActive: true,
    stock: 15,
    sku: 'PW-DT-WAL-001',
    weight: 45.5,
    metadata: {},
    variants: [],
    images: [],
    averageRating: 4.5,
    reviewCount: 12,
    createdAt: '2025-06-10T08:00:00.000Z',
    updatedAt: '2025-06-12T14:30:00.000Z',
    ...overrides,
  };
}

export function createMockCategory(overrides: Record<string, unknown> = {}) {
  return {
    id: 'cat00001-0000-4000-a000-000000000001',
    name: 'Dining',
    slug: 'dining',
    description: 'Handcrafted dining furniture for your home.',
    imageUrl: '/images/categories/dining.jpg',
    parentId: undefined,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ord00001-0000-4000-a000-000000000001',
    userId: 'b3d7c8a0-1234-4abc-9def-000000000001',
    status: 'pending',
    shippingAddress: {
      fullName: 'Elena Woodsworth',
      addressLine1: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'US',
    },
    paymentIntentId: 'pi_test_123456789',
    subtotal: 1299,
    tax: 103.92,
    shipping: 0,
    total: 1402.92,
    notes: 'Please leave at the front door.',
    items: [],
    createdAt: '2025-06-20T09:00:00.000Z',
    updatedAt: '2025-06-20T09:00:00.000Z',
    ...overrides,
  };
}

export function createMockCart(overrides: Record<string, unknown> = {}) {
  return {
    id: 'crt00001-0000-4000-a000-000000000001',
    userId: 'b3d7c8a0-1234-4abc-9def-000000000001',
    items: [],
    createdAt: '2025-06-18T12:00:00.000Z',
    updatedAt: '2025-06-18T12:00:00.000Z',
    ...overrides,
  };
}

export function createMockReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rev00001-0000-4000-a000-000000000001',
    productId: 'a1b2c3d4-5678-4abc-9def-000000000001',
    userId: 'b3d7c8a0-1234-4abc-9def-000000000001',
    rating: 5,
    title: 'Absolutely stunning craftsmanship',
    body: 'This table is the centerpiece of our dining room. The walnut grain is gorgeous.',
    createdAt: '2025-06-22T16:00:00.000Z',
    ...overrides,
  };
}

// ── Token & Auth Helpers ────────────────────────────────────────────

export function generateTestToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    TEST_JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function getAuthHeaders(user?: { id: string; email: string; role: string }): { Authorization: string } {
  const mockUser = user || {
    id: 'b3d7c8a0-1234-4abc-9def-000000000001',
    email: 'elena@pyrawood.com',
    role: 'customer',
  };
  const token = generateTestToken(mockUser);
  return { Authorization: `Bearer ${token}` };
}

// ── Express Mocks ───────────────────────────────────────────────────

export function createMockRequest(overrides: Record<string, unknown> = {}): Partial<Request> {
  return {
    body: {},
    query: {},
    params: {},
    headers: {},
    ...overrides,
  } as Partial<Request>;
}

export function createMockResponse(): Partial<Response> & {
  _status: number;
  _json: unknown;
} {
  const res: any = {
    _status: 200,
    _json: null,
    status: jest.fn().mockImplementation(function (this: any, code: number) {
      this._status = code;
      return this;
    }),
    json: jest.fn().mockImplementation(function (this: any, data: unknown) {
      this._json = data;
      return this;
    }),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
  };
  return res;
}

export function createMockNext(): NextFunction {
  return jest.fn() as unknown as NextFunction;
}
