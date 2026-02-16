/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const roomName = (questionId: string) => `question:${questionId}`;

@WebSocketGateway({
  namespace: '/conversation',
  cors: { origin: '*', credentials: true },
})
export class ConversationGateway {
  @WebSocketServer()
  server: Server;

  private activeViewers = new Map<string, Set<string>>();

  @SubscribeMessage('joinQuestion')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { questionId: string; userId: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.userId = data.userId;

    client.join(roomName(data.questionId));

    if (!this.activeViewers.has(data.questionId)) {
      this.activeViewers.set(data.questionId, new Set());
    }

    this.activeViewers.get(data.questionId)!.add(data.userId);

    client.emit('joinedQuestion', { questionId: data.questionId });
  }

  @SubscribeMessage('leaveQuestion')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { questionId: string; userId: string },
  ) {
    client.leave(roomName(data.questionId));
    this.activeViewers.get(data.questionId)?.delete(data.userId);
  }

  notifyNewMessages(
    questionId: string,
    message: {
      id: string;
      message: string;
      createdAt: Date;
      userId: string;
    },
  ) {
    this.server.to(roomName(questionId)).emit('conversation:new-message', { questionId, message });
  }

  async isUserViewing(questionId: string, userId: string): Promise<boolean> {
    const sockets = await this.server.in(roomName(questionId)).fetchSockets();
    return sockets.some((socket) => socket.data?.userId === userId);
  }
}
