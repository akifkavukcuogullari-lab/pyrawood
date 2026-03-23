import { CartModel, MappedCart } from '../models/cart.model';
import { query } from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';

export const CartService = {
  /**
   * Get the current user's cart with all items and product details.
   */
  async getCart(userId: string): Promise<MappedCart> {
    return CartModel.findOrCreateByUserId(userId);
  },

  /**
   * Add an item to the user's cart after validating product exists and has sufficient stock.
   */
  async addItem(
    userId: string,
    data: { productId: string; variantId?: string; quantity: number }
  ): Promise<MappedCart> {
    // Validate product exists and is active
    const productResult = await query<{ id: string; stock: number; is_active: boolean }>(
      'SELECT id, stock, is_active FROM products WHERE id = $1',
      [data.productId]
    );

    if (!productResult.rows[0]) {
      throw new NotFoundError('Product');
    }

    if (!productResult.rows[0].is_active) {
      throw new ValidationError('Product is no longer available');
    }

    // If variant is specified, validate it exists and belongs to the product
    if (data.variantId) {
      const variantResult = await query<{ id: string; stock: number }>(
        'SELECT id, stock FROM product_variants WHERE id = $1 AND product_id = $2',
        [data.variantId, data.productId]
      );

      if (!variantResult.rows[0]) {
        throw new NotFoundError('Product variant');
      }

      if (variantResult.rows[0].stock < data.quantity) {
        throw new ValidationError(
          `Insufficient stock. Only ${variantResult.rows[0].stock} available.`
        );
      }
    } else {
      if (productResult.rows[0].stock < data.quantity) {
        throw new ValidationError(
          `Insufficient stock. Only ${productResult.rows[0].stock} available.`
        );
      }
    }

    // Get or create cart
    const cart = await CartModel.findOrCreateByUserId(userId);

    // Add item
    await CartModel.addItem(cart.id, data);

    // Return updated cart
    return CartModel.findOrCreateByUserId(userId);
  },

  /**
   * Update the quantity of a cart item. Verifies the item belongs to the user's cart.
   */
  async updateItem(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<MappedCart> {
    // Verify ownership
    const cart = await CartModel.findOrCreateByUserId(userId);
    const cartItemCartId = await CartModel.getItemCartId(itemId);

    if (!cartItemCartId || cartItemCartId !== cart.id) {
      throw new NotFoundError('Cart item');
    }

    const updated = await CartModel.updateItem(itemId, quantity);
    if (!updated) {
      throw new NotFoundError('Cart item');
    }

    return CartModel.findOrCreateByUserId(userId);
  },

  /**
   * Remove an item from the user's cart. Verifies the item belongs to the user's cart.
   */
  async removeItem(userId: string, itemId: string): Promise<MappedCart> {
    // Verify ownership
    const cart = await CartModel.findOrCreateByUserId(userId);
    const cartItemCartId = await CartModel.getItemCartId(itemId);

    if (!cartItemCartId || cartItemCartId !== cart.id) {
      throw new NotFoundError('Cart item');
    }

    const removed = await CartModel.removeItem(itemId);
    if (!removed) {
      throw new NotFoundError('Cart item');
    }

    return CartModel.findOrCreateByUserId(userId);
  },
};
