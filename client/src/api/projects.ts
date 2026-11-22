import apiClient from './client';
import {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  PaginatedProjectsResponse,
} from '@syncwrite/shared';

export const ProjectAPI = {
  async create(data: CreateProjectDTO): Promise<Project> {
    const res = await apiClient.post<Project>('/projects', data);
    return res.data;
  },

  async list(page = 1, limit = 20): Promise<PaginatedProjectsResponse> {
    const res = await apiClient.get<PaginatedProjectsResponse>('/projects', {
      params: { page, limit },
    });
    return res.data;
  },

  async getById(id: string): Promise<Project> {
    const res = await apiClient.get<Project>(`/projects/${id}`);
    return res.data;
  },

  async update(id: string, data: UpdateProjectDTO): Promise<Project> {
    const res = await apiClient.put<Project>(`/projects/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  async createInvite(id: string): Promise<{ inviteCode: string; inviteUrl: string }> {
    const res = await apiClient.post<{ inviteCode: string; inviteUrl: string }>(`/projects/${id}/invite`);
    return res.data;
  },

  async join(inviteCode: string): Promise<{ projectId: string; role: string }> {
    const res = await apiClient.post<{ projectId: string; role: string }>(`/projects/join/${inviteCode}`);
    return res.data;
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  },
};
