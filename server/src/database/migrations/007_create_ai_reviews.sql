CREATE TABLE IF NOT EXISTS ai_reviews (
    id          TEXT PRIMARY KEY,
    project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path   TEXT NOT NULL,
    provider    TEXT NOT NULL CHECK(provider IN ('openai', 'gemini', 'anthropic')),
    comments    TEXT NOT NULL DEFAULT '[]',
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reviews_project ON ai_reviews(project_id, file_path);
