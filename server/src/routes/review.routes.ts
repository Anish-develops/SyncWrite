import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireProjectMember } from '../middleware/project.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { saveReviewSchema } from '../utils/validators';

const router = Router();

router.use(requireAuth);
router.get('/:id/reviews', requireProjectMember, ReviewController.getReviews);
router.post(
  '/:id/reviews',
  requireProjectMember,
  validateBody(saveReviewSchema),
  ReviewController.createReview
);

export default router;
