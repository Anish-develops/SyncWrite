import { Namespace, Socket } from 'socket.io';
import * as Y from 'yjs';
import { WS_EVENTS } from '@syncwrite/shared';
import { YjsManager } from '../../collaboration/YjsManager';
import { awarenessManager } from '../../collaboration/AwarenessManager';
import { documentStore } from '../../collaboration/DocumentStore';

export function registerCollaborationHandler(collabNs: Namespace) {
  collabNs.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    const projectId = socket.data.projectId;

    if (!projectId || !user) {
      socket.disconnect();
      return;
    }

    const projectRoom = `project:${projectId}`;
    socket.join(projectRoom);

    // Register presence
    awarenessManager.setPresence(projectId, socket.id, {
      id: user.id,
      username: user.username,
      avatarColor: user.avatarColor,
      lastActive: Date.now(),
    });

    // Notify project members of current presence
    const onlineUsers = awarenessManager.getPresences(projectId);
    collabNs.to(projectRoom).emit(WS_EVENTS.COLLAB.PRESENCE_USERS, onlineUsers);
    socket.to(projectRoom).emit(WS_EVENTS.COLLAB.PRESENCE_JOIN, user);

    // File open event: send initial Yjs state to client
    socket.on(WS_EVENTS.COLLAB.FILE_OPEN, ({ filePath }: { filePath: string }) => {
      if (!filePath) return;
      const fileRoom = `file:${projectId}:${filePath}`;
      socket.join(fileRoom);

      YjsManager.addUser(projectId, filePath, socket.id);

      // Get or create Y.Doc with merge event hook
      const doc = YjsManager.getDoc(projectId, filePath, (editEvent) => {
        collabNs.to(projectRoom).emit(WS_EVENTS.COLLAB.MERGE_EVENT, editEvent);
      });

      // Send current state vector to client
      const stateUpdate = Y.encodeStateAsUpdate(doc);
      socket.emit(WS_EVENTS.COLLAB.SYNC, {
        filePath,
        update: stateUpdate,
      });

      // Update user current file in presence
      const currentPresence = awarenessManager.getPresences(projectId).find((p) => p.id === user.id);
      if (currentPresence) {
        currentPresence.currentFile = filePath;
        awarenessManager.setPresence(projectId, socket.id, currentPresence);
        collabNs.to(projectRoom).emit(WS_EVENTS.COLLAB.PRESENCE_USERS, awarenessManager.getPresences(projectId));
      }
    });

    // File close event
    socket.on(WS_EVENTS.COLLAB.FILE_CLOSE, ({ filePath }: { filePath: string }) => {
      if (!filePath) return;
      const fileRoom = `file:${projectId}:${filePath}`;
      socket.leave(fileRoom);
      YjsManager.removeUser(projectId, filePath, socket.id);
    });

    // Yjs sync updates
    socket.on(
      WS_EVENTS.COLLAB.SYNC,
      ({ filePath, update }: { filePath: string; update: Uint8Array }) => {
        if (!filePath || !update) return;

        const updateArray = new Uint8Array(update);
        YjsManager.applyClientUpdate(projectId, filePath, updateArray, {
          userId: user.id,
          username: user.username,
          avatarColor: user.avatarColor,
        });

        // Broadcast to other collaborators in this file room
        const fileRoom = `file:${projectId}:${filePath}`;
        socket.to(fileRoom).emit(WS_EVENTS.COLLAB.SYNC, {
          filePath,
          update: updateArray,
        });
      }
    );

    // Awareness updates (cursors, selections)
    socket.on(
      WS_EVENTS.COLLAB.AWARENESS,
      ({ filePath, awareness }: { filePath: string; awareness: any }) => {
        const fileRoom = `file:${projectId}:${filePath}`;
        socket.to(fileRoom).emit(WS_EVENTS.COLLAB.AWARENESS, {
          filePath,
          awareness,
          user,
        });
      }
    );

    // Disconnect
    socket.on('disconnect', () => {
      const removed = awarenessManager.removePresence(projectId, socket.id);

      // Clean up any files user had open
      const openFiles = documentStore.getOpenFilesForSocket(socket.id);
      for (const key of openFiles) {
        const [, filePath] = key.split(':');
        YjsManager.removeUser(projectId, filePath, socket.id);
      }

      if (removed) {
        collabNs.to(projectRoom).emit(WS_EVENTS.COLLAB.PRESENCE_LEAVE, { userId: user.id });
        collabNs.to(projectRoom).emit(WS_EVENTS.COLLAB.PRESENCE_USERS, awarenessManager.getPresences(projectId));
      }
    });
  });
}
