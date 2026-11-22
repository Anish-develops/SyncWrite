import db from '../config/database';
import { AIProvider, AIReview, ReviewComment } from '@syncwrite/shared';

interface ReviewRow {
  id: string;
  project_id: string;
  user_id: string;
  file_path: string;
  provider: AIProvider;
  comments: string;
  created_at: string;
}

export const AIReviewModel = {
  create(review: {
    id: string;
    projectId: string;
    userId: string;
    filePath: string;
    provider: AIProvider;
    comments: ReviewComment[];
  }): AIReview {
    db.prepare(`
      INSERT INTO ai_reviews (id, project_id, user_id, file_path, provider, comments)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      review.id,
      review.projectId,
      review.userId,
      review.filePath,
      review.provider,
      JSON.stringify(review.comments)
    );

    return {
      id: review.id,
      projectId: review.projectId,
      userId: review.userId,
      filePath: review.filePath,
      provider: review.provider,
      comments: review.comments,
      createdAt: new Date().toISOString(),
    };
  },

  findByFile(projectId: string, filePath?: string): AIReview[] {
    let query = 'SELECT * FROM ai_reviews WHERE project_id = ?';
    const params: any[] = [projectId];

    if (filePath) {
      query += ' AND file_path = ?';
      params.push(filePath);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare<ReviewRow>(query).all(...params);

    return rows.map((r) => ({
      id: r.id,
      projectId: r.project_id,
      userId: r.user_id,
      filePath: r.file_path,
      provider: r.provider,
      comments: JSON.parse(r.comments || '[]'),
      createdAt: r.created_at,
    }));
  },
};
