import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileTree } from '../filetree/FileTree';
import { EditorTabs } from '../editor/EditorTabs';
import { CodeEditor } from '../editor/CodeEditor';
import { TerminalPanel } from '../terminal/TerminalPanel';
import { ChatPanel } from '../collaboration/ChatPanel';
import { AIReviewPanel } from '../ai/AIReviewPanel';
import { MergeTimeline } from '../editor/MergeTimeline';
import { MergePlayback } from '../editor/MergePlayback';
import { useEditorStore } from '../../store/editorStore';
import { Socket } from 'socket.io-client';
import { CodeRef, EditEvent } from '@syncwrite/shared';

interface AppLayoutProps {
  projectId: string;
  collabSocket: Socket | null;
  terminalSocket: Socket | null;
  chatSocket: Socket | null;
  onNewTerminal: () => void;
  onKillTerminal: (id: string) => void;
  onSendMessage: (message: string, codeRef?: CodeRef | null) => void;
  attachedCodeRef: CodeRef | null;
  onRemoveCodeRef: () => void;
  onCodeRefSelect: (file: string, line: number, snippet: string) => void;
  onApplySuggestion: (line: number, suggestion: string) => void;
  historyEvents: EditEvent[];
  isPlaybackOpen: boolean;
  onClosePlayback: () => void;
  onPlaybackSeek: (index: number) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  projectId,
  collabSocket,
  terminalSocket,
  chatSocket,
  onNewTerminal,
  onKillTerminal,
  onSendMessage,
  attachedCodeRef,
  onRemoveCodeRef,
  onCodeRefSelect,
  onApplySuggestion,
  historyEvents,
  isPlaybackOpen,
  onClosePlayback,
  onPlaybackSeek,
}) => {
  const { activeTabPath, showTerminal, activeSidePanel, toggleSidePanel } = useEditorStore();

  return (
    <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-48px)]">
      <PanelGroup direction="horizontal">
        {/* Left Sidebar: File Tree */}
        <Panel defaultSize={18} minSize={12} maxSize={30}>
          <FileTree />
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />

        {/* Center: Editor + Bottom Terminal */}
        <Panel minSize={40}>
          <PanelGroup direction="vertical">
            <Panel minSize={30}>
              <div className="h-full flex flex-col bg-editor-bg">
                <EditorTabs />
                <div className="flex-1 relative overflow-hidden">
                  <CodeEditor
                    filePath={activeTabPath}
                    projectId={projectId}
                    socket={collabSocket}
                    onCodeRefSelect={onCodeRefSelect}
                  />
                </div>
                {isPlaybackOpen && (
                  <MergePlayback
                    events={historyEvents}
                    onSeek={onPlaybackSeek}
                    onClose={onClosePlayback}
                  />
                )}
              </div>
            </Panel>

            {showTerminal && (
              <>
                <PanelResizeHandle className="h-1 bg-border hover:bg-accent/50 transition-colors cursor-row-resize" />
                <Panel defaultSize={30} minSize={15} maxSize={60}>
                  <TerminalPanel
                    socket={terminalSocket}
                    onNewTerminal={onNewTerminal}
                    onKillTerminal={onKillTerminal}
                  />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>

        {/* Right Drawer: Chat or AI Review or History */}
        {activeSidePanel && (
          <>
            <PanelResizeHandle className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />
            <Panel defaultSize={22} minSize={16} maxSize={35}>
              {activeSidePanel === 'chat' && (
                <ChatPanel
                  onClose={() => toggleSidePanel('chat')}
                  onSendMessage={onSendMessage}
                  attachedCodeRef={attachedCodeRef}
                  onRemoveCodeRef={onRemoveCodeRef}
                  onCodeRefClick={(file) => useEditorStore.getState().openFile(file)}
                />
              )}
              {activeSidePanel === 'review' && (
                <AIReviewPanel
                  onClose={() => toggleSidePanel('review')}
                  onApplySuggestion={onApplySuggestion}
                />
              )}
              {activeSidePanel === 'timeline' && (
                <MergeTimeline
                  events={historyEvents}
                  onSelectEvent={(evt) => useEditorStore.getState().openFile(evt.filePath)}
                  onClose={() => toggleSidePanel('timeline')}
                />
              )}
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
};
