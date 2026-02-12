import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
import { useEffect, useRef } from "react";
import type { User } from "../types/header-types";
import type { ConversationMessage, MessageConversation } from "../types/conversation";

let socket: Socket | null = null;

export function getConversationSocket(): Socket {
  if (!socket) {
    socket = io(`${API_URL}/conversation`, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}

export function disconnectConversationSocket() {
  socket?.disconnect();
  socket = null;
}

type Props = {
  questionId: string;
  user: User | null;
  callbackFunction?: (message: MessageConversation) => void;
};


export function leaveConversation(questionId: string, userId: string) {
  const socket = getConversationSocket();
  socket.emit("leaveQuestion", { questionId, userId });
}


export function useConversationRealtime({
  questionId,
  user,
  callbackFunction,
}: Props) {
  useEffect(() => {
    if (!questionId || !user) return;

    const socket = getConversationSocket();
    const userId = user.id;

    const handleConnect = () => {
      console.log("🟢 Conectado:", socket.id);
      socket.emit("joinQuestion", { questionId, userId });
    };

    const handleMessage = (payload: ConversationMessage) => {
      if (payload.questionId !== questionId) return;
      callbackFunction?.(payload.message);
    };

    socket.on("connect", handleConnect);
    socket.on("conversation:new-message", handleMessage);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      console.log("🧹 Saindo da conversa:", questionId);
      socket.emit("leaveQuestion", { questionId, userId });
      socket.off("connect", handleConnect);
      socket.off("conversation:new-message", handleMessage);

      socket.disconnect();
    };
  }, [questionId, user?.id]);
}