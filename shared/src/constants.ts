import { SupportedLanguage } from './types/project';

export const SUPPORTED_LANGUAGES: {
  id: SupportedLanguage;
  name: string;
  extension: string;
  monacoLanguage: string;
}[] = [
  { id: 'python', name: 'Python', extension: '.py', monacoLanguage: 'python' },
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoLanguage: 'javascript' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoLanguage: 'typescript' },
  { id: 'go', name: 'Go', extension: '.go', monacoLanguage: 'go' },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoLanguage: 'rust' },
  { id: 'java', name: 'Java', extension: '.java', monacoLanguage: 'java' },
  { id: 'c', name: 'C', extension: '.c', monacoLanguage: 'c' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoLanguage: 'cpp' },
];

export const USER_COLORS: string[] = [
  '#C85A32', // terracotta (brand accent)
  '#2C5E8A', // deep slate blue
  '#2D7F53', // forest green
  '#8E4482', // plum
  '#C47D1C', // warm amber
  '#217D85', // teal
  '#A8432A', // rust
  '#4A4E9E', // indigo
];

export const LIMITS = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_PROJECT_FILES: 1000,
  TERMINAL_IDLE_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  YJS_PERSIST_INTERVAL_MS: 30 * 1000, // 30 seconds
  AI_DEBOUNCE_MS: 300,
  ATTRIBUTION_FADE_MS: 30 * 1000, // 30 seconds
};
