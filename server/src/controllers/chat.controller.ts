import { Request, Response } from 'express';
import { ChatMessageModel } from '../models/ChatMessage';

export const ChatController = {
  async getHistory(req: Request, res: Response) {
    const projectId = req.params.id;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const beforeId = req.query.before as string | undefined;

    const result = ChatMessageModel.findByProject(projectId, limit, beforeId);
    res.status(200).json(result);
  },
};
