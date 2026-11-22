import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ENV } from '../config/env';
import { wsAuth } from './middleware/wsAuth';
import { registerCollaborationHandler } from './handlers/collaboration.handler';
import { registerTerminalHandler } from './handlers/terminal.handler';
import { registerChatHandler } from './handlers/chat.handler';
import { registerLSPHandler } from './handlers/lsp.handler';

export function setupWebSocket(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    maxHttpBufferSize: 1e8, // 100MB for large files/updates
  });

  // /collab namespace
  const collabNs = io.of('/collab');
  collabNs.use(wsAuth);
  registerCollaborationHandler(collabNs);

  // /terminal namespace
  const terminalNs = io.of('/terminal');
  terminalNs.use(wsAuth);
  registerTerminalHandler(terminalNs);

  // /chat namespace
  const chatNs = io.of('/chat');
  chatNs.use(wsAuth);
  registerChatHandler(chatNs);

  // /lsp namespace
  const lspNs = io.of('/lsp');
  lspNs.use(wsAuth);
  registerLSPHandler(lspNs);

  return io;
}
