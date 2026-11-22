import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateProfileSchema,
} from '../utils/validators';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), AuthController.login);
router.post('/refresh', validateBody(refreshSchema), AuthController.refresh);
router.get('/me', requireAuth, AuthController.me);
router.put('/profile', requireAuth, validateBody(updateProfileSchema), AuthController.updateProfile);

export default router;
