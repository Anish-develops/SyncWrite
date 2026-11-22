import React from 'react';
import { useTerminalStore } from '../../store/terminalStore';
import { TerminalTabs } from './TerminalTabs';
import { Terminal } from './Terminal';
import { Socket } from 'socket.io-client';

interface TerminalPanelProps {
  socket: Socket | null;
  onNewTerminal: () => void;
  onKillTerminal: (id: string) => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  socket,
  onNewTerminal,
  onKillTerminal,
}) => {
  const { tabs, activeTabId } = useTerminalStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="h-full flex flex-col bg-[#1c1917] border-t border-border overflow-hidden">
      <TerminalTabs onNewTerminal={onNewTerminal} onKillTerminal={onKillTerminal} />
      <div className="flex-1 relative overflow-hidden">
        {activeTab ? (
          <Terminal key={activeTab.terminalId} terminalId={activeTab.terminalId} socket={socket} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#a8a29e] italic">
            No terminal active. Click "+" to start a new terminal session.
          </div>
        )}
      </div>
    </div>
  );
};
