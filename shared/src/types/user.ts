export interface User {
  id: string;
  email: string;
  username: string;
  avatarColor: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserPresence {
  id: string;
  username: string;
  avatarColor: string;
  currentFile?: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  lastActive?: number;
}
