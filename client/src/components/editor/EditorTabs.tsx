import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { getFileIcon } from '../../utils/fileIcons';
import { X } from 'lucide-react';

export const EditorTabs: React.FC = () => {
  const { openTabs, activeTabPath, setActiveTab, closeTab } = useEditorStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center h-9 bg-surface-raised border-b border-border select-none overflow-x-auto">
      {openTabs.map((tab) => {
        const isActive = tab.path === activeTabPath;
        return (
          <div
            key={tab.path}
            onClick={() => setActiveTab(tab.path)}
            className={`group flex items-center gap-1.5 h-full px-3 text-xs cursor-pointer border-r border-border transition-colors ${
              isActive
                ? 'bg-editor-bg text-text-primary font-medium border-t-2 border-t-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-ground'
            }`}
          >
            {getFileIcon(tab.name, false)}
            <span className="truncate max-w-[140px]">{tab.name}</span>

            {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-semantic-warning ml-0.5" />}

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.path);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-sunken hover:text-semantic-error ml-1 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
