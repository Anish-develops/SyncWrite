CREATE TABLE IF NOT EXISTS projects (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    owner_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language    TEXT NOT NULL DEFAULT 'javascript',
    template    TEXT,
    description TEXT DEFAULT '',
    invite_code TEXT NOT NULL UNIQUE,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_invite ON projects(invite_code);
