import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export const OrdersController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { shippingAddress, paymentIntentId, notes } = req.body;
      const order = await OrderService.createFromCart(
        req.user!.id,
        shippingAddress,
        paymentIntentId,
        notes
      );
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { orders, pagination } = await OrderService.getOrders(
        req.user!.id,
        req.query as any
      );
      res.status(200).json({ success: true, data: orders, pagination });
    } catch (error) {
      next(error);
    }
  },

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(
        req.user!.id,
        req.params.id
      );
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },
};
