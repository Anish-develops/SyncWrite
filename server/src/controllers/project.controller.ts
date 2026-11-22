import { Request, Response } from 'express';
import { ProjectModel } from '../models/Project';
import { ProjectMemberModel } from '../models/ProjectMember';
import { generateId } from '../utils/uuid';
import { generateInviteCode } from '../utils/inviteCode';
import { TemplateService } from '../services/template.service';
import { ENV } from '../config/env';

export const ProjectController = {
  async create(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { name, language, description, template } = req.body;

    const projectId = generateId();
    const inviteCode = generateInviteCode();

    const project = ProjectModel.create({
      id: projectId,
      name,
      ownerId: userId,
      language,
      template: template || null,
      description: description || '',
      inviteCode,
    });

    // If template was selected, apply its boilerplate files to project directory
    if (template) {
      TemplateService.applyTemplate(projectId, template);
    }

    res.status(201).json(project);
  },

  async list(req: Request, res: Response) {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = ProjectModel.findByUser(userId, page, limit);

    res.status(200).json({
      projects: result.projects,
      total: result.total,
      page,
      limit,
    });
  },

  async getById(req: Request, res: Response) {
    const projectId = req.params.id;
    const project = ProjectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const members = ProjectMemberModel.getMembers(projectId);
    project.members = members;

    res.status(200).json(project);
  },

  async update(req: Request, res: Response) {
    const projectId = req.params.id;
    const { name, description } = req.body;

    const updated = ProjectModel.update(projectId, { name, description });
    res.status(200).json(updated);
  },

  async delete(req: Request, res: Response) {
    const projectId = req.params.id;
    ProjectModel.delete(projectId);
    res.status(204).send();
  },

  async createInvite(req: Request, res: Response) {
    const projectId = req.params.id;
    const newCode = generateInviteCode();

    ProjectModel.updateInviteCode(projectId, newCode);

    res.status(200).json({
      inviteCode: newCode,
      inviteUrl: `${ENV.CLIENT_URL}/join/${newCode}`,
    });
  },

  async join(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { inviteCode } = req.params;

    const project = ProjectModel.findByInviteCode(inviteCode);
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Invalid invite code or project not found',
        },
      });
    }

    const existingMember = ProjectMemberModel.getMember(project.id, userId);
    if (existingMember) {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'You are already a member of this project',
        },
      });
    }

    ProjectMemberModel.addMember(project.id, userId, 'editor');

    res.status(200).json({
      projectId: project.id,
      role: 'editor',
      message: 'Successfully joined project',
    });
  },

  async removeMember(req: Request, res: Response) {
    const projectId = req.params.id;
    const targetUserId = req.params.userId;
    const currentUserId = req.user!.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Owner cannot remove themselves from project',
        },
      });
    }

    ProjectMemberModel.removeMember(projectId, targetUserId);
    res.status(204).send();
  },
};
