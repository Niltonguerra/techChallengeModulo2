import React, { useState, useCallback, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import DynamicFieldsInput from '../../components/FormPost/DynamicFieldsInput';
import './CreateUserForm.scss';

interface SocialMidia {
  key: string;
  value: string;
}

interface CreateUserFormData {
  name: string;
  password: string;
  photo: string;
  email: string;
  social_midia: Record<string, string>;
}

const getInitialSocialMidia = (social_midia?: Record<string, string>) =>
  social_midia && Object.keys(social_midia).length > 0
    ? Object.entries(social_midia).map(([key, value]) => ({ key, value }))
    : [{ key: '', value: '' }];

const CreateUserForm: React.FC<Partial<CreateUserFormData>> = (props) => {
  const [form, setForm] = useState<CreateUserFormData>({
    name: props.name ?? '',
    password: props.password ?? '',
    photo: props.photo ?? '',
    email: props.email ?? '',
    social_midia: props.social_midia ?? {},
  });

  const [socialMidia, setSocialMidia] = useState<SocialMidia[]>(getInitialSocialMidia(props.social_midia));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      ...props,
    }));
    setSocialMidia(getInitialSocialMidia(props.social_midia));
  }, [props]);

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      social_midia: socialMidia.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>),
    }));
  }, [socialMidia]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialMidiaChange = useCallback((newLinks: SocialMidia[]) => setSocialMidia(newLinks), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar validação e chamada de API
    // Exemplo: console.log(form);
    if (!form.name) setErrors(err => ({ ...err, name: 'Nome obrigatório' }));
    if (!form.email) setErrors(err => ({ ...err, email: 'Email obrigatório' }));
    if (!form.password) setErrors(err => ({ ...err, password: 'Senha obrigatória' }));
    // ...
    // Se tudo ok, enviar form
    // console.log(form);
  };

  return (
    <Box className="form-user-container">
      <Paper elevation={3} className="form-user-paper">
        <Typography variant="h4" component="h2" className="form-user-title">
          Criar Usuário
        </Typography>
        <form onSubmit={handleSubmit} className="form-user-form">
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
            label="Email"
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
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Foto (URL)"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            fullWidth
            error={!!errors.photo}
            helperText={errors.photo}
          />
          <Typography variant="subtitle1" className="form-user-label">Redes Sociais</Typography>
          <DynamicFieldsInput
            items={socialMidia}
            onChange={handleSocialMidiaChange}
            keyLabel="Nome da rede (ex: instagram, linkedin)"
            valueLabel="URL"
            addButtonLabel="Adicionar rede social"
            keyPlaceholder="instagram, linkedin, twitter..."
            valuePlaceholder="https://..."
            error={errors.social_midia}
          />
          <Button type="submit" variant="contained" color="primary" size="large" className="form-user-submit">
            Criar usuário
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateUserForm;
