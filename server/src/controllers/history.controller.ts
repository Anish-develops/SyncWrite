import { Request, Response } from 'express';
import { EditEventModel } from '../models/EditEvent';

export const HistoryController = {
  async getHistory(req: Request, res: Response) {
    const projectId = req.params.id;
    const filePath = req.query.file as string | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 100;

    const events = EditEventModel.findByProject(projectId, filePath, limit);
    res.status(200).json({
      events,
      total: events.length,
    });
  },
};
