import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../../types/header-types';

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

interface LoginFormProps {
  onLogin: (userData: User, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: email,
        password: senha,
      });
      const userData: User = response.data.user;
      const token: string = response.data.token;
      onLogin(userData, token);
      navigate('/');
    } catch (err) {
      setError('Utilizador ou senha inválidos. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
      >
        Login
      </Typography>

      <TextField
        label="Digite aqui o seu usuário"
        variant="outlined"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F6F6F6',

            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.4)',
            },

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <TextField
        label="Digite aqui a sua senha"
        variant="outlined"
        type="password"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F6F6F6',

            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.4)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={loading}
        fullWidth
        sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
      </Button>
    </Box>
  );
};

export default LoginForm;
