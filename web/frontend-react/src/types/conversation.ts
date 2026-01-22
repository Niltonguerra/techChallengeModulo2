export type ChatMessageProps = {
  content: string;
  isUserTheAuthor: boolean;
  authorName: string;
  createdAt: Date | string | number;
}
