import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const updateProfileSchema = z.object({
  username: z.string().min(2).max(30).optional(),
  avatarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color hex code').optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  language: z.enum([
    'python',
    'javascript',
    'typescript',
    'go',
    'rust',
    'java',
    'c',
    'cpp',
  ]),
  description: z.string().max(500).optional().default(''),
  template: z.string().nullable().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const createFileSchema = z.object({
  path: z.string().min(1, 'File path is required'),
  type: z.enum(['file', 'directory']),
  content: z.string().optional(),
});

export const updateFileSchema = z.object({
  content: z.string(),
});

export const renameFileSchema = z.object({
  newPath: z.string().min(1, 'New path is required'),
});

export const saveReviewSchema = z.object({
  filePath: z.string().min(1),
  provider: z.enum(['openai', 'gemini', 'anthropic']),
  comments: z.array(
    z.object({
      line: z.number().int().min(1),
      severity: z.enum(['error', 'warning', 'info']),
      message: z.string(),
      suggestion: z.string().optional(),
    })
  ),
});
