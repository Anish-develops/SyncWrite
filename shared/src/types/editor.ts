export type EditEventType = 'insert' | 'delete' | 'replace';

export interface EditEvent {
  id: string;
  projectId: string;
  userId: string;
  user?: {
    id: string;
    username: string;
    avatarColor: string;
  };
  filePath: string;
  eventType: EditEventType;
  line: number;
  column: number;
  content: string;
  length: number;
  createdAt: string;
}

export interface MergeAttribution {
  line: number;
  userId: string;
  userColor: string;
  timestamp: number;
}
