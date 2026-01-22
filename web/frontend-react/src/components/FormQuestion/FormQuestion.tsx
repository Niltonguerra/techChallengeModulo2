import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { FormQuestionData } from '../../types/form-post';
import './FormQuestion.scss';
import { initialFormQuestionState, schoolSubjects } from '../../constants/formConstants';
import { useFormQuestionSubmit } from '../../hooks/useFormQuestionSubmit';

const CreateQuestionForm: React.FC<Partial<FormQuestionData>> = (props) => {
  const [form, setForm] = useState<FormQuestionData>({
    ...initialFormQuestionState,
    ...props,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const formTitle = 'Criar Pergunta';

  React.useEffect(() => {
    setForm(prev => ({
      ...prev,
      ...props
    }));
  }, [props]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
            value={form.tags}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.tags}
            helperText={errors.tags}
          >
            {schoolSubjects.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
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
