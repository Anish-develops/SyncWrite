import db from '../config/database';
import { User } from '@syncwrite/shared';

export interface UserRow {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  avatar_color: string;
  created_at: string;
  updated_at: string;
}

export const UserModel = {
  findById(id: string): User | null {
    const row = db
      .prepare<UserRow>('SELECT * FROM users WHERE id = ?')
      .get(id);
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      avatarColor: row.avatar_color,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  findByEmail(email: string): (User & { passwordHash: string }) | null {
    const row = db
      .prepare<UserRow>('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase());
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      avatarColor: row.avatar_color,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  create(user: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    avatarColor: string;
  }): User {
    db.prepare(`
      INSERT INTO users (id, email, username, password_hash, avatar_color)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      user.id,
      user.email.toLowerCase(),
      user.username,
      user.passwordHash,
      user.avatarColor
    );

    return this.findById(user.id)!;
  },

  updateProfile(id: string, updates: { username?: string; avatarColor?: string }): User | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.username) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.avatarColor) {
      fields.push('avatar_color = ?');
      values.push(updates.avatarColor);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },
};
