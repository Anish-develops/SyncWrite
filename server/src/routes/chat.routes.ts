import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireProjectMember } from '../middleware/project.middleware';

const router = Router();

router.use(requireAuth);
router.get('/:id/chat', requireProjectMember, ChatController.getHistory);

export default router;
