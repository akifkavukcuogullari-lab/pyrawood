import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AdminController } from '../controllers/admin.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { admin } from '../middleware/admin';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  imageParamsSchema,
  updateImageSchema,
  createVariantSchema,
  updateVariantSchema,
  variantParamsSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  paginationQuerySchema,
} from '../validators/admin.validator';

// ── Multer configuration ─────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ── Routes ───────────────────────────────────────────────────────────

const router = Router();

// All admin routes require authentication + admin role
router.use(auth, admin);

// Dashboard
router.get('/stats', AdminController.getStats);

// Products
router.get('/products', validate(paginationQuerySchema), AdminController.listProducts);
router.get('/products/:id', validate(productIdParamSchema), AdminController.getProduct);
router.post('/products', validate(createProductSchema), AdminController.createProduct);
router.put('/products/:id', validate(updateProductSchema), AdminController.updateProduct);
router.delete('/products/:id', validate(productIdParamSchema), AdminController.deleteProduct);

// Product Images
router.post('/products/:id/images', validate(productIdParamSchema), upload.single('image'), AdminController.uploadImage);
router.put('/products/:id/images/:imgId', validate(updateImageSchema), AdminController.updateImage);
router.delete('/products/:id/images/:imgId', validate(imageParamsSchema), AdminController.deleteImage);

// Product Variants
router.post('/products/:id/variants', validate(createVariantSchema), AdminController.addVariant);
router.put('/products/:id/variants/:varId', validate(updateVariantSchema), AdminController.updateVariant);
router.delete('/products/:id/variants/:varId', validate(variantParamsSchema), AdminController.deleteVariant);

// Orders
router.get('/orders', validate(paginationQuerySchema), AdminController.listOrders);
router.get('/orders/:id', validate(orderIdParamSchema), AdminController.getOrder);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), AdminController.updateOrderStatus);

// Users
router.get('/users', validate(paginationQuerySchema), AdminController.listUsers);

export default router;
