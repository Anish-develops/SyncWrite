import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import fileRoutes from './file.routes';
import templateRoutes from './template.routes';
import chatRoutes from './chat.routes';
import historyRoutes from './history.routes';
import reviewRoutes from './review.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'syncwrite',
  });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/projects', fileRoutes);
router.use('/projects', chatRoutes);
router.use('/projects', historyRoutes);
router.use('/projects', reviewRoutes);
router.use('/templates', templateRoutes);
router.use('/ai', aiRoutes);

export default router;
