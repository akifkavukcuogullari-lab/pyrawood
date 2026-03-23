import { pool, query } from '../config/database';

// ── Row interfaces (snake_case from DB) ──────────────────────────────

interface CartRow {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

interface CartItemRow {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: Date;
  // Joined product fields
  product_name: string;
  product_slug: string;
  product_description: string | null;
  product_price: string;
  product_compare_at_price: string | null;
  product_is_active: boolean;
  product_stock: number;
  product_sku: string | null;
  product_weight: string | null;
  product_metadata: Record<string, unknown>;
  product_category_id: string | null;
  product_created_at: Date;
  product_updated_at: Date;
  // Primary image
  image_url: string | null;
  image_alt_text: string | null;
  // Variant fields
  variant_name: string | null;
  variant_sku: string | null;
  variant_price: string | null;
  variant_stock: number | null;
  variant_attributes: Record<string, string> | null;
  variant_created_at: Date | null;
}

// ── Mapped interfaces (camelCase for API) ────────────────────────────

export interface MappedCartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    isActive: boolean;
    stock: number;
    sku?: string;
    imageUrl?: string;
    imageAltText?: string;
  };
  variant?: {
    id: string;
    productId: string;
    name: string;
    sku?: string;
    price?: number;
    stock: number;
    attributes: Record<string, string>;
    createdAt: string;
  };
  createdAt: string;
}

export interface MappedCart {
  id: string;
  userId: string;
  items: MappedCartItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Mappers ──────────────────────────────────────────────────────────

function mapToCartItem(row: CartItemRow): MappedCartItem {
  const item: MappedCartItem = {
    id: row.id,
    cartId: row.cart_id,
    productId: row.product_id,
    variantId: row.variant_id || undefined,
    quantity: row.quantity,
    product: {
      id: row.product_id,
      name: row.product_name,
      slug: row.product_slug,
      description: row.product_description || undefined,
      price: parseFloat(row.product_price),
      compareAtPrice: row.product_compare_at_price
        ? parseFloat(row.product_compare_at_price)
        : undefined,
      isActive: row.product_is_active,
      stock: row.product_stock,
      sku: row.product_sku || undefined,
      imageUrl: row.image_url || undefined,
      imageAltText: row.image_alt_text || undefined,
    },
    createdAt: row.created_at.toISOString(),
  };

  if (row.variant_id && row.variant_name) {
    item.variant = {
      id: row.variant_id,
      productId: row.product_id,
      name: row.variant_name,
      sku: row.variant_sku || undefined,
      price: row.variant_price ? parseFloat(row.variant_price) : undefined,
      stock: row.variant_stock ?? 0,
      attributes: row.variant_attributes || {},
      createdAt: row.variant_created_at
        ? row.variant_created_at.toISOString()
        : '',
    };
  }

  return item;
}

// ── Model ────────────────────────────────────────────────────────────

export const CartModel = {
  /**
   * Find or create a cart for the given user.
   * Returns the cart with all items, including joined product/variant/image data.
   */
  async findOrCreateByUserId(userId: string): Promise<MappedCart> {
    // Try to find existing cart
    let cartResult = await query<CartRow>(
      'SELECT id, user_id, created_at, updated_at FROM carts WHERE user_id = $1',
      [userId]
    );

    // Create cart if it doesn't exist
    if (!cartResult.rows[0]) {
      cartResult = await query<CartRow>(
        `INSERT INTO carts (user_id) VALUES ($1)
         RETURNING id, user_id, created_at, updated_at`,
        [userId]
      );
    }

    const cart = cartResult.rows[0];

    // Fetch cart items with product details
    const itemsResult = await query<CartItemRow>(
      `SELECT
        ci.id, ci.cart_id, ci.product_id, ci.variant_id, ci.quantity, ci.created_at,
        p.name AS product_name, p.slug AS product_slug, p.description AS product_description,
        p.price AS product_price, p.compare_at_price AS product_compare_at_price,
        p.is_active AS product_is_active, p.stock AS product_stock,
        p.sku AS product_sku, p.weight AS product_weight, p.metadata AS product_metadata,
        p.category_id AS product_category_id, p.created_at AS product_created_at,
        p.updated_at AS product_updated_at,
        pi.url AS image_url, pi.alt_text AS image_alt_text,
        pv.name AS variant_name, pv.sku AS variant_sku, pv.price AS variant_price,
        pv.stock AS variant_stock, pv.attributes AS variant_attributes,
        pv.created_at AS variant_created_at
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at ASC`,
      [cart.id]
    );

    return {
      id: cart.id,
      userId: cart.user_id,
      items: itemsResult.rows.map(mapToCartItem),
      createdAt: cart.created_at.toISOString(),
      updatedAt: cart.updated_at.toISOString(),
    };
  },

  /**
   * Add item to cart. If the same product+variant already exists, increment quantity.
   */
  async addItem(
    cartId: string,
    data: { productId: string; variantId?: string; quantity: number }
  ): Promise<void> {
    await query(
      `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cart_id, product_id, variant_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, data.productId, data.variantId || null, data.quantity]
    );

    // Update cart timestamp
    await query('UPDATE carts SET updated_at = NOW() WHERE id = $1', [cartId]);
  },

  /**
   * Update the quantity of a specific cart item.
   */
  async updateItem(itemId: string, quantity: number): Promise<boolean> {
    const result = await query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2',
      [quantity, itemId]
    );

    if ((result.rowCount ?? 0) > 0) {
      // Update cart timestamp
      await query(
        `UPDATE carts SET updated_at = NOW()
         WHERE id = (SELECT cart_id FROM cart_items WHERE id = $1)`,
        [itemId]
      );
    }

    return (result.rowCount ?? 0) > 0;
  },

  /**
   * Remove a specific item from the cart.
   */
  async removeItem(itemId: string): Promise<boolean> {
    // Get cart_id before deleting
    const itemResult = await query<{ cart_id: string }>(
      'SELECT cart_id FROM cart_items WHERE id = $1',
      [itemId]
    );

    const result = await query('DELETE FROM cart_items WHERE id = $1', [itemId]);

    if ((result.rowCount ?? 0) > 0 && itemResult.rows[0]) {
      await query('UPDATE carts SET updated_at = NOW() WHERE id = $1', [
        itemResult.rows[0].cart_id,
      ]);
    }

    return (result.rowCount ?? 0) > 0;
  },

  /**
   * Remove all items from a cart.
   */
  async clearCart(cartId: string): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    await query('UPDATE carts SET updated_at = NOW() WHERE id = $1', [cartId]);
  },

  /**
   * Calculate the subtotal of all items in the cart.
   * Uses variant price when available, otherwise product price.
   */
  async getCartTotal(cartId: string): Promise<number> {
    const result = await query<{ subtotal: string }>(
      `SELECT COALESCE(SUM(
        ci.quantity * COALESCE(pv.price, p.price)
      ), 0) AS subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.cart_id = $1`,
      [cartId]
    );

    return parseFloat(result.rows[0].subtotal);
  },

  /**
   * Get the cart_id for a given item, used for ownership verification.
   */
  async getItemCartId(itemId: string): Promise<string | null> {
    const result = await query<{ cart_id: string }>(
      'SELECT cart_id FROM cart_items WHERE id = $1',
      [itemId]
    );
    return result.rows[0]?.cart_id || null;
  },
};
