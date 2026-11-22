export type FileNodeType = 'file' | 'directory';

export interface FileNode {
  name: string;
  path: string;
  type: FileNodeType;
  size?: number;
  children?: FileNode[];
  updatedAt?: string;
}

export interface FileTreeResponse {
  tree: FileNode[];
}

export interface FileContentResponse {
  path: string;
  content: string;
  language: string;
  size: number;
  updatedAt: string;
}

export interface CreateFileDTO {
  path: string;
  type: FileNodeType;
  content?: string;
}

export interface UpdateFileDTO {
  content: string;
}

export interface RenameFileDTO {
  newPath: string;
}
