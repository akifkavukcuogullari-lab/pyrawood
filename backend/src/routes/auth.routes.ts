import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema, 'body'), AuthController.register);
router.post('/login', validate(loginSchema, 'body'), AuthController.login);
router.get('/me', auth, AuthController.me);
router.put('/profile', auth, validate(updateProfileSchema, 'body'), AuthController.updateProfile);

export default router;
