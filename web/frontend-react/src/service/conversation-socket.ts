import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let socket: Socket | null = null;

export function getConversationSocket(): Socket {
  if (!socket) {
    socket = io(`${API_URL}/conversation`, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectConversationSocket() {
  socket?.disconnect();
  socket = null;
}

import { useEffect } from "react";

type Props = {
  questionId: string;
  callbackFunction?: () => void;
};

export function useConversationRealtime({ questionId, callbackFunction }: Props) {
  useEffect(() => {
    if (!questionId) return;

    const socket = getConversationSocket();

    // Join the room for this question
    socket.emit("joinQuestion", { questionId });

    const onNewMessages = async (payload: { questionId: string }) => {
      // only react to the current question
      if (payload.questionId !== questionId) return;

			if(callbackFunction) {
				callbackFunction();
				return;
			}
    };

    socket.on("newMessages", onNewMessages);

    socket.on("joinedQuestion", ({ questionId }) => console.log("CONVERSATION SOCKET LISTENING --- ", questionId));

    return () => {
      socket.off("newMessages", onNewMessages);
      socket.emit("leaveQuestion", { questionId });
    };
  }, [questionId, callbackFunction]);
}
