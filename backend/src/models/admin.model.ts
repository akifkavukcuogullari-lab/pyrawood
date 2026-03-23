import { query } from '../config/database';
import { parsePagination } from '../utils/pagination';
import type { MappedUser } from './user.model';
import type { MappedOrder } from './order.model';

// ── Row interfaces ───────────────────────────────────────────────────

interface StatsRow {
  total_orders: string;
  total_revenue: string;
  total_users: string;
  total_products: string;
}

interface RevenueByMonthRow {
  month: string;
  revenue: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: Date;
}

interface VariantRow {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: string | null;
  stock: number;
  attributes: Record<string, string>;
  created_at: Date;
}

// ── Mapped types ─────────────────────────────────────────────────────

export interface MappedImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface MappedVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  attributes: Record<string, string>;
  createdAt: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: MappedOrder[];
  revenueByMonth: { month: string; revenue: number }[];
}

// ── Mappers ──────────────────────────────────────────────────────────

function mapToUser(row: UserRow): MappedUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapToImage(row: ImageRow): MappedImage {
  return {
    id: row.id,
    productId: row.product_id,
    url: row.url,
    altText: row.alt_text || undefined,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
  };
}

function mapToVariant(row: VariantRow): MappedVariant {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    sku: row.sku || undefined,
    price: row.price ? parseFloat(row.price) : undefined,
    stock: row.stock,
    attributes: row.attributes || {},
    createdAt: row.created_at.toISOString(),
  };
}

// ── Model ────────────────────────────────────────────────────────────

export const AdminModel = {
  /**
   * Get aggregate statistics for the admin dashboard.
   */
  async getStats(): Promise<Omit<AdminStats, 'recentOrders' | 'revenueByMonth'>> {
    const { rows } = await query<StatsRow>(
      `SELECT
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid') AS total_revenue,
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM products WHERE is_active = true) AS total_products`
    );

    const stats = rows[0];
    return {
      totalOrders: parseInt(stats.total_orders, 10),
      totalRevenue: parseFloat(stats.total_revenue),
      totalUsers: parseInt(stats.total_users, 10),
      totalProducts: parseInt(stats.total_products, 10),
    };
  },

  /**
   * Get revenue grouped by month for the last 12 months.
   */
  async getRevenueByMonth(): Promise<{ month: string; revenue: number }[]> {
    const { rows } = await query<RevenueByMonthRow>(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
        COALESCE(SUM(total), 0) AS revenue
       FROM orders
       WHERE payment_status = 'paid'
         AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '11 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at) ASC`
    );

    return rows.map((row) => ({
      month: row.month,
      revenue: parseFloat(row.revenue),
    }));
  },

  /**
   * List all users with pagination.
   */
  async listUsers(
    pagination: { page?: number; limit?: number }
  ): Promise<{ users: MappedUser[]; total: number }> {
    const { page, limit, offset } = parsePagination({
      page: pagination.page,
      limit: pagination.limit,
    });

    const countResult = await query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM users'
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const usersResult = await query<UserRow>(
      `SELECT id, name, email, role, avatar_url, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const users = usersResult.rows.map(mapToUser);

    return { users, total };
  },

  // ── Image CRUD ───────────────────────────────────────────────────

  async addProductImage(
    productId: string,
    url: string,
    altText?: string,
    isPrimary?: boolean
  ): Promise<MappedImage> {
    // If this image is set as primary, unset any existing primary
    if (isPrimary) {
      await query(
        'UPDATE product_images SET is_primary = false WHERE product_id = $1',
        [productId]
      );
    }

    // Get the next sort order
    const sortResult = await query<{ max_sort: number | null }>(
      'SELECT MAX(sort_order) AS max_sort FROM product_images WHERE product_id = $1',
      [productId]
    );
    const nextSort = (sortResult.rows[0].max_sort ?? -1) + 1;

    const { rows } = await query<ImageRow>(
      `INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, product_id, url, alt_text, sort_order, is_primary, created_at`,
      [productId, url, altText || null, nextSort, isPrimary ?? false]
    );

    return mapToImage(rows[0]);
  },

  async updateProductImage(
    imageId: string,
    data: { altText?: string; sortOrder?: number; isPrimary?: boolean }
  ): Promise<MappedImage | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.altText !== undefined) {
      fields.push(`alt_text = $${paramIndex++}`);
      values.push(data.altText);
    }
    if (data.sortOrder !== undefined) {
      fields.push(`sort_order = $${paramIndex++}`);
      values.push(data.sortOrder);
    }
    if (data.isPrimary !== undefined) {
      fields.push(`is_primary = $${paramIndex++}`);
      values.push(data.isPrimary);

      // If setting as primary, unset others for the same product
      if (data.isPrimary) {
        const imgResult = await query<{ product_id: string }>(
          'SELECT product_id FROM product_images WHERE id = $1',
          [imageId]
        );
        if (imgResult.rows[0]) {
          await query(
            'UPDATE product_images SET is_primary = false WHERE product_id = $1 AND id != $2',
            [imgResult.rows[0].product_id, imageId]
          );
        }
      }
    }

    if (fields.length === 0) {
      const { rows } = await query<ImageRow>(
        'SELECT id, product_id, url, alt_text, sort_order, is_primary, created_at FROM product_images WHERE id = $1',
        [imageId]
      );
      return rows[0] ? mapToImage(rows[0]) : null;
    }

    values.push(imageId);

    const { rows } = await query<ImageRow>(
      `UPDATE product_images SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, product_id, url, alt_text, sort_order, is_primary, created_at`,
      values
    );

    return rows[0] ? mapToImage(rows[0]) : null;
  },

  async deleteProductImage(imageId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM product_images WHERE id = $1',
      [imageId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // ── Variant CRUD ─────────────────────────────────────────────────

  async addProductVariant(
    productId: string,
    data: {
      name: string;
      sku?: string;
      price?: number;
      stock?: number;
      attributes?: Record<string, string>;
    }
  ): Promise<MappedVariant> {
    const { rows } = await query<VariantRow>(
      `INSERT INTO product_variants (product_id, name, sku, price, stock, attributes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, product_id, name, sku, price, stock, attributes, created_at`,
      [
        productId,
        data.name,
        data.sku || null,
        data.price ?? null,
        data.stock ?? 0,
        JSON.stringify(data.attributes || {}),
      ]
    );

    return mapToVariant(rows[0]);
  },

  async updateProductVariant(
    variantId: string,
    data: {
      name?: string;
      sku?: string;
      price?: number;
      stock?: number;
      attributes?: Record<string, string>;
    }
  ): Promise<MappedVariant | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.sku !== undefined) {
      fields.push(`sku = $${paramIndex++}`);
      values.push(data.sku);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(data.price);
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(data.stock);
    }
    if (data.attributes !== undefined) {
      fields.push(`attributes = $${paramIndex++}`);
      values.push(JSON.stringify(data.attributes));
    }

    if (fields.length === 0) {
      const { rows } = await query<VariantRow>(
        'SELECT id, product_id, name, sku, price, stock, attributes, created_at FROM product_variants WHERE id = $1',
        [variantId]
      );
      return rows[0] ? mapToVariant(rows[0]) : null;
    }

    values.push(variantId);

    const { rows } = await query<VariantRow>(
      `UPDATE product_variants SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, product_id, name, sku, price, stock, attributes, created_at`,
      values
    );

    return rows[0] ? mapToVariant(rows[0]) : null;
  },

  async deleteProductVariant(variantId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM product_variants WHERE id = $1',
      [variantId]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
