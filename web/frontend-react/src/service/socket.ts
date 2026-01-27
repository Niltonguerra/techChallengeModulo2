import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(userId: string) {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      query: { userId },
    });
    socket.on('connect', () => {
      console.log('🟢 Socket conectado', userId);
    });
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket {
  if (!socket) {
    throw new Error('Socket não conectado');
  }
  return socket;
}
