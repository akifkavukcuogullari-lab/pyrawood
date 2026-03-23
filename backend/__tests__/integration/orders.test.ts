import './setup';
import request from 'supertest';
import app from '../../src/app';
import { mockQuery } from './setup';
import { getAuthHeaders } from '../helpers';

// ── Helpers ─────────────────────────────────────────────────────────

const NOW = new Date('2025-06-20T09:00:00.000Z');
const USER_ID = 'b3d7c8a0-1234-4abc-9def-000000000001';
const ORDER_ID = 'a0b1c2d3-e4f5-4abc-9def-000000000001';
const CART_ID = 'c0d1e2f3-a4b5-4abc-9def-000000000001';
const PRODUCT_ID = 'a1b2c3d4-5678-4abc-9def-000000000001';

const SHIPPING_ADDRESS = {
  fullName: 'Elena Woodsworth',
  addressLine1: '742 Evergreen Terrace',
  city: 'Portland',
  state: 'OR',
  postalCode: '97201',
  country: 'US',
};

function orderRow(overrides: Record<string, unknown> = {}) {
  return {
    id: ORDER_ID,
    user_id: USER_ID,
    status: 'pending',
    subtotal: '1299.00',
    tax: '103.92',
    shipping_cost: '0.00',
    total: '1402.92',
    shipping_address: SHIPPING_ADDRESS,
    payment_intent_id: 'pi_test_123456789',
    payment_status: 'pending',
    notes: 'Please leave at the front door.',
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  };
}

function orderItemRow() {
  return {
    id: 'a0a0a0a0-0000-4000-a000-000000000001',
    order_id: ORDER_ID,
    product_id: PRODUCT_ID,
    variant_id: null,
    name: 'Walnut Harvest Dining Table',
    price: '1299.00',
    quantity: 1,
    attributes: {},
    created_at: NOW,
  };
}

function cartRow() {
  return {
    id: CART_ID,
    user_id: USER_ID,
    created_at: NOW,
    updated_at: NOW,
  };
}

function cartItemRow() {
  return {
    id: 'b0b0b0b0-0000-4000-a000-000000000001',
    cart_id: CART_ID,
    product_id: PRODUCT_ID,
    variant_id: null,
    quantity: 1,
    created_at: NOW,
    product_name: 'Walnut Harvest Dining Table',
    product_slug: 'walnut-harvest-dining-table',
    product_description: 'A fine table.',
    product_price: '1299.00',
    product_compare_at_price: null,
    product_is_active: true,
    product_stock: 15,
    product_sku: 'PW-DT-WAL-001',
    product_weight: '45.5',
    product_metadata: {},
    product_category_id: null,
    product_created_at: NOW,
    product_updated_at: NOW,
    image_url: null,
    image_alt_text: null,
    variant_name: null,
    variant_sku: null,
    variant_price: null,
    variant_stock: null,
    variant_attributes: null,
    variant_created_at: null,
  };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Orders Integration', () => {
  // ── POST /api/orders ───────────────────────────────────────────────

  describe('POST /api/orders', () => {
    it('should create an order from the cart (201)', async () => {
      mockQuery(
        // CartModel.findOrCreateByUserId — cart exists
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        // fetch cart items
        { match: /FROM cart_items ci/, rows: [cartItemRow()] },
        // Transaction: BEGIN, INSERT order, INSERT order_item, UPDATE stock, COMMIT
        { match: 'BEGIN', rows: [] },
        { match: /INSERT INTO orders/, rows: [orderRow()] },
        { match: /INSERT INTO order_items/, rows: [orderItemRow()] },
        { match: /UPDATE products SET stock/, rows: [], rowCount: 1 },
        { match: 'COMMIT', rows: [] },
        // CartModel.clearCart
        { match: /DELETE FROM cart_items WHERE cart_id/, rows: [], rowCount: 1 },
        { match: /UPDATE carts SET updated_at/, rows: [], rowCount: 1 }
      );

      const res = await request(app)
        .post('/api/orders')
        .set(getAuthHeaders())
        .send({
          shippingAddress: SHIPPING_ADDRESS,
          paymentIntentId: 'pi_test_123456789',
          notes: 'Please leave at the front door.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(ORDER_ID);
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.total).toBe(1402.92);
      expect(res.body.data.items).toHaveLength(1);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          shippingAddress: SHIPPING_ADDRESS,
          paymentIntentId: 'pi_test_123456789',
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 with missing shipping address', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set(getAuthHeaders())
        .send({ paymentIntentId: 'pi_test_123456789' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/orders ────────────────────────────────────────────────

  describe('GET /api/orders', () => {
    it('should return a paginated list of user orders (200)', async () => {
      mockQuery(
        // count
        { match: /COUNT.*FROM orders/, rows: [{ total: '1' }] },
        // orders
        { match: /FROM orders/, rows: [orderRow()] },
        // order items
        { match: /FROM order_items/, rows: [orderItemRow()] }
      );

      const res = await request(app)
        .get('/api/orders')
        .set(getAuthHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe(ORDER_ID);
      expect(res.body.pagination).toBeDefined();
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(401);
    });
  });

  // ── GET /api/orders/:id ────────────────────────────────────────────

  describe('GET /api/orders/:id', () => {
    it('should return a single order with items (200)', async () => {
      mockQuery(
        // findById
        { match: /FROM orders/, rows: [orderRow()] },
        // order items
        { match: /FROM order_items/, rows: [orderItemRow()] }
      );

      const res = await request(app)
        .get(`/api/orders/${ORDER_ID}`)
        .set(getAuthHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(ORDER_ID);
      expect(res.body.data.items).toHaveLength(1);
    });

    it('should return 404 when order does not exist', async () => {
      mockQuery({ match: /FROM orders/, rows: [] });

      const res = await request(app)
        .get('/api/orders/00000000-0000-4000-a000-000000000099')
        .set(getAuthHeaders());

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 when order belongs to another user', async () => {
      mockQuery(
        {
          match: /FROM orders/,
          rows: [orderRow({ user_id: 'f0f0f0f0-0000-4000-a000-000000000099' })],
        },
        { match: /FROM order_items/, rows: [] }
      );

      const res = await request(app)
        .get(`/api/orders/${ORDER_ID}`)
        .set(getAuthHeaders());

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get(`/api/orders/${ORDER_ID}`);

      expect(res.status).toBe(401);
    });
  });
});
