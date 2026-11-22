import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessageItem } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { CodeRef } from '@syncwrite/shared';
import { MessageSquare, X } from 'lucide-react';

interface ChatPanelProps {
  onClose: () => void;
  onCodeRefClick?: (file: string, line: number) => void;
  attachedCodeRef?: CodeRef | null;
  onRemoveCodeRef?: () => void;
  onSendMessage: (message: string, codeRef?: CodeRef | null) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onClose,
  onCodeRefClick,
  attachedCodeRef,
  onRemoveCodeRef,
  onSendMessage,
}) => {
  const { messages, typingUsers } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-surface-ground border-l border-border select-none">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-surface-raised">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-accent" />
          Project Chat
        </span>
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-sunken"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-text-tertiary text-xs italic">
            No messages yet. Start collaborating in chat!
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} onCodeRefClick={onCodeRefClick} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.size > 0 && (
        <div className="px-3 py-1 text-[11px] text-text-tertiary italic">
          {Array.from(typingUsers).join(', ')} is typing...
        </div>
      )}

      <ChatInput
        onSendMessage={onSendMessage}
        attachedCodeRef={attachedCodeRef}
        onRemoveCodeRef={onRemoveCodeRef}
      />
    </div>
  );
};
