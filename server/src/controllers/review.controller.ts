import { Request, Response } from 'express';
import { AIReviewModel } from '../models/AIReview';
import { generateId } from '../utils/uuid';

export const ReviewController = {
  async getReviews(req: Request, res: Response) {
    const projectId = req.params.id;
    const filePath = req.query.file as string | undefined;

    const reviews = AIReviewModel.findByFile(projectId, filePath);
    res.status(200).json({ reviews });
  },

  async createReview(req: Request, res: Response) {
    const projectId = req.params.id;
    const userId = req.user!.userId;
    const { filePath, provider, comments } = req.body;

    const review = AIReviewModel.create({
      id: generateId(),
      projectId,
      userId,
      filePath,
      provider,
      comments,
    });

    res.status(201).json(review);
  },
};
