import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
import { useEffect } from "react";
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


export function useConversationRealtime({ questionId, user, callbackFunction }: Props) {
  useEffect(() => {
    if (!questionId || !user) return;

    const socket = getConversationSocket();
    const userId = user.id;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      
      socket.emit("joinQuestion", { questionId, userId });
    };

    const onNewMessage = (payload: ConversationMessage) => {
      if (payload.questionId !== questionId) return;
      callbackFunction?.(payload.message);
    };

    socket.on("connect", onConnect);
    socket.on("conversation:new-message", onNewMessage);

    socket.on("joinedQuestion", () => {
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("conversation:new-message", onNewMessage);

      socket.emit("leaveQuestion", { questionId, userId });
    };
  }, [questionId, user?.id]);
}
