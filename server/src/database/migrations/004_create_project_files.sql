CREATE TABLE IF NOT EXISTS project_files (
    id          TEXT PRIMARY KEY,
    project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    path        TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'file' CHECK(type IN ('file', 'directory')),
    size        INTEGER DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(project_id, path)
);

CREATE INDEX IF NOT EXISTS idx_files_project ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_path ON project_files(project_id, path);
