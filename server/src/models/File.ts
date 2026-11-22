import db from '../config/database';
import { FileNode, FileNodeType } from '@syncwrite/shared';

export interface FileRow {
  id: string;
  project_id: string;
  path: string;
  type: FileNodeType;
  size: number;
  created_at: string;
  updated_at: string;
}

export const FileModel = {
  create(file: {
    id: string;
    projectId: string;
    path: string;
    type: FileNodeType;
    size?: number;
  }): FileRow {
    db.prepare(`
      INSERT INTO project_files (id, project_id, path, type, size)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(project_id, path) DO UPDATE SET
        type = excluded.type,
        size = excluded.size,
        updated_at = datetime('now')
    `).run(file.id, file.projectId, file.path, file.type, file.size || 0);

    return this.findByPath(file.projectId, file.path)!;
  },

  findByPath(projectId: string, path: string): FileRow | null {
    return (
      db
        .prepare<FileRow>('SELECT * FROM project_files WHERE project_id = ? AND path = ?')
        .get(projectId, path) || null
    );
  },

  findAll(projectId: string): FileRow[] {
    return db
      .prepare<FileRow>('SELECT * FROM project_files WHERE project_id = ? ORDER BY path ASC')
      .all(projectId);
  },

  updateSize(projectId: string, path: string, size: number): void {
    db.prepare(
      "UPDATE project_files SET size = ?, updated_at = datetime('now') WHERE project_id = ? AND path = ?"
    ).run(size, projectId, path);
  },

  rename(projectId: string, oldPath: string, newPath: string): void {
    // If directory, update all children as well
    db.prepare(`
      UPDATE project_files
      SET path = ? || substr(path, length(?) + 1),
          updated_at = datetime('now')
      WHERE project_id = ? AND (path = ? OR path LIKE ? || '/%')
    `).run(newPath, oldPath, projectId, oldPath, oldPath);
  },

  delete(projectId: string, path: string): void {
    db.prepare(`
      DELETE FROM project_files
      WHERE project_id = ? AND (path = ? OR path LIKE ? || '/%')
    `).run(projectId, path, path);
  },
};
