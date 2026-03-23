import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export const ProductsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { products, pagination } = await ProductService.getAll(req.query as any);
      res.status(200).json({ success: true, data: products, pagination });
    } catch (error) {
      next(error);
    }
  },

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },
};
