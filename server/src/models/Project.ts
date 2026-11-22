import db from '../config/database';
import { Project, SupportedLanguage } from '@syncwrite/shared';

export interface ProjectRow {
  id: string;
  name: string;
  owner_id: string;
  language: SupportedLanguage;
  template: string | null;
  description: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
  owner_username?: string;
  owner_avatar_color?: string;
  member_count?: number;
  user_role?: 'owner' | 'editor';
}

export const ProjectModel = {
  create(project: {
    id: string;
    name: string;
    ownerId: string;
    language: SupportedLanguage;
    template?: string | null;
    description?: string;
    inviteCode: string;
  }): Project {
    db.prepare(`
      INSERT INTO projects (id, name, owner_id, language, template, description, invite_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      project.id,
      project.name,
      project.ownerId,
      project.language,
      project.template || null,
      project.description || '',
      project.inviteCode
    );

    // Automatically make owner a member
    db.prepare(`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (?, ?, 'owner')
    `).run(project.id, project.ownerId);

    return this.findById(project.id)!;
  },

  findById(id: string): Project | null {
    const row = db
      .prepare<ProjectRow>(`
        SELECT p.*, u.username as owner_username, u.avatar_color as owner_avatar_color,
               (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
        FROM projects p
        JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
      `)
      .get(id);

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      language: row.language,
      template: row.template,
      description: row.description,
      inviteCode: row.invite_code,
      ownerId: row.owner_id,
      owner: {
        id: row.owner_id,
        email: '',
        username: row.owner_username || 'Unknown',
        avatarColor: row.owner_avatar_color || '#C85A32',
        createdAt: '',
      },
      memberCount: row.member_count || 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  findByInviteCode(code: string): Project | null {
    const row = db
      .prepare<ProjectRow>('SELECT * FROM projects WHERE invite_code = ?')
      .get(code);
    if (!row) return null;
    return this.findById(row.id);
  },

  findByUser(
    userId: string,
    page = 1,
    limit = 20
  ): { projects: Project[]; total: number } {
    const offset = (page - 1) * limit;

    const countRow = db
      .prepare<{ total: number }>(`
        SELECT COUNT(*) as total
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
      `)
      .get(userId);

    const rows = db
      .prepare<ProjectRow>(`
        SELECT p.*, pm.role as user_role,
               (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
        ORDER BY p.updated_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(userId, limit, offset);

    const projects: Project[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      language: r.language,
      template: r.template,
      description: r.description,
      inviteCode: r.invite_code,
      ownerId: r.owner_id,
      role: r.user_role,
      memberCount: r.member_count,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return {
      projects,
      total: countRow?.total ?? 0,
    };
  },

  update(id: string, updates: { name?: string; description?: string }): Project | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  updateInviteCode(id: string, inviteCode: string): void {
    db.prepare("UPDATE projects SET invite_code = ?, updated_at = datetime('now') WHERE id = ?").run(
      inviteCode,
      id
    );
  },

  delete(id: string): void {
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  },
};
