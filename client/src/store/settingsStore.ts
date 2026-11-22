import { create } from 'zustand';

interface SettingsState {
  theme: 'light' | 'dark';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  toggleTheme: () => void;
  setFontSize: (size: number) => void;
  toggleWordWrap: () => void;
  toggleMinimap: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const savedTheme = (localStorage.getItem('syncwrite_theme') as 'light' | 'dark') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  return {
    theme: savedTheme,
    fontSize: 14,
    wordWrap: true,
    minimap: true,

    toggleTheme: () => {
      const nextTheme = get().theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('syncwrite_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      set({ theme: nextTheme });
    },

    setFontSize: (fontSize) => set({ fontSize }),
    toggleWordWrap: () => set({ wordWrap: !get().wordWrap }),
    toggleMinimap: () => set({ minimap: !get().minimap }),
  };
});
