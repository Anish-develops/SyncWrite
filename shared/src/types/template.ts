import { SupportedLanguage } from './project';

export interface ProjectTemplate {
  id: string;
  name: string;
  language: SupportedLanguage;
  description: string;
  files: string[];
  runCommand: string;
  icon: string;
}

export interface TemplatesResponse {
  templates: ProjectTemplate[];
}
