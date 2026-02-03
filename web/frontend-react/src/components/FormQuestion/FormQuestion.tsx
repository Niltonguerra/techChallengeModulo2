import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { FormQuestionData } from '../../types/form-post';
import './FormQuestion.scss';
import { initialFormQuestionState } from '../../constants/formConstants';
import { useFormQuestionSubmit } from '../../hooks/useFormQuestionSubmit';
import { getSchoolSubjectsDropdownAll } from '../../service/schoolSubject';
import type { DropdownOption } from '../../types/dropdown';

const CreateQuestionForm: React.FC<Partial<FormQuestionData>> = (props) => {
  const [form, setForm] = useState<FormQuestionData>({
    ...initialFormQuestionState,
    ...props,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [subjectOptions, setSubjectOptions] = useState<DropdownOption[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);
  const formTitle = 'Criar Pergunta';

  React.useEffect(() => {
    setForm(prev => ({
      ...prev,
      ...props
    }));
  }, [props]);

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        const data = await getSchoolSubjectsDropdownAll();
        setSubjectOptions(data);
      } catch (error) {
        console.error('Erro ao carregar matérias', error);
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadSubjects();
  }, []);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setForm(prev => ({ ...prev, [name]: [value] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const { handleSubmit } = useFormQuestionSubmit({ form, setErrors, setLoading });

  return (
    <Box className="form-post-container">
      <Button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 16 }} variant="outlined">
        Voltar
      </Button>
      <Paper elevation={3} className="form-post-paper">
        <Typography variant="h4" component="h2" className="form-post-title">
          {formTitle}
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="form-post-form"
        >
          <TextField
            label="Título da Pergunta"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            select
            label="Matéria"
            name="tags"
            value={form.tags[0] || ''}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.tags}
            helperText={errors.tags}
            disabled={loadingSubjects}
          >
            {loadingSubjects ? (
              <MenuItem disabled>
                <CircularProgress size={20} /> Carregando...
              </MenuItem>
            ) : (
              subjectOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            label="Descrição da Dúvida"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={6}
            error={!!errors.description}
            helperText={errors.description}
          />

          <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} className={`form-post-submit ${loading ? "submitButton" : ""}`}>
            Enviar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateQuestionForm;
