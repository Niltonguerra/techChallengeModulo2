import React from "react";
import "./styles.scss";
import type { ChatMessageProps } from "../../types/conversation";

function formatTime(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUserTheAuthor,
  authorName,
  createdAt,
}) => {
  const time = formatTime(createdAt);
  const authorInitial = authorName[0]?.toUpperCase();

  return (
    <div
      className={`chatMessage ${
        isUserTheAuthor ? "chatMessage--author" : "chatMessage--other"
      }`}
    >
      {!isUserTheAuthor && (
        <div className="chatMessage__avatar">{authorInitial}</div>
      )}

      <div className="chatMessage__body">
        <div className="chatMessage__bubble">
          <span className="chatMessage__content">{content}</span>
          {time && <span className="chatMessage__time">{time}</span>}
        </div>
      </div>

      {isUserTheAuthor && (
        <div className="chatMessage__avatar chatMessage__avatar--right">
          {authorInitial}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
