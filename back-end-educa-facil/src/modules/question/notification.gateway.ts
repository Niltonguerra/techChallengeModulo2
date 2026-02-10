import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/notification',
  cors: { origin: '*', credentials: true },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = client.handshake.auth?.userId;

    console.log('🔔 Notification conectado', 'socketId=', client.id, 'userId=', userId);

    if (!userId) {
      client.disconnect();
      return;
    }

    void client.join(`user:${userId}`);
  }

  notifyUser(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit('notification:new', payload);
  }
}
