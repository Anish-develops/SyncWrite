import * as Y from 'yjs';
import { EditEventModel } from '../models/EditEvent';
import { generateId } from '../utils/uuid';
import { EditEventType, EditEvent } from '@syncwrite/shared';

export class MergeTracker {
  private observedDocs = new Set<string>();

  public trackDoc(
    projectId: string,
    filePath: string,
    doc: Y.Doc,
    onMergeEvent?: (event: EditEvent) => void
  ): void {
    const key = `${projectId}:${filePath}`;
    if (this.observedDocs.has(key)) return;
    this.observedDocs.add(key);

    const ytext = doc.getText('content');

    ytext.observe((event: Y.YTextEvent, transaction: Y.Transaction) => {
      // Transaction origin can carry userId or socket info
      const origin = transaction.origin;
      const userId = (origin && typeof origin === 'object' && origin.userId) || 'remote-user';
      const userName = (origin && typeof origin === 'object' && origin.username) || 'Collaborator';
      const userColor = (origin && typeof origin === 'object' && origin.avatarColor) || '#C85A32';

      let currentPos = 0;

      event.delta.forEach((change) => {
        if (change.retain) {
          currentPos += change.retain;
        } else if (change.insert) {
          const insertText = typeof change.insert === 'string' ? change.insert : '';
          const lines = ytext.toString().slice(0, currentPos).split('\n');
          const line = lines.length;
          const column = lines[lines.length - 1].length + 1;

          const editEvent: EditEvent = {
            id: generateId(),
            projectId,
            userId,
            user: {
              id: userId,
              username: userName,
              avatarColor: userColor,
            },
            filePath,
            eventType: 'insert',
            line,
            column,
            content: insertText,
            length: insertText.length,
            createdAt: new Date().toISOString(),
          };

          try {
            EditEventModel.create(editEvent);
          } catch (e) {
            // Non-blocking if edit_events insert fails
          }

          if (onMergeEvent) {
            onMergeEvent(editEvent);
          }

          currentPos += insertText.length;
        } else if (change.delete) {
          const lines = ytext.toString().slice(0, currentPos).split('\n');
          const line = lines.length;
          const column = lines[lines.length - 1].length + 1;

          const editEvent: EditEvent = {
            id: generateId(),
            projectId,
            userId,
            user: {
              id: userId,
              username: userName,
              avatarColor: userColor,
            },
            filePath,
            eventType: 'delete',
            line,
            column,
            content: '',
            length: change.delete,
            createdAt: new Date().toISOString(),
          };

          try {
            EditEventModel.create(editEvent);
          } catch (e) {
            // Non-blocking
          }

          if (onMergeEvent) {
            onMergeEvent(editEvent);
          }
        }
      });
    });
  }
}

export const mergeTracker = new MergeTracker();
