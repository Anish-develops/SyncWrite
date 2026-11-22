import fs from 'fs';
import path from 'path';
import db from '../config/database';

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const executedRows = db.prepare('SELECT name FROM migrations').all() as { name: string }[];
  const executed = new Set(executedRows.map((r) => r.name));

  let migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    migrationsDir = path.resolve(__dirname, '../../src/database/migrations');
  }

  if (!fs.existsSync(migrationsDir)) {
    console.warn(`Migrations directory not found at ${migrationsDir}`);
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (!executed.has(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      db.exec(sql);
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
      console.log(` Migration executed: ${file}`);
    }
  }
}
