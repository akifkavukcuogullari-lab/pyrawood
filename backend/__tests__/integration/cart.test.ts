import './setup';
import request from 'supertest';
import app from '../../src/app';
import { mockQuery } from './setup';
import { getAuthHeaders } from '../helpers';

// ── Helpers ─────────────────────────────────────────────────────────

const NOW = new Date('2025-06-18T12:00:00.000Z');
const USER_ID = 'b3d7c8a0-1234-4abc-9def-000000000001';
const CART_ID = 'c0d1e2f3-a4b5-4abc-9def-000000000001';
const PRODUCT_ID = 'a1b2c3d4-5678-4abc-9def-000000000001';
const CART_ITEM_ID = 'c1c1c1c1-0000-4000-a000-000000000001';

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
    id: CART_ITEM_ID,
    cart_id: CART_ID,
    product_id: PRODUCT_ID,
    variant_id: null,
    quantity: 2,
    created_at: NOW,
    product_name: 'Walnut Harvest Dining Table',
    product_slug: 'walnut-harvest-dining-table-abc12345',
    product_description: 'A beautifully crafted walnut dining table.',
    product_price: '1299.00',
    product_compare_at_price: '1599.00',
    product_is_active: true,
    product_stock: 15,
    product_sku: 'PW-DT-WAL-001',
    product_weight: '45.5',
    product_metadata: {},
    product_category_id: null,
    product_created_at: NOW,
    product_updated_at: NOW,
    image_url: '/images/walnut-table.jpg',
    image_alt_text: 'Walnut table',
    variant_name: null,
    variant_sku: null,
    variant_price: null,
    variant_stock: null,
    variant_attributes: null,
    variant_created_at: null,
  };
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Cart Integration', () => {
  // ── GET /api/cart ──────────────────────────────────────────────────

  describe('GET /api/cart', () => {
    it('should return the user cart with items (200)', async () => {
      mockQuery(
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        { match: /FROM cart_items ci/, rows: [cartItemRow()] }
      );

      const res = await request(app)
        .get('/api/cart')
        .set(getAuthHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(CART_ID);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].product.name).toBe('Walnut Harvest Dining Table');
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should create cart if none exists', async () => {
      mockQuery(
        // findOrCreateByUserId: first SELECT returns nothing
        { match: /FROM carts WHERE/, rows: [] },
        // INSERT INTO carts
        { match: /INSERT INTO carts/, rows: [cartRow()] },
        // fetch items (empty)
        { match: /FROM cart_items ci/, rows: [] }
      );

      const res = await request(app)
        .get('/api/cart')
        .set(getAuthHeaders());

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(0);
    });
  });

  // ── POST /api/cart/items ───────────────────────────────────────────

  describe('POST /api/cart/items', () => {
    it('should add an item to the cart (200)', async () => {
      mockQuery(
        // Validate product exists
        {
          match: /SELECT id, stock, is_active FROM products/,
          rows: [{ id: PRODUCT_ID, stock: 15, is_active: true }],
        },
        // findOrCreateByUserId: cart exists (1st call)
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        // fetch items for first findOrCreate
        { match: /FROM cart_items ci/, rows: [] },
        // addItem INSERT
        { match: /INSERT INTO cart_items/, rows: [], rowCount: 1 },
        // update cart timestamp
        { match: /UPDATE carts SET updated_at/, rows: [], rowCount: 1 },
        // second findOrCreateByUserId for return value
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        { match: /FROM cart_items ci/, rows: [cartItemRow()] }
      );

      const res = await request(app)
        .post('/api/cart/items')
        .set(getAuthHeaders())
        .send({ productId: PRODUCT_ID, quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .send({ productId: PRODUCT_ID, quantity: 1 });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid body (missing productId)', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set(getAuthHeaders())
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── PUT /api/cart/items/:id ────────────────────────────────────────

  describe('PUT /api/cart/items/:id', () => {
    it('should update item quantity (200)', async () => {
      mockQuery(
        // findOrCreateByUserId (1st call — ownership check)
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        { match: /FROM cart_items ci/, rows: [cartItemRow()] },
        // getItemCartId
        { match: /SELECT cart_id FROM cart_items WHERE id/, rows: [{ cart_id: CART_ID }] },
        // updateItem
        { match: /UPDATE cart_items SET quantity/, rows: [], rowCount: 1 },
        // update cart timestamp after item update
        { match: /UPDATE carts SET updated_at/, rows: [], rowCount: 1 },
        // findOrCreateByUserId (return updated cart)
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        { match: /FROM cart_items ci/, rows: [cartItemRow()] }
      );

      const res = await request(app)
        .put(`/api/cart/items/${CART_ITEM_ID}`)
        .set(getAuthHeaders())
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .put(`/api/cart/items/${CART_ITEM_ID}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(401);
    });
  });

  // ── DELETE /api/cart/items/:id ─────────────────────────────────────

  describe('DELETE /api/cart/items/:id', () => {
    it('should remove an item from the cart (200)', async () => {
      mockQuery(
        // findOrCreateByUserId (ownership check)
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        { match: /FROM cart_items ci/, rows: [cartItemRow()] },
        // getItemCartId
        { match: /SELECT cart_id FROM cart_items WHERE id/, rows: [{ cart_id: CART_ID }] },
        // removeItem: get cart_id before deleting
        { match: /SELECT cart_id FROM cart_items/, rows: [{ cart_id: CART_ID }] },
        // removeItem: DELETE
        { match: /DELETE FROM cart_items/, rows: [], rowCount: 1 },
        // removeItem: update cart timestamp
        { match: /UPDATE carts SET updated_at/, rows: [], rowCount: 1 },
        // findOrCreateByUserId (return updated cart)
        { match: /FROM carts WHERE/, rows: [cartRow()] },
        { match: /FROM cart_items ci/, rows: [] }
      );

      const res = await request(app)
        .delete(`/api/cart/items/${CART_ITEM_ID}`)
        .set(getAuthHeaders());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .delete(`/api/cart/items/${CART_ITEM_ID}`);

      expect(res.status).toBe(401);
    });
  });
});
