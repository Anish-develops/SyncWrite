import React, { useState } from 'react';
import { Send, Code2, X } from 'lucide-react';
import { CodeRef } from '@syncwrite/shared';

interface ChatInputProps {
  onSendMessage: (message: string, codeRef?: CodeRef | null) => void;
  attachedCodeRef?: CodeRef | null;
  onRemoveCodeRef?: () => void;
  onTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  attachedCodeRef,
  onRemoveCodeRef,
  onTyping,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim(), attachedCodeRef);
    setText('');
    onRemoveCodeRef?.();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-surface-raised flex flex-col gap-2">
      {attachedCodeRef && (
        <div className="flex items-center justify-between px-2 py-1 bg-surface-sunken border border-accent/40 rounded text-[11px] text-accent font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              {attachedCodeRef.file}:{attachedCodeRef.line}
            </span>
          </div>
          <button type="button" onClick={onRemoveCodeRef} className="text-text-tertiary hover:text-text-primary">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping?.();
          }}
          placeholder="Message project collaborators..."
          className="flex-1 bg-surface-ground border border-border px-3 py-1.5 text-xs text-text-primary rounded focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-1.5 bg-accent text-white rounded hover:bg-accent-hover disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
