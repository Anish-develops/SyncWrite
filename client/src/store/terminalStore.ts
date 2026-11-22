import { create } from 'zustand';

export interface TerminalTab {
  id: string;
  terminalId: string;
  title: string;
}

interface TerminalState {
  tabs: TerminalTab[];
  activeTabId: string | null;
  addTab: (tab: TerminalTab) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  addTab: (tab) => {
    const { tabs } = get();
    set({
      tabs: [...tabs, tab],
      activeTabId: tab.id,
    });
  },

  removeTab: (id) => {
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter((t) => t.id !== id);
    let nextActive = activeTabId;

    if (activeTabId === id) {
      nextActive = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }

    set({ tabs: newTabs, activeTabId: nextActive });
  },

  setActiveTab: (id) => set({ activeTabId: id }),
}));
