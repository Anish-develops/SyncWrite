import apiClient from './client';
import {
  FileTreeResponse,
  FileContentResponse,
  CreateFileDTO,
  UpdateFileDTO,
  RenameFileDTO,
} from '@syncwrite/shared';

export const FileAPI = {
  async getTree(projectId: string): Promise<FileTreeResponse> {
    const res = await apiClient.get<FileTreeResponse>(`/projects/${projectId}/files`);
    return res.data;
  },

  async getFile(projectId: string, filePath: string): Promise<FileContentResponse> {
    const encoded = encodeURIComponent(filePath);
    const res = await apiClient.get<FileContentResponse>(`/projects/${projectId}/files/${encoded}`);
    return res.data;
  },

  async createFile(projectId: string, data: CreateFileDTO): Promise<any> {
    const res = await apiClient.post(`/projects/${projectId}/files`, data);
    return res.data;
  },

  async updateFile(projectId: string, filePath: string, data: UpdateFileDTO): Promise<any> {
    const encoded = encodeURIComponent(filePath);
    const res = await apiClient.put(`/projects/${projectId}/files/${encoded}`, data);
    return res.data;
  },

  async renameFile(projectId: string, filePath: string, data: RenameFileDTO): Promise<any> {
    const encoded = encodeURIComponent(filePath);
    const res = await apiClient.put(`/projects/${projectId}/files/${encoded}/rename`, data);
    return res.data;
  },

  async deleteFile(projectId: string, filePath: string): Promise<void> {
    const encoded = encodeURIComponent(filePath);
    await apiClient.delete(`/projects/${projectId}/files/${encoded}`);
  },

  getDownloadUrl(projectId: string): string {
    const base = apiClient.defaults.baseURL || 'http://localhost:3001/api';
    return `${base}/projects/${projectId}/download`;
  },
};
