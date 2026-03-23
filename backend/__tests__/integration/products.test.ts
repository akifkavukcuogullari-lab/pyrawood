import './setup';
import request from 'supertest';
import app from '../../src/app';
import { mockQuery } from './setup';

// ── Helpers ─────────────────────────────────────────────────────────

const NOW = new Date('2025-06-10T08:00:00.000Z');

function productRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'a1b2c3d4-5678-4abc-9def-000000000001',
    name: 'Walnut Harvest Dining Table',
    slug: 'walnut-harvest-dining-table-abc12345',
    description: 'A beautifully crafted walnut dining table for family gatherings.',
    price: '1299.00',
    compare_at_price: '1599.00',
    category_id: 'cat00001-0000-4000-a000-000000000001',
    is_active: true,
    stock: 15,
    sku: 'PW-DT-WAL-001',
    weight: '45.5',
    metadata: {},
    created_at: NOW,
    updated_at: NOW,
    category_name: 'Dining',
    category_slug: 'dining',
    category_description: 'Handcrafted dining furniture.',
    category_image_url: '/images/categories/dining.jpg',
    category_parent_id: null,
    category_sort_order: 1,
    category_created_at: NOW,
    average_rating: '4.5',
    review_count: '12',
    ...overrides,
  };
}

function secondProductRow() {
  return productRow({
    id: 'a1b2c3d4-5678-4abc-9def-000000000002',
    name: 'Oak Craftsman Bookshelf',
    slug: 'oak-craftsman-bookshelf-def67890',
    price: '899.00',
    compare_at_price: null,
    sku: 'PW-BS-OAK-001',
    average_rating: '4.2',
    review_count: '8',
  });
}

// ── Tests ───────────────────────────────────────────────────────────

describe('Products Integration', () => {
  // ── GET /api/products ──────────────────────────────────────────────

  describe('GET /api/products', () => {
    it('should return paginated products (200)', async () => {
      mockQuery(
        { match: 'COUNT', rows: [{ total: '2' }] },
        { match: 'SELECT', rows: [productRow(), secondProductRow()] }
      );

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].name).toBe('Walnut Harvest Dining Table');
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(2);
    });

    it('should pass search query parameter', async () => {
      mockQuery(
        { match: 'COUNT', rows: [{ total: '1' }] },
        { match: 'SELECT', rows: [productRow()] }
      );

      const res = await request(app).get('/api/products?search=walnut');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('should filter by category', async () => {
      mockQuery(
        { match: 'COUNT', rows: [{ total: '1' }] },
        { match: 'SELECT', rows: [productRow()] }
      );

      const res = await request(app).get('/api/products?category=dining');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('should support price range filters', async () => {
      mockQuery(
        { match: 'COUNT', rows: [{ total: '1' }] },
        { match: 'SELECT', rows: [productRow()] }
      );

      const res = await request(app).get('/api/products?minPrice=1000&maxPrice=2000');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should respect pagination parameters', async () => {
      mockQuery(
        { match: 'COUNT', rows: [{ total: '20' }] },
        { match: 'SELECT', rows: [productRow()] }
      );

      const res = await request(app).get('/api/products?page=2&limit=5');

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
      expect(res.body.pagination.total).toBe(20);
      expect(res.body.pagination.totalPages).toBe(4);
    });
  });

  // ── GET /api/products/:id ──────────────────────────────────────────

  describe('GET /api/products/:id', () => {
    it('should return a single product with variants and images (200)', async () => {
      mockQuery(
        { match: /FROM products p/, rows: [productRow()] },
        {
          match: 'product_variants',
          rows: [
            {
              id: 'var-001',
              product_id: 'a1b2c3d4-5678-4abc-9def-000000000001',
              name: 'Natural Finish',
              sku: 'PW-DT-WAL-001-NAT',
              price: '1299.00',
              stock: 8,
              attributes: { finish: 'natural' },
              created_at: NOW,
            },
          ],
        },
        {
          match: 'product_images',
          rows: [
            {
              id: 'img-001',
              product_id: 'a1b2c3d4-5678-4abc-9def-000000000001',
              url: '/images/walnut-table.jpg',
              alt_text: 'Walnut dining table',
              sort_order: 0,
              is_primary: true,
              created_at: NOW,
            },
          ],
        }
      );

      const res = await request(app).get('/api/products/a1b2c3d4-5678-4abc-9def-000000000001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Walnut Harvest Dining Table');
      expect(res.body.data.variants).toHaveLength(1);
      expect(res.body.data.variants[0].name).toBe('Natural Finish');
      expect(res.body.data.images).toHaveLength(1);
      expect(res.body.data.images[0].url).toBe('/images/walnut-table.jpg');
    });

    it('should return 404 when product does not exist', async () => {
      mockQuery({ match: 'SELECT', rows: [] });

      const res = await request(app).get('/api/products/a1b2c3d4-5678-4abc-9def-999999999999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should accept a slug instead of UUID', async () => {
      mockQuery(
        { match: /FROM products p/, rows: [productRow()] },
        { match: 'product_variants', rows: [] },
        { match: 'product_images', rows: [] }
      );

      const res = await request(app).get('/api/products/walnut-harvest-dining-table-abc12345');

      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe('walnut-harvest-dining-table-abc12345');
    });
  });
});
