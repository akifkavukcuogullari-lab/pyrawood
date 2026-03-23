import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import categoryRoutes from './categories.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './orders.routes';
import paymentRoutes from './payments.routes';
import webhookRoutes from './webhooks.routes';
import reviewRoutes from './reviews.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/products', reviewRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/admin', adminRoutes);

export default router;
