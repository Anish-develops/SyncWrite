import apiClient from './client';
import { ChatMessage } from '@syncwrite/shared';

export const ChatAPI = {
  async getHistory(
    projectId: string,
    limit = 50,
    before?: string
  ): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
    const res = await apiClient.get<{ messages: ChatMessage[]; hasMore: boolean }>(
      `/projects/${projectId}/chat`,
      { params: { limit, before } }
    );
    return res.data;
  },
};
