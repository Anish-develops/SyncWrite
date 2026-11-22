import { create } from 'zustand';

export interface OpenTab {
  path: string;
  name: string;
  isDirty?: boolean;
}

interface EditorState {
  openTabs: OpenTab[];
  activeTabPath: string | null;
  activeSidePanel: 'chat' | 'review' | 'timeline' | null;
  showTerminal: boolean;
  openFile: (path: string) => void;
  closeTab: (path: string) => void;
  setActiveTab: (path: string) => void;
  setTabDirty: (path: string, isDirty: boolean) => void;
  toggleSidePanel: (panel: 'chat' | 'review' | 'timeline') => void;
  toggleTerminal: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openTabs: [],
  activeTabPath: null,
  activeSidePanel: null,
  showTerminal: true,

  openFile: (filePath) => {
    const { openTabs } = get();
    const name = filePath.split('/').pop() || filePath;
    const exists = openTabs.some((t) => t.path === filePath);

    if (!exists) {
      set({
        openTabs: [...openTabs, { path: filePath, name }],
        activeTabPath: filePath,
      });
    } else {
      set({ activeTabPath: filePath });
    }
  },

  closeTab: (filePath) => {
    const { openTabs, activeTabPath } = get();
    const newTabs = openTabs.filter((t) => t.path !== filePath);
    let nextActive = activeTabPath;

    if (activeTabPath === filePath) {
      nextActive = newTabs.length > 0 ? newTabs[newTabs.length - 1].path : null;
    }

    set({ openTabs: newTabs, activeTabPath: nextActive });
  },

  setActiveTab: (path) => set({ activeTabPath: path }),

  setTabDirty: (path, isDirty) => {
    const { openTabs } = get();
    set({
      openTabs: openTabs.map((t) => (t.path === path ? { ...t, isDirty } : t)),
    });
  },

  toggleSidePanel: (panel) => {
    const current = get().activeSidePanel;
    set({ activeSidePanel: current === panel ? null : panel });
  },

  toggleTerminal: () => set({ showTerminal: !get().showTerminal }),
}));
