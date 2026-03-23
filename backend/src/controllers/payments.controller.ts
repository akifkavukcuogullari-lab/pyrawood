import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export const PaymentsController = {
  async createIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.createPaymentIntent(req.user!.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        res.status(400).json({
          success: false,
          error: { message: 'Missing stripe-signature header', code: 'MISSING_SIGNATURE' },
        });
        return;
      }

      const result = await PaymentService.handleWebhook(req.body, signature);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
