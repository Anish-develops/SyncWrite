import { create } from 'zustand';
import { ChatMessage } from '@syncwrite/shared';

interface ChatState {
  messages: ChatMessage[];
  typingUsers: Set<string>;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setUserTyping: (username: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  typingUsers: new Set(),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },

  setUserTyping: (username, isTyping) => {
    const typing = new Set(get().typingUsers);
    if (isTyping) {
      typing.add(username);
    } else {
      typing.delete(username);
    }
    set({ typingUsers: typing });
  },
}));
