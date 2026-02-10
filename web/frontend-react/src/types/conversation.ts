export type ChatMessageProps = {
  content: string;
  isUserTheAuthor: boolean;
  authorName: string;
  createdAt: Date | string | number;
}

export interface UseGenerateQuestion {
  conversation: ChatMessageProps[];
  setLoading: (loading: boolean) => void;
}



export interface MessageConversation {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
}
 export interface ConversationMessage {
  questionId: string;
  message: MessageConversation;
}
