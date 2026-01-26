export type ChatMessageProps = {
  content: string;
  isUserTheAuthor: boolean;
  authorName: string;
  createdAt: Date | string | number;
}
export interface QuestionNotification {
  id: string;  
  questionId: string;
  title: string;
  read: boolean;
  senderId: string;
  senderPhoto?: string;
  senderName?: string;
}