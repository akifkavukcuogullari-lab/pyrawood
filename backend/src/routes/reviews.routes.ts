import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { reviewListSchema, createReviewSchema } from '../validators/review.validator';

const router = Router({ mergeParams: true });

// GET /products/:productId/reviews — list reviews for a product (public)
router.get('/:productId/reviews', validate(reviewListSchema), ReviewsController.list);

// POST /products/:productId/reviews — create a review (auth required)
router.post('/:productId/reviews', auth, validate(createReviewSchema), ReviewsController.create);

export default router;
