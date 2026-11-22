import { Namespace, Socket } from 'socket.io';
import { WS_EVENTS } from '@syncwrite/shared';
import { terminalManager } from '../../terminal/TerminalManager';

export function registerTerminalHandler(terminalNs: Namespace) {
  terminalNs.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    const projectId = socket.data.projectId;
    const userTerminals = new Set<string>();

    if (!projectId || !user) {
      socket.disconnect();
      return;
    }

    // Create terminal
    socket.on(
      WS_EVENTS.TERMINAL.CREATE,
      ({ cols = 80, rows = 24 }: { cols?: number; rows?: number }) => {
        try {
          const terminalId = terminalManager.createTerminal(
            projectId,
            user.id,
            cols,
            rows,
            (data: string) => {
              socket.emit(WS_EVENTS.TERMINAL.OUTPUT, { terminalId, data });
            },
            (code: number) => {
              socket.emit(WS_EVENTS.TERMINAL.EXIT, { terminalId, code });
              userTerminals.delete(terminalId);
            }
          );

          userTerminals.add(terminalId);
          socket.emit(WS_EVENTS.TERMINAL.CREATED, { terminalId });
        } catch (err: any) {
          console.error('Failed to create terminal:', err);
        }
      }
    );

    // Terminal input
    socket.on(
      WS_EVENTS.TERMINAL.INPUT,
      ({ terminalId, data }: { terminalId: string; data: string }) => {
        if (terminalId && data) {
          terminalManager.write(terminalId, data);
        }
      }
    );

    // Terminal resize
    socket.on(
      WS_EVENTS.TERMINAL.RESIZE,
      ({ terminalId, cols, rows }: { terminalId: string; cols: number; rows: number }) => {
        if (terminalId && cols && rows) {
          terminalManager.resize(terminalId, cols, rows);
        }
      }
    );

    // Kill terminal
    socket.on(WS_EVENTS.TERMINAL.KILL, ({ terminalId }: { terminalId: string }) => {
      if (terminalId) {
        terminalManager.kill(terminalId);
        userTerminals.delete(terminalId);
      }
    });

    socket.on('disconnect', () => {
      // Clean up any terminals associated with this socket
      for (const id of userTerminals) {
        terminalManager.kill(id);
      }
      userTerminals.clear();
    });
  });
}
