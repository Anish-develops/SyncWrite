import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { UserAvatar } from './UserAvatar';
import { Users } from 'lucide-react';

export const PresencePanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { onlineUsers, currentProject } = useProjectStore();

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-12 right-24 z-50 w-72 bg-surface-ground border border-border shadow-xl rounded p-3 animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          Active Collaborators ({onlineUsers.length})
        </span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <span className="text-xs text-text-tertiary italic py-2">No other collaborators active</span>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-1.5 rounded hover:bg-surface-raised transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserAvatar username={user.username} avatarColor={user.avatarColor} size="sm" />
                <span className="text-xs font-medium text-text-primary">{user.username}</span>
              </div>
              {user.currentFile && (
                <span className="text-[10px] text-text-tertiary font-mono truncate max-w-[120px]">
                  {user.currentFile.split('/').pop()}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
