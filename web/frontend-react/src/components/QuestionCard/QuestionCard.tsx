import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import type { Question } from '../../types/question';
import './QuestionCard.scss';

interface QuestionCardProps {
  question: Question;
  onDelete: (id: string) => void;
}

export function QuestionCard({ question, onDelete }: QuestionCardProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(question.id);
  };

  const openChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/questions/${question.id}/chat`);
  };

  return (
    <div className={`question-card ${open ? 'open' : ''}`}>
      <div className="question-card__header" onClick={toggleOpen}>
        <div className="question-card__info">
          <span className="question-card__title">
            {question.title}
          </span>

          <div className="question-card__meta">
            <span className="subject">{question.id_school_subject}</span>
            <span className="separator">•</span>
            <span className="date">
              {new Date(question.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="question-card__actions">
          <button onClick={openChat} title="Abrir chat">
            <ChatBubbleOutlineIcon />
          </button>

          <button
            onClick={handleDelete}
            className="danger"
            title="Excluir pergunta"
          >
            <DeleteOutlineIcon />
          </button>

          <ExpandMoreIcon
            className={`expand-icon ${open ? 'rotate' : ''}`}
          />
        </div>
      </div>

      <div className="question-card__content">
        <p>{question.description}</p>
      </div>
    </div>
  );
}
