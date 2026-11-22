import { UserPresence } from '@syncwrite/shared';

export class AwarenessManager {
  // projectId -> socketId -> UserPresence
  private presences = new Map<string, Map<string, UserPresence>>();

  public setPresence(projectId: string, socketId: string, presence: UserPresence): void {
    let projectMap = this.presences.get(projectId);
    if (!projectMap) {
      projectMap = new Map();
      this.presences.set(projectId, projectMap);
    }
    projectMap.set(socketId, presence);
  }

  public getPresences(projectId: string): UserPresence[] {
    const projectMap = this.presences.get(projectId);
    if (!projectMap) return [];
    return Array.from(projectMap.values());
  }

  public removePresence(projectId: string, socketId: string): UserPresence | null {
    const projectMap = this.presences.get(projectId);
    if (!projectMap) return null;
    const removed = projectMap.get(socketId) || null;
    projectMap.delete(socketId);
    if (projectMap.size === 0) {
      this.presences.delete(projectId);
    }
    return removed;
  }
}

export const awarenessManager = new AwarenessManager();
