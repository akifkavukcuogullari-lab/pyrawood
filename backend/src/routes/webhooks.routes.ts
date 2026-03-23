import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller';

const router = Router();

// Stripe webhook — NO auth middleware, NO JSON parsing.
// The raw body parser is already applied in app.ts on the /api/webhooks/stripe path
// via express.raw({ type: 'application/json' }) before express.json().
router.post('/stripe', PaymentsController.webhook);

export default router;
