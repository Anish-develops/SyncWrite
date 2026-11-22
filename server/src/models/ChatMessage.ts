import db from '../config/database';
import { ChatMessage, CodeRef } from '@syncwrite/shared';

interface ChatRow {
  id: string;
  project_id: string;
  user_id: string;
  message: string;
  code_ref: string | null;
  created_at: string;
  username: string;
  avatar_color: string;
}

export const ChatMessageModel = {
  create(message: {
    id: string;
    projectId: string;
    userId: string;
    message: string;
    codeRef?: CodeRef | null;
  }): ChatMessage {
    const codeRefJson = message.codeRef ? JSON.stringify(message.codeRef) : null;

    db.prepare(`
      INSERT INTO chat_messages (id, project_id, user_id, message, code_ref)
      VALUES (?, ?, ?, ?, ?)
    `).run(message.id, message.projectId, message.userId, message.message, codeRefJson);

    return this.findById(message.id)!;
  },

  findById(id: string): ChatMessage | null {
    const row = db
      .prepare<ChatRow>(`
        SELECT cm.*, u.username, u.avatar_color
        FROM chat_messages cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.id = ?
      `)
      .get(id);

    if (!row) return null;

    return {
      id: row.id,
      projectId: row.project_id,
      user: {
        id: row.user_id,
        username: row.username,
        avatarColor: row.avatar_color,
      },
      message: row.message,
      codeRef: row.code_ref ? JSON.parse(row.code_ref) : null,
      createdAt: row.created_at,
    };
  },

  findByProject(
    projectId: string,
    limit = 50,
    beforeId?: string
  ): { messages: ChatMessage[]; hasMore: boolean } {
    let query = `
      SELECT cm.*, u.username, u.avatar_color
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.project_id = ?
    `;
    const params: any[] = [projectId];

    if (beforeId) {
      const beforeMsg = db
        .prepare<{ created_at: string }>('SELECT created_at FROM chat_messages WHERE id = ?')
        .get(beforeId);
      if (beforeMsg) {
        query += ' AND cm.created_at < ?';
        params.push(beforeMsg.created_at);
      }
    }

    query += ' ORDER BY cm.created_at DESC LIMIT ?';
    params.push(limit + 1);

    const rows = db.prepare<ChatRow>(query).all(...params);
    const hasMore = rows.length > limit;
    const resultRows = hasMore ? rows.slice(0, limit) : rows;

    const messages = resultRows.reverse().map((r) => ({
      id: r.id,
      projectId: r.project_id,
      user: {
        id: r.user_id,
        username: r.username,
        avatarColor: r.avatar_color,
      },
      message: r.message,
      codeRef: r.code_ref ? JSON.parse(r.code_ref) : null,
      createdAt: r.created_at,
    }));

    return { messages, hasMore };
  },
};
