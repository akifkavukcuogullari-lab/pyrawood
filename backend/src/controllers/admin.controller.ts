import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export const AdminController = {
  // ── Dashboard ──────────────────────────────────────────────────────

  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  // ── Products ───────────────────────────────────────────────────────

  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { products, pagination } = await AdminService.listProducts(req.query as any);
      res.status(200).json({ success: true, data: products, pagination });
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, data: { message: 'Product deleted' } });
    } catch (error) {
      next(error);
    }
  },

  // ── Images ─────────────────────────────────────────────────────────

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: { message: 'No image file provided', code: 'VALIDATION_ERROR' },
        });
        return;
      }

      // Build the URL path for the uploaded file
      const url = `/uploads/${file.filename}`;
      const altText = req.body.altText || undefined;
      const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;

      const image = await AdminService.addProductImage(id, url, altText, isPrimary);
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      next(error);
    }
  },

  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, imgId } = req.params;
      const image = await AdminService.updateProductImage(id, imgId, req.body);
      res.status(200).json({ success: true, data: image });
    } catch (error) {
      next(error);
    }
  },

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, imgId } = req.params;
      await AdminService.deleteProductImage(id, imgId);
      res.status(200).json({ success: true, data: { message: 'Image deleted' } });
    } catch (error) {
      next(error);
    }
  },

  // ── Variants ───────────────────────────────────────────────────────

  async addVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const variant = await AdminService.addProductVariant(id, req.body);
      res.status(201).json({ success: true, data: variant });
    } catch (error) {
      next(error);
    }
  },

  async updateVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, varId } = req.params;
      const variant = await AdminService.updateProductVariant(id, varId, req.body);
      res.status(200).json({ success: true, data: variant });
    } catch (error) {
      next(error);
    }
  },

  async deleteVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, varId } = req.params;
      await AdminService.deleteProductVariant(id, varId);
      res.status(200).json({ success: true, data: { message: 'Variant deleted' } });
    } catch (error) {
      next(error);
    }
  },

  // ── Orders ─────────────────────────────────────────────────────────

  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { orders, pagination } = await AdminService.listOrders(req.query as any);
      res.status(200).json({ success: true, data: orders, pagination });
    } catch (error) {
      next(error);
    }
  },

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await AdminService.getOrder(req.params.id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await AdminService.updateOrderStatus(req.params.id, req.body.status);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  // ── Users ──────────────────────────────────────────────────────────

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { users, pagination } = await AdminService.listUsers(req.query as any);
      res.status(200).json({ success: true, data: users, pagination });
    } catch (error) {
      next(error);
    }
  },
};
