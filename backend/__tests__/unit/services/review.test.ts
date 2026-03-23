import { ReviewService } from '../../../src/services/review.service';
import { ReviewModel } from '../../../src/models/review.model';
import { ProductModel } from '../../../src/models/product.model';
import { NotFoundError, ConflictError } from '../../../src/utils/errors';

jest.mock('../../../src/models/review.model');
jest.mock('../../../src/models/product.model');

const productId = 'a1b2c3d4-5678-4abc-9def-000000000001';
const userId = 'b3d7c8a0-1234-4abc-9def-000000000001';

const mockProduct = {
  id: productId,
  name: 'Walnut Harvest Dining Table',
  slug: 'walnut-harvest-dining-table-abc12345',
  price: 1299,
  isActive: true,
  stock: 15,
  metadata: {},
  variants: [],
  images: [],
  createdAt: '2025-06-10T08:00:00.000Z',
  updatedAt: '2025-06-12T14:30:00.000Z',
};

const mockReview = {
  id: 'rev00001-0000-4000-a000-000000000001',
  productId,
  userId,
  user: { id: userId, name: 'Elena Woodsworth', avatarUrl: undefined },
  rating: 5,
  title: 'Absolutely stunning craftsmanship',
  body: 'The walnut grain on this table is gorgeous.',
  createdAt: '2025-06-22T16:00:00.000Z',
};

describe('ReviewService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getByProductId', () => {
    it('should return paginated reviews for an existing product', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);
      (ReviewModel.findByProductId as jest.Mock).mockResolvedValue({
        reviews: [mockReview],
        total: 1,
      });

      const result = await ReviewService.getByProductId(productId, { page: 1, limit: 12 });

      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].rating).toBe(5);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
      });
    });

    it('should throw NotFoundError when product does not exist', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ReviewService.getByProductId('nonexistent-product', { page: 1 })
      ).rejects.toThrow(NotFoundError);
    });

    it('should pass pagination params to ReviewModel', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);
      (ReviewModel.findByProductId as jest.Mock).mockResolvedValue({
        reviews: [],
        total: 0,
      });

      await ReviewService.getByProductId(productId, { page: 3, limit: 5 });

      expect(ReviewModel.findByProductId).toHaveBeenCalledWith(productId, { page: 3, limit: 5 });
    });
  });

  describe('create', () => {
    it('should create a review for a valid product', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);
      (ReviewModel.findByUserAndProduct as jest.Mock).mockResolvedValue(null);
      (ReviewModel.create as jest.Mock).mockResolvedValue(mockReview);

      const result = await ReviewService.create(productId, userId, {
        rating: 5,
        title: 'Absolutely stunning craftsmanship',
        body: 'The walnut grain on this table is gorgeous.',
      });

      expect(result.rating).toBe(5);
      expect(result.productId).toBe(productId);
      expect(ReviewModel.create).toHaveBeenCalledWith(productId, userId, {
        rating: 5,
        title: 'Absolutely stunning craftsmanship',
        body: 'The walnut grain on this table is gorgeous.',
      });
    });

    it('should throw NotFoundError when product does not exist', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ReviewService.create('nonexistent', userId, { rating: 4 })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError when user has already reviewed the product', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);
      (ReviewModel.findByUserAndProduct as jest.Mock).mockResolvedValue(mockReview);

      await expect(
        ReviewService.create(productId, userId, { rating: 3 })
      ).rejects.toThrow(ConflictError);

      await expect(
        ReviewService.create(productId, userId, { rating: 3 })
      ).rejects.toThrow('You have already reviewed this product');
    });

    it('should allow creating a review with only rating (no title or body)', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);
      (ReviewModel.findByUserAndProduct as jest.Mock).mockResolvedValue(null);
      (ReviewModel.create as jest.Mock).mockResolvedValue({
        ...mockReview,
        title: undefined,
        body: undefined,
      });

      const result = await ReviewService.create(productId, userId, { rating: 4 });

      expect(ReviewModel.create).toHaveBeenCalledWith(productId, userId, { rating: 4 });
      expect(result.title).toBeUndefined();
      expect(result.body).toBeUndefined();
    });
  });
});
