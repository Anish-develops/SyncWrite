import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();

router.post('/proxy/anthropic', AIController.proxyAnthropic);

export default router;
