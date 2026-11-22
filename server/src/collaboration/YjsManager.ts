import * as Y from 'yjs';
import { documentStore } from './DocumentStore';
import { mergeTracker } from './MergeTracker';
import { EditEvent } from '@syncwrite/shared';

export const YjsManager = {
  getDoc(
    projectId: string,
    filePath: string,
    onMergeEvent?: (event: EditEvent) => void
  ): Y.Doc {
    const doc = documentStore.getOrCreateDoc(projectId, filePath);
    mergeTracker.trackDoc(projectId, filePath, doc, onMergeEvent);
    return doc;
  },

  applyClientUpdate(
    projectId: string,
    filePath: string,
    update: Uint8Array,
    origin?: any
  ): void {
    const doc = this.getDoc(projectId, filePath);
    Y.applyUpdate(doc, update, origin);
  },

  getDocState(projectId: string, filePath: string): Uint8Array {
    const doc = this.getDoc(projectId, filePath);
    return Y.encodeStateAsUpdate(doc);
  },

  addUser(projectId: string, filePath: string, socketId: string): void {
    documentStore.addUser(projectId, filePath, socketId);
  },

  removeUser(projectId: string, filePath: string, socketId: string): void {
    documentStore.removeUser(projectId, filePath, socketId);
  },
};
