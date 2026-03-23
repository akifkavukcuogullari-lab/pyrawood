import { pool, query } from '../config/database';
import { parsePagination } from '../utils/pagination';
import type { MappedCartItem } from './cart.model';

// ── Row interfaces (snake_case from DB) ──────────────────────────────

interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  subtotal: string;
  tax: string;
  shipping_cost: string;
  total: string;
  shipping_address: Record<string, unknown>;
  payment_intent_id: string | null;
  payment_status: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  // Joined user fields (for admin queries)
  user_name?: string;
  user_email?: string;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  price: string;
  quantity: number;
  attributes: Record<string, string>;
  created_at: Date;
}

// ── Mapped interfaces (camelCase for API) ────────────────────────────

export interface MappedOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  attributes: Record<string, string>;
}

export interface MappedOrder {
  id: string;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  status: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentIntentId?: string;
  paymentStatus: string;
  notes?: string;
  items: MappedOrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Constants ────────────────────────────────────────────────────────

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

// ── Mappers ──────────────────────────────────────────────────────────

function mapToOrder(row: OrderRow): MappedOrder {
  const order: MappedOrder = {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    subtotal: parseFloat(row.subtotal),
    tax: parseFloat(row.tax),
    shippingCost: parseFloat(row.shipping_cost),
    total: parseFloat(row.total),
    shippingAddress: row.shipping_address as MappedOrder['shippingAddress'],
    paymentIntentId: row.payment_intent_id || undefined,
    paymentStatus: row.payment_status,
    notes: row.notes || undefined,
    items: [],
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };

  if (row.user_name && row.user_email) {
    order.user = {
      name: row.user_name,
      email: row.user_email,
    };
  }

  return order;
}

function mapToOrderItem(row: OrderItemRow): MappedOrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    variantId: row.variant_id || undefined,
    name: row.name,
    price: parseFloat(row.price),
    quantity: row.quantity,
    attributes: row.attributes || {},
  };
}

// ── Model ────────────────────────────────────────────────────────────

