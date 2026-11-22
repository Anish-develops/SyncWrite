import apiClient from './client';
import { AuthResponse, User } from '@syncwrite/shared';

export const AuthAPI = {
  async register(data: { email: string; username: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async me(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  async updateProfile(data: { username?: string; avatarColor?: string }): Promise<User> {
    const res = await apiClient.put<User>('/auth/profile', data);
    return res.data;
  },
};
