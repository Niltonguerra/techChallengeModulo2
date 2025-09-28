import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { FormUserData } from '../../types/form-post';
import ImageUpload from '../ImageUpload/ImageUpload';
import './FormUser.scss';
import { initialFormUserState } from '../../constants/formConstants';
import { useFormUserSubmit } from '../../hooks/useFormUserSubmit';

const CreateUserForm = (props:{ permission: string }) => {
  const { permission } = props;
  const [form, setForm] = useState<FormUserData>({...initialFormUserState,});
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formTitle = 'Criar Professor';

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImage = React.useCallback((file: File | null) => setForm(prev => ({ ...prev, photo: file })), []);
  const { handleSubmit } = useFormUserSubmit({ form, permission, setErrors, setLoading });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
          <ImageUpload
            image={form.photo}
            onChange={handleImage}
            preview={imagePreview}
            setPreview={setImagePreview}
            error={errors.photo}
          />
          <TextField
            label="Nome"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} className={`form-post-submit ${loading ? "submitButton" : ""}`}>
            Enviar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateUserForm;
