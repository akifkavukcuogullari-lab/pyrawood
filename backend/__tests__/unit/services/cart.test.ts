import { NotFoundError, ValidationError } from '../../../src/utils/errors';

// Mock database before importing CartService
jest.mock('../../../src/config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), end: jest.fn(), on: jest.fn() },
  query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
}));

jest.mock('../../../src/models/cart.model');

import { CartService } from '../../../src/services/cart.service';
import { CartModel } from '../../../src/models/cart.model';
import { query } from '../../../src/config/database';

const mockQuery = query as jest.Mock;

const mockCart = {
  id: 'crt00001-0000-4000-a000-000000000001',
  userId: 'b3d7c8a0-1234-4abc-9def-000000000001',
  items: [],
  createdAt: '2025-06-18T12:00:00.000Z',
  updatedAt: '2025-06-18T12:00:00.000Z',
};

const userId = 'b3d7c8a0-1234-4abc-9def-000000000001';
const productId = 'a1b2c3d4-5678-4abc-9def-000000000001';

describe('CartService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getCart', () => {
    it('should return cart with items for a user', async () => {
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);

      const result = await CartService.getCart(userId);

      expect(result.id).toBe(mockCart.id);
      expect(result.userId).toBe(userId);
      expect(CartModel.findOrCreateByUserId).toHaveBeenCalledWith(userId);
    });

    it('should create a cart if none exists', async () => {
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);

      const result = await CartService.getCart('new-user-id');

      expect(CartModel.findOrCreateByUserId).toHaveBeenCalledWith('new-user-id');
      expect(result).toEqual(mockCart);
    });
  });

  describe('addItem', () => {
    it('should throw NotFoundError when product does not exist', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(
        CartService.addItem(userId, { productId, quantity: 1 })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError when product is inactive', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ id: productId, stock: 10, is_active: false }],
        rowCount: 1,
      });

      await expect(
        CartService.addItem(userId, { productId, quantity: 1 })
      ).rejects.toThrow(ValidationError);

      await expect(
        CartService.addItem(userId, { productId, quantity: 1 })
      ).rejects.toThrow('Product is no longer available');
    });

    it('should throw ValidationError when insufficient stock', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ id: productId, stock: 2, is_active: true }],
        rowCount: 1,
      });

      await expect(
        CartService.addItem(userId, { productId, quantity: 5 })
      ).rejects.toThrow(ValidationError);

      await expect(
        CartService.addItem(userId, { productId, quantity: 5 })
      ).rejects.toThrow('Insufficient stock');
    });

    it('should add item to cart when product is valid and in stock', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ id: productId, stock: 10, is_active: true }],
        rowCount: 1,
      });
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);
      (CartModel.addItem as jest.Mock).mockResolvedValue(undefined);

      const result = await CartService.addItem(userId, { productId, quantity: 2 });

      expect(CartModel.addItem).toHaveBeenCalledWith(mockCart.id, {
        productId,
        quantity: 2,
      });
      expect(result).toEqual(mockCart);
    });

    it('should validate variant stock when variantId is provided', async () => {
      const variantId = 'var00001-0000-4000-a000-000000000001';

      // First call: product query
      mockQuery
        .mockResolvedValueOnce({
          rows: [{ id: productId, stock: 10, is_active: true }],
          rowCount: 1,
        })
        // Second call: variant query with insufficient stock
        .mockResolvedValueOnce({
          rows: [{ id: variantId, stock: 1 }],
          rowCount: 1,
        });

      await expect(
        CartService.addItem(userId, { productId, variantId, quantity: 5 })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateItem', () => {
    it('should throw NotFoundError when cart item does not belong to user', async () => {
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);
      (CartModel.getItemCartId as jest.Mock).mockResolvedValue('different-cart-id');

      await expect(
        CartService.updateItem(userId, 'item-id', 3)
      ).rejects.toThrow(NotFoundError);
    });

    it('should update item quantity when item belongs to user cart', async () => {
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);
      (CartModel.getItemCartId as jest.Mock).mockResolvedValue(mockCart.id);
      (CartModel.updateItem as jest.Mock).mockResolvedValue(true);

      const result = await CartService.updateItem(userId, 'item-id', 3);

      expect(CartModel.updateItem).toHaveBeenCalledWith('item-id', 3);
      expect(result).toEqual(mockCart);
    });
  });

  describe('removeItem', () => {
    it('should throw NotFoundError when item does not belong to user cart', async () => {
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);
      (CartModel.getItemCartId as jest.Mock).mockResolvedValue(null);

      await expect(
        CartService.removeItem(userId, 'item-id')
      ).rejects.toThrow(NotFoundError);
    });

    it('should remove item when it belongs to user cart', async () => {
      (CartModel.findOrCreateByUserId as jest.Mock).mockResolvedValue(mockCart);
      (CartModel.getItemCartId as jest.Mock).mockResolvedValue(mockCart.id);
      (CartModel.removeItem as jest.Mock).mockResolvedValue(true);

      const result = await CartService.removeItem(userId, 'item-id');

      expect(CartModel.removeItem).toHaveBeenCalledWith('item-id');
      expect(result).toEqual(mockCart);
    });
  });
});
