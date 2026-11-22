import React from 'react';
import { ChatMessage as ChatMessageType } from '@syncwrite/shared';
import { UserAvatar } from './UserAvatar';
import { formatRelativeTime } from '../../utils/formatters';
import { Code2 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onCodeRefClick?: (file: string, line: number) => void;
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({ message, onCodeRefClick }) => {
  return (
    <div className="flex flex-col gap-1 text-left p-2 rounded hover:bg-surface-raised transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <UserAvatar
            username={message.user.username}
            avatarColor={message.user.avatarColor}
            size="sm"
          />
          <span className="text-xs font-semibold text-text-primary">{message.user.username}</span>
        </div>
        <span className="text-[10px] text-text-tertiary">
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed pl-6 break-words">
        {message.message}
      </p>

      {message.codeRef && (
        <div
          onClick={() => onCodeRefClick?.(message.codeRef!.file, message.codeRef!.line)}
          className="ml-6 mt-1 p-2 bg-surface-sunken border border-border rounded cursor-pointer hover:border-accent transition-colors flex items-center gap-2 text-xs"
        >
          <Code2 className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="font-mono text-[11px] text-accent font-medium">
            {message.codeRef.file}:{message.codeRef.line}
          </span>
          {message.codeRef.snippet && (
            <span className="text-[11px] text-text-tertiary truncate font-mono">
              "{message.codeRef.snippet}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};