export const OrderModel = {
  /**
   * Create an order from cart items in a single transaction.
   * Calculates subtotal, tax (8%), shipping (free over $500, else $50), and total.
   */
  async create(
    userId: string,
    cartItems: MappedCartItem[],
    shippingAddress: MappedOrder['shippingAddress'],
    paymentIntentId: string,
    notes?: string
  ): Promise<MappedOrder> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => {
        const price = item.variant?.price ?? item.product.price;
        return sum + price * item.quantity;
      }, 0);

      const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
      const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

      // Create order
      const orderResult = await client.query<OrderRow>(
        `INSERT INTO orders (user_id, subtotal, tax, shipping_cost, total, shipping_address, payment_intent_id, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, user_id, status, subtotal, tax, shipping_cost, total, shipping_address,
                   payment_intent_id, payment_status, notes, created_at, updated_at`,
        [
          userId,
          subtotal,
          tax,
          shippingCost,
          total,
          JSON.stringify(shippingAddress),
          paymentIntentId,
          notes || null,
        ]
      );

      const order = mapToOrder(orderResult.rows[0]);

      // Create order items
      const orderItems: MappedOrderItem[] = [];
      for (const item of cartItems) {
        const price = item.variant?.price ?? item.product.price;
        const attributes = item.variant?.attributes ?? {};

        const itemResult = await client.query<OrderItemRow>(
          `INSERT INTO order_items (order_id, product_id, variant_id, name, price, quantity, attributes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, order_id, product_id, variant_id, name, price, quantity, attributes, created_at`,
          [
            order.id,
            item.productId,
            item.variantId || null,
            item.product.name,
            price,
            item.quantity,
            JSON.stringify(attributes),
          ]
        );

        orderItems.push(mapToOrderItem(itemResult.rows[0]));
      }

      // Deduct stock for each item
      for (const item of cartItems) {
        if (item.variantId) {
          await client.query(
            'UPDATE product_variants SET stock = stock - $1 WHERE id = $2',
            [item.quantity, item.variantId]
          );
        } else {
          await client.query(
            'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
            [item.quantity, item.productId]
          );
        }
      }

      await client.query('COMMIT');

      order.items = orderItems;
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Find all orders for a given user with pagination.
   */
  async findByUserId(
    userId: string,
    pagination: { page?: number; limit?: number }
  ): Promise<{ orders: MappedOrder[]; total: number }> {
    const { page, limit, offset } = parsePagination({
      page: pagination.page,
      limit: pagination.limit,
    });

    // Count
    const countResult = await query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM orders WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Fetch orders
    const ordersResult = await query<OrderRow>(
      `SELECT id, user_id, status, subtotal, tax, shipping_cost, total,
              shipping_address, payment_intent_id, payment_status, notes,
              created_at, updated_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const orders = ordersResult.rows.map(mapToOrder);

    // Fetch items for all orders in a single query
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      const itemsResult = await query<OrderItemRow>(
        `SELECT id, order_id, product_id, variant_id, name, price, quantity, attributes, created_at
         FROM order_items
         WHERE order_id = ANY($1)
         ORDER BY created_at ASC`,
        [orderIds]
      );

      const itemsByOrderId = new Map<string, MappedOrderItem[]>();
      for (const row of itemsResult.rows) {
        const mapped = mapToOrderItem(row);
        const existing = itemsByOrderId.get(row.order_id) || [];
        existing.push(mapped);
        itemsByOrderId.set(row.order_id, existing);
      }

      for (const order of orders) {
        order.items = itemsByOrderId.get(order.id) || [];
      }
    }

    return { orders, total };
  },

  /**
   * Find a single order by ID with its items.
   */
  async findById(id: string): Promise<MappedOrder | null> {
    const orderResult = await query<OrderRow>(
      `SELECT id, user_id, status, subtotal, tax, shipping_cost, total,
              shipping_address, payment_intent_id, payment_status, notes,
              created_at, updated_at
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (!orderResult.rows[0]) return null;

    const order = mapToOrder(orderResult.rows[0]);

    const itemsResult = await query<OrderItemRow>(
      `SELECT id, order_id, product_id, variant_id, name, price, quantity, attributes, created_at
       FROM order_items
       WHERE order_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    order.items = itemsResult.rows.map(mapToOrderItem);

    return order;
  },

  /**
   * Update the status of an order.
   */
  async updateStatus(id: string, status: string): Promise<MappedOrder | null> {
    const result = await query<OrderRow>(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, user_id, status, subtotal, tax, shipping_cost, total,
                 shipping_address, payment_intent_id, payment_status, notes,
                 created_at, updated_at`,
      [status, id]
    );

    if (!result.rows[0]) return null;
    return mapToOrder(result.rows[0]);
  },

  /**
   * Update payment status by Stripe payment_intent_id.
   */
  async updatePaymentStatus(
    paymentIntentId: string,
    paymentStatus: string
  ): Promise<MappedOrder | null> {
    const result = await query<OrderRow>(
      `UPDATE orders SET payment_status = $1, updated_at = NOW()
       WHERE payment_intent_id = $2
       RETURNING id, user_id, status, subtotal, tax, shipping_cost, total,
                 shipping_address, payment_intent_id, payment_status, notes,
                 created_at, updated_at`,
      [paymentStatus, paymentIntentId]
    );

    if (!result.rows[0]) return null;
    return mapToOrder(result.rows[0]);
  },

  /**
   * Find all orders (admin). Includes user info and pagination.
   */
  async findAll(pagination: {
    page?: number;
    limit?: number;
  }): Promise<{ orders: MappedOrder[]; total: number }> {
    const { page, limit, offset } = parsePagination({
      page: pagination.page,
      limit: pagination.limit,
    });

    const countResult = await query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM orders'
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const ordersResult = await query<OrderRow>(
      `SELECT o.id, o.user_id, o.status, o.subtotal, o.tax, o.shipping_cost, o.total,
              o.shipping_address, o.payment_intent_id, o.payment_status, o.notes,
              o.created_at, o.updated_at,
              u.name AS user_name, u.email AS user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const orders = ordersResult.rows.map(mapToOrder);

    // Fetch items for all orders
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      const itemsResult = await query<OrderItemRow>(
        `SELECT id, order_id, product_id, variant_id, name, price, quantity, attributes, created_at
         FROM order_items
         WHERE order_id = ANY($1)
         ORDER BY created_at ASC`,
        [orderIds]
      );

      const itemsByOrderId = new Map<string, MappedOrderItem[]>();
      for (const row of itemsResult.rows) {
        const mapped = mapToOrderItem(row);
        const existing = itemsByOrderId.get(row.order_id) || [];
        existing.push(mapped);
        itemsByOrderId.set(row.order_id, existing);
      }

      for (const order of orders) {
        order.items = itemsByOrderId.get(order.id) || [];
      }
    }

    return { orders, total };
  },
};
