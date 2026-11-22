import { Namespace, Socket } from 'socket.io';
import { WS_EVENTS, CodeRef } from '@syncwrite/shared';
import { ChatMessageModel } from '../../models/ChatMessage';
import { generateId } from '../../utils/uuid';

export function registerChatHandler(chatNs: Namespace) {
  chatNs.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    const projectId = socket.data.projectId;

    if (!projectId || !user) {
      socket.disconnect();
      return;
    }

    const projectRoom = `project:${projectId}`;
    socket.join(projectRoom);

    socket.on(
      WS_EVENTS.CHAT.MESSAGE,
      ({ message, codeRef }: { message: string; codeRef?: CodeRef | null }) => {
        if (!message || !message.trim()) return;

        const chatMessage = ChatMessageModel.create({
          id: generateId(),
          projectId,
          userId: user.id,
          message: message.trim(),
          codeRef,
        });

        // Broadcast to everyone in the project
        chatNs.to(projectRoom).emit(WS_EVENTS.CHAT.MESSAGE, chatMessage);
      }
    );

    socket.on(WS_EVENTS.CHAT.TYPING, () => {
      socket.to(projectRoom).emit(WS_EVENTS.CHAT.TYPING, { userId: user.id, username: user.username });
    });

    socket.on(WS_EVENTS.CHAT.TYPING_STOP, () => {
      socket.to(projectRoom).emit(WS_EVENTS.CHAT.TYPING_STOP, { userId: user.id });
    });
  });
}
