import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './styles.scss';
import ChatMessage from '../Message/ChatMessage';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { formatDayLabel, sameDay, toDate } from '../../utils';
import type { ChatMessageProps } from '../../types/conversation';
import { getMessages, sendMessage } from '../../service/conversation';
import { useSnackbar } from '../../store/snackbar/useSnackbar';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useConversationRealtime } from '../../service/conversation-socket';
import { handleGenerateQuestionsForLearning } from '../../hooks/handleGenerateQuestionForLearning';

export type ConversationProps = {
  questionId: string;
  onConcludeConversation?: () => void;
};

export const Conversation: React.FC<ConversationProps> = ({
  questionId,
  onConcludeConversation,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [draft, setDraft] = useState<string>('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);
  const { showSnackbar } = useSnackbar();

  // delays the scroll to the bottom to next frame to ensure messages are rendered
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const createQuestionForLearning = () => {
    if (!user) return;
    handleGenerateQuestionsForLearning(
      messages,
      user?.name,
      setLoading,
      questionId
    ).then(newMessage => {
      setMessages(prev => [...prev, newMessage]);
    });
  };

  useConversationRealtime({
    questionId,
    user,
    callbackFunction: () => {
      if (!questionId) return;
      handleGetMessages(questionId);
    },
  });

  const handleGetMessages = useCallback(
    async (questionId: string) => {
      getMessages(questionId)
        .then(msgs => {
          setMessages(msgs);
        })
        .catch(err => {
          showSnackbar({
            message: 'Falha ao carregar mensagens da conversa.',
            severity: 'error',
          });
          console.error('Erro ao buscar mensagens da conversa:', err);
        });
    },
    [showSnackbar]
  );

  useEffect(() => {
    if (questionId) {
      handleGetMessages(questionId);
    }
  }, [questionId, handleGetMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = () => {
    if (!user) return;

    sendMessage(questionId, draft.trim())
      .then(() => {
        // setMessages(prev => [
        //   ...prev,
        //   {
        //     content: draft.trim(),
        //     isUserTheAuthor: true,
        //     authorName: user.name,
        //     createdAt: new Date(),
        //   },
        // ]);
        setDraft('');
      })
      .catch(err => {
        console.error('Erro ao enviar mensagem:', err);
        showSnackbar({
          message: 'Não foi possível enviar a mensagem.',
          severity: 'error',
        });
      });
  };

  // pressing enter sends the msg, but shift+enter adds a newline
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderedItems = useMemo(() => {
    const now = new Date();
    const items: React.ReactNode[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const msgDate = toDate(msg.createdAt);

      const prev = messages[i - 1];
      const prevDate = prev ? toDate(prev.createdAt) : null;

      const showSeparator = !prevDate || !sameDay(msgDate, prevDate);
      if (showSeparator) {
        items.push(
          <div key={`msg-${i}`} className="conversation__dateSeparatorWrap">
            <div className="conversation__dateSeparator">
              {formatDayLabel(msgDate, now)}
            </div>
          </div>
        );
      }

      items.push(
        <ChatMessage
          key={`${msg.authorName}-${msg.createdAt}`}
          content={msg.content}
          isUserTheAuthor={msg.isUserTheAuthor}
          authorName={msg.authorName}
          createdAt={msg.createdAt}
        />
      );
    }

    return items;
  }, [messages]);

  return (
    <div className="container">
      <div className="conversation">
        <div className="conversation__topbar">
          <Button
            onClick={() => navigate(-1)}
            variant="text"
            size="small"
            className="conversation__backBtn"
          >
            Voltar
          </Button>
          <Button
            variant="text"
            size="small"
            className="conversation__conclude"
            onClick={onConcludeConversation}
          >
            Concluir conversa
          </Button>
          <Button
            variant="text"
            size="small"
            className="conversation__conclude"
            onClick={createQuestionForLearning}
            disabled={loading}
          >
            criar perguntas de aprendizado
          </Button>
        </div>
        <div className="conversation__messages" ref={listRef}>
          {renderedItems}
          <div ref={bottomRef} />
        </div>

        <div className="conversation__composer">
          <TextField
            className="conversation__input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={'Digite sua mensagem aqui...'}
            multiline
            minRows={1}
            maxRows={4}
            fullWidth
          />

          <IconButton
            className="conversation__sendIcon"
            onClick={handleSend}
            disabled={!draft.trim()}
          >
            <SendRoundedIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
