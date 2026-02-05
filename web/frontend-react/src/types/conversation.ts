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