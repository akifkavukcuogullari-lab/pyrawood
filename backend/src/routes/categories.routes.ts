import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller';

const router = Router();

// GET /categories — list all categories (public)
router.get('/', CategoriesController.list);

export default router;
