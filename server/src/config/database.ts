import fs from 'fs';
import path from 'path';
import { ENV } from './env';

// Ensure data directory exists
if (!fs.existsSync(ENV.DATA_DIR)) {
  fs.mkdirSync(ENV.DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(ENV.DATA_DIR, 'syncwrite.db');

export interface Statement<T = any> {
  run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
  get(...params: any[]): T | undefined;
  all(...params: any[]): T[];
}

export interface DatabaseClient {
  exec(sql: string): void;
  prepare<T = any>(sql: string): Statement<T>;
  pragma(sql: string): any;
}

class SqliteDatabase implements DatabaseClient {
  private db: any;

  constructor(filePath: string) {
    try {
      // Use Node 22+ built-in node:sqlite DatabaseSync
      // @ts-ignore
      const { DatabaseSync } = require('node:sqlite');
      this.db = new DatabaseSync(filePath);
    } catch {
      // Fallback to better-sqlite3 if available
      const Database = require('better-sqlite3');
      this.db = new Database(filePath);
    }

    this.exec('PRAGMA journal_mode = WAL;');
    this.exec('PRAGMA foreign_keys = ON;');
    this.exec('PRAGMA synchronous = NORMAL;');
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  prepare<T = any>(sql: string): Statement<T> {
    const stmt = this.db.prepare(sql);
    return {
      run: (...params: any[]) => {
        const res = stmt.run(...params);
        return {
          changes: res?.changes ?? 0,
          lastInsertRowid: res?.lastInsertRowid ?? 0,
        };
      },
      get: (...params: any[]) => {
        return stmt.get(...params) as T | undefined;
      },
      all: (...params: any[]) => {
        return stmt.all(...params) as T[];
      },
    };
  }

  pragma(sql: string): any {
    try {
      return this.db.pragma ? this.db.pragma(sql) : this.db.exec(`PRAGMA ${sql};`);
    } catch {
      return null;
    }
  }
}

export const db: DatabaseClient = new SqliteDatabase(DB_PATH);
export default db;
