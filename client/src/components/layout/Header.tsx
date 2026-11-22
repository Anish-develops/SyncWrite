import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useEditorStore } from '../../store/editorStore';
import { UserAvatar } from '../collaboration/UserAvatar';
import { PresencePanel } from '../collaboration/PresencePanel';
import { InviteModal } from '../project/InviteModal';
import { AISettingsModal } from '../ai/AISettingsModal';
import { AIReviewTrigger } from '../ai/AIReviewTrigger';
import { FileAPI } from '../../api/files';
import {
  Sun,
  Moon,
  Share2,
  Download,
  Terminal,
  MessageSquare,
  History,
  Sparkles,
  LogOut,
  FolderTree,
} from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  onTriggerAIReview: () => void;
  isReviewing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onTriggerAIReview, isReviewing = false }) => {
  const { currentProject, onlineUsers } = useProjectStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useSettingsStore();
  const {
    showTerminal,
    toggleTerminal,
    activeSidePanel,
    toggleSidePanel,
  } = useEditorStore();

  const [isPresenceOpen, setIsPresenceOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  return (
    <header className="h-12 bg-surface-raised border-b border-border px-4 flex items-center justify-between select-none z-30">
      {/* Left: Project title & language */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-primary tracking-tight truncate max-w-xs">
            {currentProject?.name || 'SyncWrite Workspace'}
          </span>
          {currentProject?.language && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase bg-surface-sunken text-accent rounded">
              {currentProject.language}
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions, Presence, Toggles, Profile */}
      <div className="flex items-center gap-2">
        {/* Collaborators presence dots */}
        <div
          onClick={() => setIsPresenceOpen(!isPresenceOpen)}
          className="flex items-center -space-x-1.5 cursor-pointer p-1 rounded hover:bg-surface-sunken transition-colors mr-2"
          title="Click to view active collaborators"
        >
          {onlineUsers.slice(0, 4).map((u) => (
            <UserAvatar key={u.id} username={u.username} avatarColor={u.avatarColor} size="sm" />
          ))}
          {onlineUsers.length > 4 && (
            <span className="w-5 h-5 rounded-full bg-surface-sunken border border-border text-[9px] font-bold flex items-center justify-center text-text-secondary">
              +{onlineUsers.length - 4}
            </span>
          )}
        </div>

        {/* Presence dropdown */}
        <PresencePanel isOpen={isPresenceOpen} onClose={() => setIsPresenceOpen(false)} />

        {/* AI Review button */}
        <AIReviewTrigger onTrigger={onTriggerAIReview} isLoading={isReviewing} />

        {/* AI Settings button */}
        <button
          onClick={() => setIsAISettingsOpen(true)}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded transition-colors"
          title="AI Intelligence Settings"
        >
          <Sparkles className="w-4 h-4 text-accent" />
        </button>

        {/* Invite link button */}
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => setIsInviteOpen(true)}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Invite</span>
        </Button>

        {/* Download project ZIP */}
        {currentProject && (
          <a
            href={FileAPI.getDownloadUrl(currentProject.id)}
            download
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded transition-colors"
            title="Download Project ZIP"
          >
            <Download className="w-4 h-4" />
          </a>
        )}

        <div className="h-4 w-px bg-border mx-1" />

        {/* Terminal toggle */}
        <button
          onClick={toggleTerminal}
          className={`p-1.5 rounded transition-colors ${
            showTerminal
              ? 'bg-accent/15 text-accent'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-sunken'
          }`}
          title="Toggle Terminal"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Chat toggle */}
        <button
          onClick={() => toggleSidePanel('chat')}
          className={`p-1.5 rounded transition-colors ${
            activeSidePanel === 'chat'
              ? 'bg-accent/15 text-accent'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-sunken'
          }`}
          title="Toggle Project Chat"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Merge timeline toggle */}
        <button
          onClick={() => toggleSidePanel('timeline')}
          className={`p-1.5 rounded transition-colors ${
            activeSidePanel === 'timeline'
              ? 'bg-accent/15 text-accent'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-sunken'
          }`}
          title="Toggle Merge History"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* User profile & logout */}
        {user && (
          <div className="flex items-center gap-2">
            <UserAvatar username={user.username} avatarColor={user.avatarColor} size="sm" />
            <button
              onClick={logout}
              className="p-1.5 text-text-secondary hover:text-semantic-error hover:bg-surface-sunken rounded transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {currentProject && (
        <InviteModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          inviteCode={currentProject.inviteCode}
        />
      )}

      <AISettingsModal isOpen={isAISettingsOpen} onClose={() => setIsAISettingsOpen(false)} />
    </header>
  );
};
