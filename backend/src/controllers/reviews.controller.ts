import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';

export const ReviewsController = {
  /**
   * GET /products/:productId/reviews — list reviews for a product (public).
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { reviews, pagination } = await ReviewService.getByProductId(
        productId,
        req.query as any
      );
      res.status(200).json({ success: true, data: reviews, pagination });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /products/:productId/reviews — create a review (auth required).
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const userId = req.user!.id;
      const review = await ReviewService.create(productId, userId, req.body);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  },
};
