import { Namespace, Socket } from 'socket.io';
import { WS_EVENTS } from '@syncwrite/shared';
import { lspManager } from '../../lsp/LSPManager';
import { ProjectModel } from '../../models/Project';

export function registerLSPHandler(lspNs: Namespace) {
  lspNs.on('connection', (socket: Socket) => {
    const projectId = socket.data.projectId;

    if (!projectId) {
      socket.disconnect();
      return;
    }

    const projectRoom = `project:${projectId}`;
    socket.join(projectRoom);

    const project = ProjectModel.findById(projectId);
    const language = project?.language || 'javascript';

    // Spawn / connect to LSP server
    lspManager.getOrCreateServer(projectId, language, (msg: any) => {
      if (msg.id !== undefined) {
        lspNs.to(projectRoom).emit(WS_EVENTS.LSP.RESPONSE, msg);
      } else {
        lspNs.to(projectRoom).emit(WS_EVENTS.LSP.NOTIFICATION, msg);
      }
    });

    socket.on(WS_EVENTS.LSP.REQUEST, (req: any) => {
      lspManager.sendMessage(projectId, req);
    });

    socket.on(WS_EVENTS.LSP.NOTIFICATION, (notif: any) => {
      lspManager.sendMessage(projectId, notif);
    });
  });
}
