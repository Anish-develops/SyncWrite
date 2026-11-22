import * as Y from 'yjs';
import fs from 'fs';
import path from 'path';
import { getYjsDir, safePath } from '../utils/fileSystem';

export class DocumentStore {
  private docs = new Map<string, Y.Doc>();
  private activeUsers = new Map<string, Set<string>>(); // docKey -> Set<socketId>
  private persistTimers = new Map<string, NodeJS.Timeout>();

  public getDocKey(projectId: string, filePath: string): string {
    return `${projectId}:${filePath}`;
  }

  public getOrCreateDoc(projectId: string, filePath: string): Y.Doc {
    const key = this.getDocKey(projectId, filePath);
    let doc = this.docs.get(key);

    if (!doc) {
      doc = new Y.Doc();
      const stateFile = this.getStateFilePath(projectId, filePath);

      if (fs.existsSync(stateFile)) {
        try {
          const binary = fs.readFileSync(stateFile);
          Y.applyUpdate(doc, new Uint8Array(binary));
        } catch (err) {
          console.error(`Failed to load Yjs state from ${stateFile}:`, err);
        }
      } else {
        // Initialize from raw file on disk if exists
        try {
          const rawFile = safePath(projectId, filePath);
          if (fs.existsSync(rawFile)) {
            const content = fs.readFileSync(rawFile, 'utf-8');
            const ytext = doc.getText('content');
            ytext.insert(0, content);
          }
        } catch (err) {
          console.error(`Failed to load initial file for ${filePath}:`, err);
        }
      }

      this.docs.set(key, doc);

      // Start periodic 30-second persistence timer
      const timer = setInterval(() => {
        this.persistDoc(projectId, filePath);
      }, 30000);
      this.persistTimers.set(key, timer);
    }

    return doc;
  }

  public addUser(projectId: string, filePath: string, socketId: string): void {
    const key = this.getDocKey(projectId, filePath);
    let users = this.activeUsers.get(key);
    if (!users) {
      users = new Set();
      this.activeUsers.set(key, users);
    }
    users.add(socketId);
  }

  public removeUser(projectId: string, filePath: string, socketId: string): void {
    const key = this.getDocKey(projectId, filePath);
    const users = this.activeUsers.get(key);
    if (users) {
      users.delete(socketId);
      if (users.size === 0) {
        // Last user disconnected: persist and clean up
        this.persistDoc(projectId, filePath);
        const timer = this.persistTimers.get(key);
        if (timer) {
          clearInterval(timer);
          this.persistTimers.delete(key);
        }
      }
    }
  }

  public persistDoc(projectId: string, filePath: string): void {
    const key = this.getDocKey(projectId, filePath);
    const doc = this.docs.get(key);
    if (!doc) return;

    try {
      const state = Y.encodeStateAsUpdate(doc);
      const stateFile = this.getStateFilePath(projectId, filePath);
      fs.writeFileSync(stateFile, Buffer.from(state));

      // Also flush Y.Text to actual source code file on disk
      const ytext = doc.getText('content');
      const textContent = ytext.toString();
      const rawFile = safePath(projectId, filePath);
      fs.writeFileSync(rawFile, textContent, 'utf-8');
    } catch (err) {
      console.error(`Failed to persist doc ${key}:`, err);
    }
  }

  private getStateFilePath(projectId: string, filePath: string): string {
    const yjsDir = getYjsDir(projectId);
    const encoded = encodeURIComponent(filePath) + '.ystate';
    return path.join(yjsDir, encoded);
  }

  public getOpenFilesForSocket(socketId: string): string[] {
    const openFiles: string[] = [];
    for (const [key, users] of this.activeUsers.entries()) {
      if (users.has(socketId)) {
        openFiles.push(key);
      }
    }
    return openFiles;
  }
}

export const documentStore = new DocumentStore();
