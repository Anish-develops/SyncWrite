export interface TerminalSession {
  terminalId: string;
  projectId: string;
  userId: string;
  cols: number;
  rows: number;
  createdAt: number;
}

export interface CreateTerminalDTO {
  cols?: number;
  rows?: number;
}
