import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { FileNode } from '@syncwrite/shared';
import { safePath, getProjectDir } from '../utils/fileSystem';
import { FileModel } from '../models/File';
import { generateId } from '../utils/uuid';

export const FileService = {
  getTree(projectId: string): FileNode[] {
    const projectDir = getProjectDir(projectId);

    function buildNode(currentPath: string, relativePath: string): FileNode | null {
      // Ignore hidden files like .yjs, .git, etc.
      const name = path.basename(currentPath);
      if (name.startsWith('.')) return null;

      const stat = fs.statSync(currentPath);

      if (stat.isDirectory()) {
        const childrenEntries = fs.readdirSync(currentPath);
        const children: FileNode[] = [];

        for (const child of childrenEntries) {
          const childCurrent = path.join(currentPath, child);
          const childRel = relativePath ? `${relativePath}/${child}` : child;
          const node = buildNode(childCurrent, childRel.replace(/\\/g, '/'));
          if (node) {
            children.push(node);
          }
        }

        // Sort: directories first, then files alphabetically
        children.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'directory' ? -1 : 1;
        });

        return {
          name,
          path: relativePath.replace(/\\/g, '/'),
          type: 'directory',
          children,
        };
      } else {
        return {
          name,
          path: relativePath.replace(/\\/g, '/'),
          type: 'file',
          size: stat.size,
          updatedAt: stat.mtime.toISOString(),
        };
      }
    }

    if (!fs.existsSync(projectDir)) return [];

    const rootEntries = fs.readdirSync(projectDir);
    const tree: FileNode[] = [];

    for (const entry of rootEntries) {
      const entryPath = path.join(projectDir, entry);
      const node = buildNode(entryPath, entry);
      if (node) {
        tree.push(node);
      }
    }

    tree.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });

    return tree;
  },

  getFile(projectId: string, relPath: string): { content: string; size: number; updatedAt: string } {
    const filePath = safePath(projectId, relPath);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      throw new Error('Cannot read directory as file');
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      content,
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
    };
  },

  createFile(projectId: string, relPath: string, type: 'file' | 'directory', content = ''): void {
    const fullPath = safePath(projectId, relPath);
    if (fs.existsSync(fullPath)) {
      throw new Error('File or directory already exists at this path');
    }

    if (type === 'directory') {
      fs.mkdirSync(fullPath, { recursive: true });
      FileModel.create({
        id: generateId(),
        projectId,
        path: relPath.replace(/\\/g, '/'),
        type: 'directory',
      });
    } else {
      const parentDir = path.dirname(fullPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(fullPath, content, 'utf-8');
      FileModel.create({
        id: generateId(),
        projectId,
        path: relPath.replace(/\\/g, '/'),
        type: 'file',
        size: Buffer.byteLength(content, 'utf-8'),
      });
    }
  },

  updateFile(projectId: string, relPath: string, content: string): { size: number; updatedAt: string } {
    const fullPath = safePath(projectId, relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found');
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    const stat = fs.statSync(fullPath);

    FileModel.updateSize(projectId, relPath.replace(/\\/g, '/'), stat.size);

    return {
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
    };
  },

  renameFile(projectId: string, oldPath: string, newPath: string): void {
    const oldFull = safePath(projectId, oldPath);
    const newFull = safePath(projectId, newPath);

    if (!fs.existsSync(oldFull)) {
      throw new Error('Source file not found');
    }
    if (fs.existsSync(newFull)) {
      throw new Error('Destination already exists');
    }

    const newParent = path.dirname(newFull);
    if (!fs.existsSync(newParent)) {
      fs.mkdirSync(newParent, { recursive: true });
    }

    fs.renameSync(oldFull, newFull);
    FileModel.rename(projectId, oldPath.replace(/\\/g, '/'), newPath.replace(/\\/g, '/'));
  },

  deleteFile(projectId: string, relPath: string): void {
    const fullPath = safePath(projectId, relPath);
    if (!fs.existsSync(fullPath)) return;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }

    FileModel.delete(projectId, relPath.replace(/\\/g, '/'));
  },

  getZipArchive(projectId: string): archiver.Archiver {
    const projectDir = getProjectDir(projectId);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Exclude .yjs internal state from user zip
    archive.glob('**/*', {
      cwd: projectDir,
      ignore: ['.yjs/**', '.git/**'],
    });

    return archive;
  },
};
