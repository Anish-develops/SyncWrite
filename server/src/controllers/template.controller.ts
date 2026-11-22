import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';

export const TemplateController = {
  getAll(req: Request, res: Response) {
    const templates = TemplateService.getAllTemplates();
    res.status(200).json({ templates });
  },
};
