import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { validate } from '../middleware/validate';
import {
  productListParamsSchema,
  productIdSchema,
} from '../validators/product.validator';

const router = Router();

// GET /products — list products with filtering, sorting, pagination (public)
router.get('/', validate(productListParamsSchema), ProductsController.list);

// GET /products/:id — product detail by UUID or slug (public)
router.get('/:id', validate(productIdSchema), ProductsController.detail);

export default router;
