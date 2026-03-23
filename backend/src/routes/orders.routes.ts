import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { createOrderSchema, orderParamsSchema } from '../validators/order.validator';

const router = Router();

// All order routes require authentication
router.use(auth);

router.post('/', validate(createOrderSchema), OrdersController.create);
router.get('/', OrdersController.list);
router.get('/:id', validate(orderParamsSchema), OrdersController.detail);

export default router;
