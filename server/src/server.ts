import http from 'http';
import { createApp } from './app';
import { setupWebSocket } from './websocket';

export function createServer() {
  const app = createApp();
  const httpServer = http.createServer(app);
  const io = setupWebSocket(httpServer);

  return { app, httpServer, io };
}
