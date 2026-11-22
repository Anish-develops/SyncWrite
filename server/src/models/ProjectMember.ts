import db from '../config/database';
import { ProjectMember, ProjectRole } from '@syncwrite/shared';

interface MemberRow {
  project_id: string;
  user_id: string;
  role: ProjectRole;
  joined_at: string;
  username: string;
  avatar_color: string;
}

export const ProjectMemberModel = {
  addMember(projectId: string, userId: string, role: ProjectRole = 'editor'): void {
    db.prepare(`
      INSERT OR IGNORE INTO project_members (project_id, user_id, role)
      VALUES (?, ?, ?)
    `).run(projectId, userId, role);
  },

  removeMember(projectId: string, userId: string): void {
    db.prepare('DELETE FROM project_members WHERE project_id = ? AND user_id = ?').run(
      projectId,
      userId
    );
  },

  getMember(projectId: string, userId: string): { role: ProjectRole } | null {
    const row = db
      .prepare<{ role: ProjectRole }>(
        'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?'
      )
      .get(projectId, userId);
    return row || null;
  },

  getMembers(projectId: string): ProjectMember[] {
    const rows = db
      .prepare<MemberRow>(`
        SELECT pm.*, u.username, u.avatar_color
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
        ORDER BY pm.role DESC, pm.joined_at ASC
      `)
      .all(projectId);

    return rows.map((r) => ({
      id: r.user_id,
      username: r.username,
      avatarColor: r.avatar_color,
      role: r.role,
      joinedAt: r.joined_at,
    }));
  },
};
