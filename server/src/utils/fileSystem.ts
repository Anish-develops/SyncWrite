import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';

export function getProjectDir(projectId: string): string {
  const dir = path.join(ENV.PROJECTS_DIR, projectId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getYjsDir(projectId: string): string {
  const dir = path.join(getProjectDir(projectId), '.yjs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function safePath(projectId: string, relativePath: string): string {
  const projectDir = getProjectDir(projectId);
  // normalize and remove leading slashes
  const cleanRelative = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '').replace(/^[\\\/]+/, '');
  const resolved = path.join(projectDir, cleanRelative);

  if (!resolved.startsWith(projectDir)) {
    throw new Error('Path traversal attempt detected');
  }

  return resolved;
}
