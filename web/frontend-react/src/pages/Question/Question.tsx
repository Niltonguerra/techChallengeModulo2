import { useEffect, useState } from 'react';
import { Box, Stack, Button, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { QuestionCard } from '../../components/QuestionCard/QuestionCard';
import { Dropdown } from '../../components/Dropdown/Dropdown';

import type { Question } from '../../types/question';
import type { DropdownOption } from '../../types/dropdown';
import type { RootState } from '../../store';

import { getSchoolSubjectsDropdown } from '../../service/schoolSubject';
import { getQuestions, deleteQuestion } from '../../service/question';
import { assignQuestion } from '../../service/question';


export default function Question() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  const isAdmin = user?.permission !== 'user';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [filterType, setFilterType] = useState('');
  const [subject, setSubject] = useState('');

  const [subjectsOptions, setSubjectsOptions] = useState<DropdownOption[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const filterOptions: DropdownOption[] = [
    { label: 'Dúvidas sem responsável', value: 'UNASSIGNED' },
    { label: 'Dúvidas atribuídas a mim', value: 'MINE' },
  ];

  useEffect(() => {
    if (!isAdmin) {
      setFilterType('MINE');
    }
  }, [isAdmin]);

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        const data = await getSchoolSubjectsDropdown();
        setSubjectsOptions(data);
      } catch (error) {
        console.error('Erro ao carregar matérias', error);
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  const loadQuestions = async () => {
  try {
    setLoadingQuestions(true);

    const params: {
      subject?: string;
      assignment?: 'UNASSIGNED' | 'MINE';
    } = {};

    if (subject) {
      params.subject = subject;
    }

    if (isAdmin && filterType) {
      params.assignment = filterType as 'UNASSIGNED' | 'MINE';
    }

    if (!isAdmin) {
      params.assignment = 'MINE';
    }

    const data = await getQuestions(params);
    setQuestions(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Erro ao carregar dúvidas', error);
  } finally {
    setLoadingQuestions(false);
  }
};

  useEffect(() => {
    loadQuestions();
  }, [subject, filterType]);

  const handleDeleteQuestion = async (id: string) => {
  try {
    await deleteQuestion(id);

    setQuestions((prev) =>
      prev.filter((question) => question.id !== id),
    );
  } catch (err) {
    console.error(err);
  }
};



  const handleAssign = async (id: string) => {
    try {
      await assignQuestion(id);
      loadQuestions();
    } catch (error) {
      console.error('Erro ao assumir dúvida', error);
    }
  };



  const handleClearFilters = () => {
    setSubject('');

    if (isAdmin) {
      setFilterType('');
    }
  };

  return (
    <Box px={3} py={4}>
      <Typography variant="h4" mb={2}>
        Dúvidas
      </Typography>

      {!isAdmin && (
        <Button
          variant="contained"
          sx={{ mb: 4 }}
          onClick={() => navigate('/create-question')}
        >
          Criar nova dúvida
        </Button>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        mb={4}
        alignItems="flex-end"
      >
        <Dropdown
          label="Filtro de dúvidas"
          value={filterType}
          options={filterOptions}
          onChange={setFilterType}
          disabled={!isAdmin}
        />

        {loadingSubjects ? (
          <CircularProgress size={24} />
        ) : (
          <Dropdown
            label="Matéria"
            value={subject}
            options={subjectsOptions}
            onChange={setSubject}
          />
        )}

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearFilters}
          disabled={!subject && (isAdmin ? !filterType : true)}
        >
          Limpar filtros
        </Button>
      </Stack>

      {loadingQuestions ? (
        <CircularProgress />
      ) : questions.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma dúvida encontrada.
        </Typography>
      ) : (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isAdmin={isAdmin}
            onDelete={handleDeleteQuestion}
            onAssign={handleAssign}
          />
        ))
      )}
    </Box>
  );
}