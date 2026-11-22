import React from 'react';
import { useTerminalStore, TerminalTab } from '../../store/terminalStore';
import { Plus, X, Terminal as TermIcon } from 'lucide-react';

interface TerminalTabsProps {
  onNewTerminal: () => void;
  onKillTerminal: (id: string) => void;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({ onNewTerminal, onKillTerminal }) => {
  const { tabs, activeTabId, setActiveTab } = useTerminalStore();

  return (
    <div className="flex items-center h-8 bg-[#181615] border-b border-[#292524] px-2 select-none overflow-x-auto">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs cursor-pointer rounded-t border-b-2 transition-colors ${
                isActive
                  ? 'bg-[#1c1917] text-white border-accent font-medium'
                  : 'text-[#a8a29e] hover:text-[#f5f5f4] border-transparent hover:bg-[#201d1b]'
              }`}
            >
              <TermIcon className="w-3.5 h-3.5 text-accent" />
              <span>{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onKillTerminal(tab.id);
                }}
                className="hover:text-semantic-error p-0.5 rounded ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNewTerminal}
        className="p-1 ml-2 text-[#a8a29e] hover:text-white hover:bg-[#292524] rounded transition-colors"
        title="Open new terminal"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
