import { Router } from 'express';
import { HistoryController } from '../controllers/history.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireProjectMember } from '../middleware/project.middleware';

const router = Router();

router.use(requireAuth);
router.get('/:id/history', requireProjectMember, HistoryController.getHistory);

export default router;
