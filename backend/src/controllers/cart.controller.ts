import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';

export const CartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.user!.id);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  },

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.addItem(req.user!.id, req.body);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.updateItem(
        req.user!.id,
        req.params.id,
        req.body.quantity
      );
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.removeItem(req.user!.id, req.params.id);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  },
};
