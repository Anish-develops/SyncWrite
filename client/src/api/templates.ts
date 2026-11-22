import apiClient from './client';
import { TemplatesResponse } from '@syncwrite/shared';

export const TemplateAPI = {
  async getAll(): Promise<TemplatesResponse> {
    const res = await apiClient.get<TemplatesResponse>('/templates');
    return res.data;
  },
};
