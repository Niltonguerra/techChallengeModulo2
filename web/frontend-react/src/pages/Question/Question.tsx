import { useState } from 'react';
import { QuestionCard } from '../../components/QuestionCard/QuestionCard';
import type { Question } from '../../types/question';


export default function Question() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'Dúvida sobre equação do 2º grau',
      description:
        'Não entendi como funciona a fórmula de Bhaskara, poderia explicar com mais exemplos?',
      id_school_subject: 'matematica',
      created_at: '2024-10-01T10:30:00Z',
    },
    {
      id: '2',
      title: 'Atividade de português',
      description:
        'Qual é a diferença entre sujeito oculto e sujeito indeterminado?',
      id_school_subject: 'portugues',
      created_at: '2024-10-02T14:00:00Z',
    },
    {
      id: '3',
      title: 'História - Revolução Francesa',
      description:
        'Quais foram as principais causas econômicas da Revolução Francesa?',
      id_school_subject: 'historia',
      created_at: '2024-10-03T09:15:00Z',
    },
  ]);

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div style={{ padding: 24 }}>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}