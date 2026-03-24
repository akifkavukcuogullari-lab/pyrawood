import { query } from '../config/database';
import { parsePagination } from '../utils/pagination';

// ── Row interfaces (snake_case from DB) ──────────────────────────────

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string; // NUMERIC comes as string from pg
  compare_at_price: string | null;
  category_id: string | null;
  is_active: boolean;
  stock: number;
  sku: string | null;
  weight: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  // Joined category fields
  category_name?: string;
  category_slug?: string;
  category_description?: string;
  category_image_url?: string;
  category_parent_id?: string;
  category_sort_order?: number;
  category_created_at?: Date;
  // Aggregated review fields
  average_rating?: string | null;
  review_count?: string | null;
}

export interface VariantRow {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: string | null;
  stock: number;
  attributes: Record<string, string>;
  created_at: Date;
}

export interface ImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: Date;
}

// ── Mapped interfaces (camelCase for API) ────────────────────────────

export interface MappedCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder: number;
  createdAt: string;
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

export interface MappedImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface MappedProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId?: string;
  category?: MappedCategory;
  isActive: boolean;
  stock: number;
  sku?: string;
  weight?: number;
  metadata: Record<string, unknown>;
  variants: MappedVariant[];
  images: MappedImage[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

// ── Mappers ──────────────────────────────────────────────────────────

function mapToProduct(row: ProductRow): MappedProduct {
  const product: MappedProduct = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || undefined,
    price: parseFloat(row.price),
    compareAtPrice: row.compare_at_price ? parseFloat(row.compare_at_price) : undefined,
    categoryId: row.category_id || undefined,
    isActive: row.is_active,
    stock: row.stock,
    sku: row.sku || undefined,
    weight: row.weight ? parseFloat(row.weight) : undefined,
    metadata: row.metadata || {},
    variants: [],
    images: [],
    averageRating: row.average_rating ? parseFloat(row.average_rating) : undefined,
    reviewCount: row.review_count ? parseInt(row.review_count, 10) : undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };

  // Attach joined category if present
  if (row.category_id && row.category_name) {
    product.category = {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug!,
      description: row.category_description || undefined,
      imageUrl: row.category_image_url || undefined,
      parentId: row.category_parent_id || undefined,
      sortOrder: row.category_sort_order ?? 0,
      createdAt: row.category_created_at ? row.category_created_at.toISOString() : '',
    };
  }

  return product;
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

// ── Sort mapping ─────────────────────────────────────────────────────

const SORT_MAP: Record<string, string> = {
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
  name_asc: 'p.name ASC',
  name_desc: 'p.name DESC',
  newest: 'p.created_at DESC',
  rating: 'average_rating DESC NULLS LAST',
};

// ── Model ────────────────────────────────────────────────────────────

export const ProductModel = {
  async findAll(
    params: ProductListParams
  ): Promise<{ products: MappedProduct[]; total: number }> {
    const { page, limit, offset } = parsePagination({
      page: params.page,
      limit: params.limit,
    });

    const conditions: string[] = ['p.is_active = true'];
    const values: unknown[] = [];
    let paramIndex = 1;

    // Full-text search
    if (params.search) {
      conditions.push(
        `to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', $${paramIndex})`
      );
      values.push(params.search);
      paramIndex++;
    }

    // Category filter (accepts UUID or slug)
    if (params.category) {
      conditions.push(
        `(c.id::text = $${paramIndex} OR c.slug = $${paramIndex})`
      );
      values.push(params.category);
      paramIndex++;
    }

    // Price range
    if (params.minPrice !== undefined) {
      conditions.push(`p.price >= $${paramIndex}`);
      values.push(params.minPrice);
      paramIndex++;
    }
    if (params.maxPrice !== undefined) {
      conditions.push(`p.price <= $${paramIndex}`);
      values.push(params.maxPrice);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = SORT_MAP[params.sort || 'newest'] || SORT_MAP.newest;

    // Count query
    const countSql = `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countResult = await query<{ total: string }>(countSql, values);
    const total = parseInt(countResult.rows[0].total, 10);

    // Data query
    const dataSql = `
      SELECT
        p.id, p.name, p.slug, p.description, p.price, p.compare_at_price,
        p.category_id, p.is_active, p.stock, p.sku, p.weight, p.metadata,
        p.created_at, p.updated_at,
        c.name AS category_name, c.slug AS category_slug,
        c.description AS category_description, c.image_url AS category_image_url,
        c.parent_id AS category_parent_id, c.sort_order AS category_sort_order,
        c.created_at AS category_created_at,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON r.product_id = p.id
      ${whereClause}
      GROUP BY p.id, c.id
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataValues = [...values, limit, offset];
    const dataResult = await query<ProductRow>(dataSql, dataValues);
    const products = dataResult.rows.map(mapToProduct);

    // Batch-fetch images for all returned products
    if (products.length > 0) {
      const productIds = products.map((p) => p.id);
      const imgResult = await query<ImageRow>(
        `SELECT id, product_id, url, alt_text, sort_order, is_primary
         FROM product_images
         WHERE product_id = ANY($1)
         ORDER BY sort_order ASC`,
        [productIds]
      );

      const imagesByProduct = new Map<string, MappedImage[]>();
      for (const row of imgResult.rows) {
        const mapped = mapToImage(row);
        const list = imagesByProduct.get(row.product_id) || [];
        list.push(mapped);
        imagesByProduct.set(row.product_id, list);
      }

      for (const product of products) {
        product.images = imagesByProduct.get(product.id) || [];
      }
    }

    return { products, total };
  },

  async findById(id: string): Promise<MappedProduct | null> {
    // Supports lookup by UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const productSql = `
      SELECT
        p.id, p.name, p.slug, p.description, p.price, p.compare_at_price,
        p.category_id, p.is_active, p.stock, p.sku, p.weight, p.metadata,
        p.created_at, p.updated_at,
        c.name AS category_name, c.slug AS category_slug,
        c.description AS category_description, c.image_url AS category_image_url,
        c.parent_id AS category_parent_id, c.sort_order AS category_sort_order,
        c.created_at AS category_created_at,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ${isUuid ? 'p.id = $1' : 'p.slug = $1'}
      GROUP BY p.id, c.id
    `;

    const { rows } = await query<ProductRow>(productSql, [id]);
    if (!rows[0]) return null;

    const product = mapToProduct(rows[0]);

    // Fetch variants
    const variantsResult = await query<VariantRow>(
      'SELECT id, product_id, name, sku, price, stock, attributes, created_at FROM product_variants WHERE product_id = $1 ORDER BY created_at ASC',
      [product.id]
    );
    product.variants = variantsResult.rows.map(mapToVariant);

    // Fetch images
    const imagesResult = await query<ImageRow>(
      'SELECT id, product_id, url, alt_text, sort_order, is_primary, created_at FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC',
      [product.id]
    );
    product.images = imagesResult.rows.map(mapToImage);

    return product;
  },

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    categoryId?: string;
    isActive?: boolean;
    stock?: number;
    sku?: string;
    weight?: number;
    metadata?: Record<string, unknown>;
  }): Promise<MappedProduct> {
    const { rows } = await query<ProductRow>(
      `INSERT INTO products (name, slug, description, price, compare_at_price, category_id, is_active, stock, sku, weight, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, slug, description, price, compare_at_price, category_id, is_active, stock, sku, weight, metadata, created_at, updated_at`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.price,
        data.compareAtPrice ?? null,
        data.categoryId || null,
        data.isActive ?? true,
        data.stock ?? 0,
        data.sku || null,
        data.weight ?? null,
        JSON.stringify(data.metadata || {}),
      ]
    );

    const product = mapToProduct(rows[0]);
    product.variants = [];
    product.images = [];
    return product;
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      price: number;
      compareAtPrice: number;
      categoryId: string;
      isActive: boolean;
      stock: number;
      sku: string;
      weight: number;
      metadata: Record<string, unknown>;
    }>
  ): Promise<MappedProduct | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.slug !== undefined) {
      fields.push(`slug = $${paramIndex++}`);
      values.push(data.slug);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(data.price);
    }
    if (data.compareAtPrice !== undefined) {
      fields.push(`compare_at_price = $${paramIndex++}`);
      values.push(data.compareAtPrice);
    }
    if (data.categoryId !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(data.categoryId);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(data.isActive);
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(data.stock);
    }
    if (data.sku !== undefined) {
      fields.push(`sku = $${paramIndex++}`);
      values.push(data.sku);
    }
    if (data.weight !== undefined) {
      fields.push(`weight = $${paramIndex++}`);
      values.push(data.weight);
    }
    if (data.metadata !== undefined) {
      fields.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(data.metadata));
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await query<ProductRow>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, name, slug, description, price, compare_at_price, category_id, is_active, stock, sku, weight, metadata, created_at, updated_at`,
      values
    );

    if (!rows[0]) return null;

    const product = mapToProduct(rows[0]);
    product.variants = [];
    product.images = [];
    return product;
  },

  async delete(id: string): Promise<boolean> {
    // Soft delete by setting is_active = false
    const result = await query(
      'UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
