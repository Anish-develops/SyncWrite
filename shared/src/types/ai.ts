export type AIProvider = 'openai' | 'gemini' | 'anthropic';

export type ReviewSeverity = 'error' | 'warning' | 'info';

export interface ReviewComment {
  line: number;
  severity: ReviewSeverity;
  message: string;
  suggestion?: string;
}

export interface AIReview {
  id: string;
  projectId: string;
  userId: string;
  filePath: string;
  provider: AIProvider;
  comments: ReviewComment[];
  createdAt: string;
}

export interface SaveReviewDTO {
  filePath: string;
  provider: AIProvider;
  comments: ReviewComment[];
}
