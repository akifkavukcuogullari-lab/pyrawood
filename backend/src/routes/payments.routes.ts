import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/create-intent', auth, PaymentsController.createIntent);

export default router;
