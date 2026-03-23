import { ReviewModel, MappedReview } from '../models/review.model';
import { ProductModel } from '../models/product.model';
import { NotFoundError, ConflictError } from '../utils/errors';
import { buildPaginationResponse } from '../utils/pagination';

interface PaginatedReviews {
  reviews: MappedReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const ReviewService = {
  /**
   * Get paginated reviews for a product.
   */
  async getByProductId(
    productId: string,
    queryParams: { page?: number; limit?: number }
  ): Promise<PaginatedReviews> {
    // Verify product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    const { reviews, total } = await ReviewModel.findByProductId(productId, queryParams);
    const pagination = buildPaginationResponse(
      total,
      queryParams.page || 1,
      queryParams.limit || 12
    );

    return { reviews, pagination };
  },

  /**
   * Create a review for a product. Enforces one review per user per product.
   */
  async create(
    productId: string,
    userId: string,
    data: { rating: number; title?: string; body?: string }
  ): Promise<MappedReview> {
    // Verify product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    // Check for duplicate review
    const existing = await ReviewModel.findByUserAndProduct(userId, productId);
    if (existing) {
      throw new ConflictError('You have already reviewed this product');
    }

    return ReviewModel.create(productId, userId, data);
  },
};
