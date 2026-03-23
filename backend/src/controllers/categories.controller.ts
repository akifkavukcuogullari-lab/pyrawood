import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

export const CategoriesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },
};
