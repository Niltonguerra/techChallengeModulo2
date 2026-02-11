import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import type { Question } from '../../types/question';
import './QuestionCard.scss';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';

interface QuestionCardProps {
  question: Question;
  isAdmin: boolean;
  onDelete?: (id: string) => void;
  onAssign?: (id: string) => void;
}

export function QuestionCard({
  question,
  onDelete,
  onAssign,
  isAdmin,
}: QuestionCardProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(question.id);
  };

  const openChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/questions/${question.id}/chat`);
  };

  return (
    <div className={`question-card ${open ? 'open' : ''}`}>
      <div className="question-card__header" onClick={toggleOpen}>
        <div className="question-card__info">
          <span className="question-card__title"> - {question.title}</span>
          <div className="question-card__meta">
            <span className="subject">
              {question.school_subjects && question.school_subjects.length > 0
                ? question.school_subjects.map(s => s.name).join(', ')
                : 'Sem matéria'}
            </span>
            <span className="separator">•</span>
            <span className="date">
              {new Date(question.created_at).toLocaleDateString('pt-BR')}
            </span>
            {question.admin ? (
              <>
                <span className="separator">•</span>
                <div className="admin-info" title="Professor responsável">
                  <SupervisorAccountIcon
                    sx={{
                      fontSize: 16,
                      marginRight: '4px',
                      marginTop: '2px',
                    }}
                  />
                  <span>{question.admin.name}</span>
                </div>
              </>
            ) : (
              <>
                <span className="separator">•</span>
                <div
                  className="pending-info"
                  title="Aguardando um professor assumir"
                >
                  <HourglassEmptyIcon
                    sx={{
                      fontSize: 16,
                      marginRight: '4px',
                      marginTop: '2px',
                    }}
                  />
                  <span>Aguardando Professor</span>
                </div>
              </>
            )}
            <span className="separator">•</span>
            {question.status === 'OPEN' ? (
              <div className="status-info open" title="Dúvida em aberto">
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 16, marginRight: '4px', marginTop: '2px' }}
                />
                <span>Dúvida Aberta</span>
              </div>
            ) : (
              <div className="status-info closed" title="Dúvida finalizada">
                <LockIcon
                  sx={{ fontSize: 16, marginRight: '4px', marginTop: '2px' }}
                />
                <span>Dúvida Fechada</span>
              </div>
            )}
          </div>
        </div>

        <div className="question-card__actions">
          {isAdmin && !question.admin && question.status === 'OPEN' && (
            <Button
              size="small"
              variant="contained"
              className="assign-btn"
              onClick={() => onAssign?.(question.id)}
            >
              Pegar dúvida
            </Button>
          )}

          <button onClick={openChat} className="chat-btn" title="Abrir chat">
            <ChatBubbleOutlineIcon />
          </button>

          <button
            onClick={handleDelete}
            className="danger"
            title="Excluir pergunta"
          >
            <DeleteOutlineIcon />
          </button>

          <ExpandMoreIcon className={`expand-icon ${open ? 'rotate' : ''}`} />
        </div>
      </div>

      <div className="question-card__content">
        <p>{question.description}</p>
      </div>
    </div>
  );
}
