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

  // FE joins a room for a specific question
  @SubscribeMessage('joinQuestion')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { questionId: string },
  ) {
    client.join(roomName(data.questionId));
    client.emit('joinedQuestion', { questionId: data.questionId });
  }

  @SubscribeMessage('leaveQuestion')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { questionId: string },
  ) {
    client.leave(roomName(data.questionId));
  }

  notifyNewMessages(questionId: string) {
    this.server.to(roomName(questionId)).emit('newMessages', { questionId });
  }
}
