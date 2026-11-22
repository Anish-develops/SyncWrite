import { User } from './user';

export interface CodeRef {
  file: string;
  line: number;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  user: {
    id: string;
    username: string;
    avatarColor: string;
  };
  message: string;
  codeRef?: CodeRef | null;
  createdAt: string;
}

export interface SendMessageDTO {
  message: string;
  codeRef?: CodeRef | null;
}
