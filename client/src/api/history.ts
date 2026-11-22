import apiClient from './client';
import { EditEvent } from '@syncwrite/shared';

export const HistoryAPI = {
  async getHistory(
    projectId: string,
    file?: string,
    limit = 100
  ): Promise<{ events: EditEvent[]; total: number }> {
    const res = await apiClient.get<{ events: EditEvent[]; total: number }>(
      `/projects/${projectId}/history`,
      { params: { file, limit } }
    );
    return res.data;
  },
};
