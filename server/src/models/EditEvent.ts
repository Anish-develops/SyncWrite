import db from '../config/database';
import { EditEvent, EditEventType } from '@syncwrite/shared';

interface EditEventRow {
  id: string;
  project_id: string;
  user_id: string;
  file_path: string;
  event_type: EditEventType;
  line: number;
  column: number;
  content: string;
  length: number;
  created_at: string;
  username: string;
  avatar_color: string;
}

export const EditEventModel = {
  create(event: {
    id: string;
    projectId: string;
    userId: string;
    filePath: string;
    eventType: EditEventType;
    line: number;
    column: number;
    content: string;
    length: number;
  }): void {
    const truncatedContent = event.content.slice(0, 500);

    db.prepare(`
      INSERT INTO edit_events (id, project_id, user_id, file_path, event_type, line, "column", content, length)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      event.id,
      event.projectId,
      event.userId,
      event.filePath,
      event.eventType,
      event.line,
      event.column,
      truncatedContent,
      event.length
    );
  },

  findByProject(
    projectId: string,
    filePath?: string,
    limit = 100
  ): EditEvent[] {
    let query = `
      SELECT ee.*, u.username, u.avatar_color
      FROM edit_events ee
      JOIN users u ON ee.user_id = u.id
      WHERE ee.project_id = ?
    `;
    const params: any[] = [projectId];

    if (filePath) {
      query += ' AND ee.file_path = ?';
      params.push(filePath);
    }

    query += ' ORDER BY ee.created_at ASC LIMIT ?';
    params.push(limit);

    const rows = db.prepare<EditEventRow>(query).all(...params);

    return rows.map((r) => ({
      id: r.id,
      projectId: r.project_id,
      userId: r.user_id,
      user: {
        id: r.user_id,
        username: r.username,
        avatarColor: r.avatar_color,
      },
      filePath: r.file_path,
      eventType: r.event_type,
      line: r.line,
      column: r.column,
      content: r.content,
      length: r.length,
      createdAt: r.created_at,
    }));
  },
};
