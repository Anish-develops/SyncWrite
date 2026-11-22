import { User } from './user';

export type ProjectRole = 'owner' | 'editor';

export type SupportedLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'go'
  | 'rust'
  | 'java'
  | 'c'
  | 'cpp';

export interface ProjectMember {
  id: string;
  username: string;
  avatarColor: string;
  role: ProjectRole;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  language: SupportedLanguage;
  template?: string | null;
  description: string;
  inviteCode: string;
  ownerId?: string;
  owner?: User;
  members?: ProjectMember[];
  memberCount?: number;
  role?: ProjectRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDTO {
  name: string;
  language: SupportedLanguage;
  description?: string;
  template?: string | null;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}

export interface PaginatedProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}
