CREATE TABLE IF NOT EXISTS edit_events (
    id          TEXT PRIMARY KEY,
    project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path   TEXT NOT NULL,
    event_type  TEXT NOT NULL CHECK(event_type IN ('insert', 'delete', 'replace')),
    line        INTEGER NOT NULL,
    "column"    INTEGER NOT NULL,
    content     TEXT DEFAULT '',
    length      INTEGER DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_edit_project_file ON edit_events(project_id, file_path, created_at);
CREATE INDEX IF NOT EXISTS idx_edit_project_time ON edit_events(project_id, created_at);
