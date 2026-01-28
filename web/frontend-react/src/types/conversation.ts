export type ChatMessageProps = {
  message: string;
  isUserTheAuthor: boolean;
  authorName: string;
  createdAt: Date | string | number;
}
