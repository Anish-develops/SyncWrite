import { Request, Response, NextFunction } from 'express';
import { ProjectMemberModel } from '../models/ProjectMember';
import { ProjectModel } from '../models/Project';

export function requireProjectMember(req: Request, res: Response, next: NextFunction) {
  const projectId = req.params.id || req.params.projectId;
  const userId = req.user?.userId;

  if (!projectId || !userId) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Project ID and user authentication required',
      },
    });
  }

  const project = ProjectModel.findById(projectId);
  if (!project) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Project not found',
      },
    });
  }

  const member = ProjectMemberModel.getMember(projectId, userId);
  if (!member) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'You are not a member of this project',
      },
    });
  }

  req.projectRole = member.role;
  next();
}

export function requireProjectOwner(req: Request, res: Response, next: NextFunction) {
  requireProjectMember(req, res, () => {
    if (req.projectRole !== 'owner') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Only the project owner can perform this action',
        },
      });
    }
    next();
  });
}
