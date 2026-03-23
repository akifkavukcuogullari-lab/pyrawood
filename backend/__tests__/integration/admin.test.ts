import './setup';
import request from 'supertest';
import app from '../../src/app';
import { mockQuery } from './setup';
import { getAuthHeaders } from '../helpers';

// ── Helpers ─────────────────────────────────────────────────────────

const NOW = new Date('2025-06-20T09:00:00.000Z');
const ADMIN_USER = {
  id: 'ad000001-0000-4000-a000-000000000001',
  email: 'admin@pyrawood.com',
  role: 'admin',
};
const CUSTOMER_USER = {
  id: 'b3d7c8a0-1234-4abc-9def-000000000001',
  email: 'elena@pyrawood.com',
  role: 'customer',
};
const PRODUCT_ID = 'a1b2c3d4-5678-4abc-9def-000000000001';
const ORDER_ID = 'a0b1c2d3-e4f5-4abc-9def-000000000001';

function productRow(overrides: Record<string, unknown> = {}) {
  return {
    id: PRODUCT_ID,
    name: 'Walnut Harvest Dining Table',
    slug: 'walnut-harvest-dining-table-abc12345',
    description: 'A beautifully crafted walnut dining table.',
    price: '1299.00',
    compare_at_price: '1599.00',
    category_id: 'ca000001-0000-4000-a000-000000000001',
    is_active: true,
    stock: 15,
    sku: 'PW-DT-WAL-001',
    weight: '45.5',
    metadata: {},
    created_at: NOW,
    updated_at: NOW,
    category_name: 'Dining',
    category_slug: 'dining',
    category_description: null,
    category_image_url: null,
    category_parent_id: null,
    category_sort_order: 1,
    category_created_at: NOW,
    average_rating: '4.5',
    review_count: '12',
    ...overrides,
  };
}

function orderRow(overrides: Record<string, unknown> = {}) {
  return {
    id: ORDER_ID,
    user_id: 'b3d7c8a0-1234-4abc-9def-000000000001',
    status: 'pending',
    subtotal: '1299.00',
    tax: '103.92',
    shipping_cost: '0.00',
    total: '1402.92',
    shipping_address: {
      fullName: 'Elena Woodsworth',
      addressLine1: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'US',
    },
    payment_intent_id: 'pi_test_123456789',
    payment_status: 'pending',
    notes: null,
    created_at: NOW,
    updated_at: NOW,
    user_name: 'Elena Woodsworth',
    user_email: 'elena@pyrawood.com',
    ...overrides,
  };
}

function userRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'b3d7c8a0-1234-4abc-9def-000000000001',
    name: 'Elena Woodsworth',
    email: 'elena@pyrawood.com',
    role: 'customer',
    avatar_url: null,
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Admin Integration', () => {
  const adminHeaders = getAuthHeaders(ADMIN_USER);
  const customerHeaders = getAuthHeaders(CUSTOMER_USER);

  // ── Auth guard tests (shared across all admin routes) ──────────────

  describe('Authorization', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.status).toBe(401);
    });

    it('should return 403 for non-admin user', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set(customerHeaders);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/admin/stats ───────────────────────────────────────────

  describe('GET /api/admin/stats', () => {
    it('should return dashboard stats for admin (200)', async () => {
      mockQuery(
        // AdminModel.getStats — single row with sub-selects
        {
          match: /total_orders/,
          rows: [
            {
              total_orders: '42',
              total_revenue: '58750.00',
              total_users: '120',
              total_products: '35',
            },
          ],
        },
        // AdminModel.getRevenueByMonth
        {
          match: /TO_CHAR/,
          rows: [
            { month: '2025-05', revenue: '15000.00' },
            { month: '2025-06', revenue: '22000.00' },
          ],
        },
        // OrderModel.findAll for recentOrders: count
        { match: /COUNT/, rows: [{ total: '1' }] },
        // OrderModel.findAll for recentOrders: data
        { match: /FROM orders o/, rows: [orderRow()] },
        // OrderModel.findAll: order items
        { match: /FROM order_items/, rows: [] }
      );

      const res = await request(app)
        .get('/api/admin/stats')
        .set(adminHeaders);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalOrders).toBe(42);
      expect(res.body.data.totalRevenue).toBe(58750);
      expect(res.body.data.totalUsers).toBe(120);
      expect(res.body.data.totalProducts).toBe(35);
      expect(res.body.data.revenueByMonth).toHaveLength(2);
      expect(res.body.data.recentOrders).toBeDefined();
    });
  });

  // ── GET /api/admin/products ────────────────────────────────────────

  describe('GET /api/admin/products', () => {
    it('should list products with pagination (200)', async () => {
      mockQuery(
        { match: /COUNT/, rows: [{ total: '1' }] },
        { match: /FROM products p/, rows: [productRow()] }
      );

      const res = await request(app)
        .get('/api/admin/products')
        .set(adminHeaders);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('should return 403 for customer', async () => {
      const res = await request(app)
        .get('/api/admin/products')
        .set(customerHeaders);
      expect(res.status).toBe(403);
    });
  });

  // ── POST /api/admin/products ───────────────────────────────────────

  describe('POST /api/admin/products', () => {
    it('should create a product (201)', async () => {
      mockQuery({
        match: /INSERT INTO products/,
        rows: [
          productRow({
            name: 'Cherry Nightstand',
            slug: 'cherry-nightstand',
            price: '349.00',
          }),
        ],
      });

      const res = await request(app)
        .post('/api/admin/products')
        .set(adminHeaders)
        .send({
          name: 'Cherry Nightstand',
          price: 349,
          description: 'Elegant cherry wood nightstand.',
          stock: 20,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Cherry Nightstand');
    });

    it('should return 400 with missing required fields', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set(adminHeaders)
        .send({ description: 'No name or price' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 for customer', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set(customerHeaders)
        .send({ name: 'Test', price: 100 });

      expect(res.status).toBe(403);
    });
  });

  // ── PUT /api/admin/products/:id ────────────────────────────────────

  describe('PUT /api/admin/products/:id', () => {
    it('should update a product (200)', async () => {
      mockQuery({
        match: /UPDATE products SET/,
        rows: [productRow({ price: '1399.00' })],
      });

      const res = await request(app)
        .put(`/api/admin/products/${PRODUCT_ID}`)
        .set(adminHeaders)
        .send({ price: 1399 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(1399);
    });

    it('should return 403 for customer', async () => {
      const res = await request(app)
        .put(`/api/admin/products/${PRODUCT_ID}`)
        .set(customerHeaders)
        .send({ price: 1399 });

      expect(res.status).toBe(403);
    });
  });

  // ── GET /api/admin/orders ──────────────────────────────────────────

  describe('GET /api/admin/orders', () => {
    it('should list all orders for admin (200)', async () => {
      mockQuery(
        { match: /COUNT/, rows: [{ total: '1' }] },
        { match: /FROM orders o/, rows: [orderRow()] },
        { match: /FROM order_items/, rows: [] }
      );

      const res = await request(app)
        .get('/api/admin/orders')
        .set(adminHeaders);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].user).toBeDefined();
      expect(res.body.data[0].user.name).toBe('Elena Woodsworth');
    });

    it('should return 403 for customer', async () => {
      const res = await request(app)
        .get('/api/admin/orders')
        .set(customerHeaders);
      expect(res.status).toBe(403);
    });
  });

  // ── PUT /api/admin/orders/:id/status ───────────────────────────────

  describe('PUT /api/admin/orders/:id/status', () => {
    it('should update order status (200)', async () => {
      mockQuery({
        match: /UPDATE orders SET status/,
        rows: [orderRow({ status: 'shipped' })],
      });

      const res = await request(app)
        .put(`/api/admin/orders/${ORDER_ID}/status`)
        .set(adminHeaders)
        .send({ status: 'shipped' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('shipped');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .put(`/api/admin/orders/${ORDER_ID}/status`)
        .set(adminHeaders)
        .send({ status: 'nonexistent' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 for customer', async () => {
      const res = await request(app)
        .put(`/api/admin/orders/${ORDER_ID}/status`)
        .set(customerHeaders)
        .send({ status: 'shipped' });

      expect(res.status).toBe(403);
    });
  });

  // ── GET /api/admin/users ───────────────────────────────────────────

  describe('GET /api/admin/users', () => {
    it('should list users with pagination (200)', async () => {
      mockQuery(
        { match: /COUNT/, rows: [{ total: '3' }] },
        {
          match: /FROM users/,
          rows: [
            userRow(),
            userRow({
              id: 'b0b0b0b0-0000-4000-a000-000000000002',
              name: 'Marcus Oakley',
              email: 'marcus@pyrawood.com',
            }),
            userRow({
              id: 'b0b0b0b0-0000-4000-a000-000000000003',
              name: 'Admin User',
              email: 'admin@pyrawood.com',
              role: 'admin',
            }),
          ],
        }
      );

      const res = await request(app)
        .get('/api/admin/users')
        .set(adminHeaders);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.pagination.total).toBe(3);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.status).toBe(401);
    });

    it('should return 403 for customer', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set(customerHeaders);
      expect(res.status).toBe(403);
    });
  });
});
