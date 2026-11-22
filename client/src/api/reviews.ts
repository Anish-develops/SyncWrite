import apiClient from './client';
import { AIReview, SaveReviewDTO } from '@syncwrite/shared';

export const ReviewAPI = {
  async getReviews(projectId: string, file?: string): Promise<{ reviews: AIReview[] }> {
    const res = await apiClient.get<{ reviews: AIReview[] }>(`/projects/${projectId}/reviews`, {
      params: { file },
    });
    return res.data;
  },

  async saveReview(projectId: string, data: SaveReviewDTO): Promise<AIReview> {
    const res = await apiClient.post<AIReview>(`/projects/${projectId}/reviews`, data);
    return res.data;
  },
};
