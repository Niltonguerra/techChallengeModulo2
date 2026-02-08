import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

let socket: Socket | null = null;

export function getNotificationSocket(): Socket {
  if (!socket) {
    socket = io(`${API_URL}/notification`, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }

  return socket;
}

export function disconnectNotificationSocket() {
  socket?.disconnect();
  socket = null;
}
