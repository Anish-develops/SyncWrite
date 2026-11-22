import { create } from 'zustand';
import { FileNode } from '@syncwrite/shared';
import { FileAPI } from '../api/files';

interface FileTreeState {
  tree: FileNode[];
  isLoading: boolean;
  selectedPath: string | null;
  expandedFolders: Set<string>;
  loadTree: (projectId: string) => Promise<void>;
  setSelectedPath: (path: string | null) => void;
  toggleFolder: (path: string) => void;
  expandFolder: (path: string) => void;
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  tree: [],
  isLoading: false,
  selectedPath: null,
  expandedFolders: new Set<string>(['src']),

  loadTree: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const data = await FileAPI.getTree(projectId);
      set({ tree: data.tree, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setSelectedPath: (path) => set({ selectedPath: path }),

  toggleFolder: (path) => {
    const expanded = new Set(get().expandedFolders);
    if (expanded.has(path)) {
      expanded.delete(path);
    } else {
      expanded.add(path);
    }
    set({ expandedFolders: expanded });
  },

  expandFolder: (path) => {
    const expanded = new Set(get().expandedFolders);
    expanded.add(path);
    set({ expandedFolders: expanded });
  },
}));
