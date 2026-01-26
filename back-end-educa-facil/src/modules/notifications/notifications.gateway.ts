import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // Quando um cliente se conecta
  handleConnection(client: Socket) {
    const userId =
      typeof client.handshake.query.userId === 'string' ? client.handshake.query.userId : undefined;

    if (userId) {
      void client.join(userId); // cada usuário entra numa sala com seu próprio ID
      console.log(`Usuário conectado à sala: ${userId}`);
    }
  }

  /**
   * Envia notificação de atualização de questão para um usuário específico
   */
  notifyQuestionUpdate(
    userId: string,
    payload: {
      questionId: string;
      title: string;
      senderRole: string;
      senderName?: string;
      senderPhoto?: string;
      senderId?: string;
    },
  ) {
    this.server.to(userId).emit('question:update', payload);
    console.log(`Notificação enviada para ${userId}:`, payload);
  }
}
