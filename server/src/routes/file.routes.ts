import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireProjectMember } from '../middleware/project.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createFileSchema, updateFileSchema, renameFileSchema } from '../utils/validators';

const router = Router();

router.use(requireAuth);

// File tree
router.get('/:id/files', requireProjectMember, FileController.getTree);

// Create file / dir
router.post('/:id/files', requireProjectMember, validateBody(createFileSchema), FileController.create);

// Download project zip
router.get('/:id/download', requireProjectMember, FileController.download);

// Rename file / dir
router.put(
  '/:id/files/*/rename',
  requireProjectMember,
  validateBody(renameFileSchema),
  FileController.rename
);

// Get file content
router.get('/:id/files/*', requireProjectMember, FileController.getFile);

// Update file content
router.put(
  '/:id/files/*',
  requireProjectMember,
  validateBody(updateFileSchema),
  FileController.update
);

// Delete file / dir
router.delete('/:id/files/*', requireProjectMember, FileController.delete);

export default router;
