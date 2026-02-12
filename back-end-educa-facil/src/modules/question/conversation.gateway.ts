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

  handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = client.data?.userId;

    if (!userId) return;

    console.log('🔴 Socket desconectado:', client.id);

    // Remove o usuário de todas as salas que ele estiver
    for (const [questionId, viewers] of this.activeViewers.entries()) {
      if (viewers.has(userId)) {
        viewers.delete(userId);
        console.log(`🚪 Usuário ${userId} removido da sala ${questionId}`);
      }
    }
  }
  handleConnection(client: Socket) {
    console.log('🟢 Conversation namespace conectado:', client.id);
  }

  @SubscribeMessage('joinQuestion')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { questionId: string; userId: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.data.userId = data.userId;

    console.log('👥 Join:', data.questionId, data.userId);
    client.join(roomName(data.questionId));

    if (!this.activeViewers.has(data.questionId)) {
      this.activeViewers.set(data.questionId, new Set());
    }
    console.log('👥 JOIN conversation socket:', client.id);
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

  async notifyNewMessages(
    questionId: string,
    message: {
      id: string;
      message: string;
      authorName: string;
      createdAt: Date;
      userId: string;
    },
  ) {
    const room = roomName(questionId);
    const sockets = await this.server.in(room).fetchSockets();
    console.log('📡 Emitindo para sala:', room);
    console.log(
      '👀 Sockets na sala:',
      sockets.map((s) => s.id),
    );
    this.server.to(room).emit('conversation:new-message', { questionId, message });
  }

  async isUserViewing(questionId: string, userId: string): Promise<boolean> {
    const sockets = await this.server.in(roomName(questionId)).fetchSockets();
    return sockets.some((socket) => socket.data?.userId === userId);
  }
}
