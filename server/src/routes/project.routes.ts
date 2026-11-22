import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireProjectMember, requireProjectOwner } from '../middleware/project.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createProjectSchema, updateProjectSchema } from '../utils/validators';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createProjectSchema), ProjectController.create);
router.get('/', ProjectController.list);
router.get('/:id', requireProjectMember, ProjectController.getById);
router.put('/:id', requireProjectOwner, validateBody(updateProjectSchema), ProjectController.update);
router.delete('/:id', requireProjectOwner, ProjectController.delete);
router.post('/:id/invite', requireProjectOwner, ProjectController.createInvite);
router.post('/join/:inviteCode', ProjectController.join);
router.delete('/:id/members/:userId', requireProjectOwner, ProjectController.removeMember);

export default router;
