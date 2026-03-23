import { OrderModel, MappedOrder } from '../models/order.model';
import { CartModel } from '../models/cart.model';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';
import { buildPaginationResponse } from '../utils/pagination';

interface PaginatedOrders {
  orders: MappedOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const OrderService = {
  /**
   * Create an order from the user's current cart.
   * Validates the cart is not empty, creates the order, and clears the cart.
   */
  async createFromCart(
    userId: string,
    shippingAddress: MappedOrder['shippingAddress'],
    paymentIntentId: string,
    notes?: string
  ): Promise<MappedOrder> {
    // Get user's cart
    const cart = await CartModel.findOrCreateByUserId(userId);

    if (cart.items.length === 0) {
      throw new ValidationError('Cart is empty');
    }

    // Validate all items are still available and in stock
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new ValidationError(
          `Product "${item.product.name}" is no longer available`
        );
      }

      const availableStock = item.variant?.stock ?? item.product.stock;
      if (availableStock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for "${item.product.name}". Only ${availableStock} available.`
        );
      }
    }

    // Create the order (with transaction, stock deduction)
    const order = await OrderModel.create(
      userId,
      cart.items,
      shippingAddress,
      paymentIntentId,
      notes
    );

    // Clear the cart after successful order creation
    await CartModel.clearCart(cart.id);

    return order;
  },

  /**
   * Get paginated list of orders for a user.
   */
  async getOrders(
    userId: string,
    params: { page?: number; limit?: number }
  ): Promise<PaginatedOrders> {
    const { orders, total } = await OrderModel.findByUserId(userId, params);
    const pagination = buildPaginationResponse(
      total,
      params.page || 1,
      params.limit || 12
    );
    return { orders, pagination };
  },

  /**
   * Get a single order by ID. Verifies the order belongs to the requesting user.
   */
  async getOrderById(userId: string, orderId: string): Promise<MappedOrder> {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.userId !== userId) {
      throw new ForbiddenError();
    }

    return order;
  },

  /**
   * Update order status (admin operation).
   */
  async updateStatus(orderId: string, status: string): Promise<MappedOrder> {
    const order = await OrderModel.updateStatus(orderId, status);

    if (!order) {
      throw new NotFoundError('Order');
    }

    return order;
  },

  /**
   * Get all orders (admin). Returns paginated results with user info.
   */
  async getAllOrders(params: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedOrders> {
    const { orders, total } = await OrderModel.findAll(params);
    const pagination = buildPaginationResponse(
      total,
      params.page || 1,
      params.limit || 12
    );
    return { orders, pagination };
  },
};
