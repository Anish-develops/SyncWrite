import { create } from 'zustand';
import { Project, UserPresence } from '@syncwrite/shared';
import { ProjectAPI } from '../api/projects';

interface ProjectState {
  currentProject: Project | null;
  onlineUsers: UserPresence[];
  isLoading: boolean;
  setCurrentProject: (project: Project | null) => void;
  setOnlineUsers: (users: UserPresence[]) => void;
  addOnlineUser: (user: UserPresence) => void;
  removeOnlineUser: (userId: string) => void;
  loadProject: (id: string) => Promise<Project | null>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  onlineUsers: [],
  isLoading: false,

  setCurrentProject: (project) => set({ currentProject: project }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (user) => {
    const existing = get().onlineUsers;
    if (!existing.some((u) => u.id === user.id)) {
      set({ onlineUsers: [...existing, user] });
    }
  },

  removeOnlineUser: (userId) => {
    set({ onlineUsers: get().onlineUsers.filter((u) => u.id !== userId) });
  },

  loadProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const project = await ProjectAPI.getById(id);
      set({ currentProject: project, isLoading: false });
      return project;
    } catch (err) {
      set({ isLoading: false });
      return null;
    }
  },
}));
