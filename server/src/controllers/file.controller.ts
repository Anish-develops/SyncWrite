import { Request, Response } from 'express';
import { FileService } from '../services/file.service';
import { ProjectModel } from '../models/Project';

function getLanguageFromExt(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py':
      return 'python';
    case 'js':
    case 'jsx':
    case 'mjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'java':
      return 'java';
    case 'c':
    case 'h':
      return 'c';
    case 'cpp':
    case 'hpp':
    case 'cc':
      return 'cpp';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
}

export const FileController = {
  async getTree(req: Request, res: Response) {
    const projectId = req.params.id;
    const tree = FileService.getTree(projectId);
    res.status(200).json({ tree });
  },

  async getFile(req: Request, res: Response) {
    const projectId = req.params.id;
    // URL-encoded path in params wildcard or param
    const relPath = decodeURIComponent(req.params[0] || req.params.path);

    try {
      const { content, size, updatedAt } = FileService.getFile(projectId, relPath);
      res.status(200).json({
        path: relPath,
        content,
        language: getLanguageFromExt(relPath),
        size,
        updatedAt,
      });
    } catch (err: any) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: err.message,
        },
      });
    }
  },

  async create(req: Request, res: Response) {
    const projectId = req.params.id;
    const { path: relPath, type, content } = req.body;

    try {
      FileService.createFile(projectId, relPath, type, content || '');
      res.status(201).json({
        path: relPath,
        type,
        size: content ? Buffer.byteLength(content, 'utf-8') : 0,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: err.message,
        },
      });
    }
  },

  async update(req: Request, res: Response) {
    const projectId = req.params.id;
    const relPath = decodeURIComponent(req.params[0] || req.params.path);
    const { content } = req.body;

    try {
      const result = FileService.updateFile(projectId, relPath, content);
      res.status(200).json({
        path: relPath,
        ...result,
      });
    } catch (err: any) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: err.message,
        },
      });
    }
  },

  async rename(req: Request, res: Response) {
    const projectId = req.params.id;
    const oldPath = decodeURIComponent(req.params[0] || req.params.path);
    const { newPath } = req.body;

    try {
      FileService.renameFile(projectId, oldPath, newPath);
      res.status(200).json({
        oldPath,
        newPath,
      });
    } catch (err: any) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message,
        },
      });
    }
  },

  async delete(req: Request, res: Response) {
    const projectId = req.params.id;
    const relPath = decodeURIComponent(req.params[0] || req.params.path);

    try {
      FileService.deleteFile(projectId, relPath);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: err.message,
        },
      });
    }
  },

  async download(req: Request, res: Response) {
    const projectId = req.params.id;
    const project = ProjectModel.findById(projectId);
    const projectName = project ? project.name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'project';

    res.attachment(`${projectName}.zip`);
    const archive = FileService.getZipArchive(projectId);

    archive.on('error', (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);
    archive.finalize();
  },
};
