import { create } from 'zustand';
import { User } from '@syncwrite/shared';
import { AuthAPI } from '../api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('syncwrite_access_token'),
  isAuthenticated: !!localStorage.getItem('syncwrite_access_token'),
  isLoading: true,

  login: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem('syncwrite_access_token', accessToken);
    localStorage.setItem('syncwrite_refresh_token', refreshToken);
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('syncwrite_access_token');
    localStorage.removeItem('syncwrite_refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('syncwrite_access_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const user = await AuthAPI.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('syncwrite_access_token');
      localStorage.removeItem('syncwrite_refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (user) => set({ user }),
}));
