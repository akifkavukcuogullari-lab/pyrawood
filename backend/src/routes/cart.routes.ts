import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamsSchema,
} from '../validators/cart.validator';

const router = Router();

// All cart routes require authentication
router.use(auth);

router.get('/', CartController.getCart);
router.post('/items', validate(addToCartSchema), CartController.addItem);
router.put('/items/:id', validate(updateCartItemSchema), CartController.updateItem);
router.delete('/items/:id', validate(cartItemParamsSchema), CartController.removeItem);

export default router;
