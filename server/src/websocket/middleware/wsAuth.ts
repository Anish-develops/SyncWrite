import { Socket } from 'socket.io';
import { verifyAccessToken } from '../../utils/jwt';
import { UserModel } from '../../models/User';
import { ProjectMemberModel } from '../../models/ProjectMember';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      avatarColor: string;
    };
    projectId: string;
  };
}

export function wsAuth(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
  const projectId = (socket.handshake.query?.projectId as string) || (socket.handshake.auth?.projectId as string);

  if (!token) {
    return next(new Error('Authentication token required'));
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return next(new Error('Invalid or expired token'));
  }

  const user = UserModel.findById(payload.userId);
  if (!user) {
    return next(new Error('User not found'));
  }

  if (projectId) {
    const member = ProjectMemberModel.getMember(projectId, user.id);
    if (!member) {
      return next(new Error('User is not a member of this project'));
    }
  }

  socket.data.user = user;
  socket.data.projectId = projectId;
  next();
}
