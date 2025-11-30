import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'; // Import único
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
  Alert,
  Paper,
} from '@mui/material';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      await axios.post(`${apiUrl}/auth-password/forgot-password`, { email });
      setMessage(
        'Se o e-mail estiver cadastrado, enviamos um link de recuperação.'
      );
      setEmail('');
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          const errorData = err.response.data as { message: string };
          setError(errorData.message || 'Erro ao processar a solicitação.');
        } else if (err.request) {
          setError('Sem conexão com o servidor. Verifique sua internet.');
        } else {
          setError('Erro ao enviar a requisição.');
        }
      } else {
        setError('Ocorreu um erro interno no aplicativo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 3,
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
          Recuperar Senha
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Informe seu e-mail cadastrado para receber o link de redefinição.
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Digite seu e-mail"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            fullWidth
            disabled={loading}
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

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Enviar'
            )}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link
              component={RouterLink}
              to="/"
              underline="hover"
              color="primary"
            >
              Voltar para o Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordForm;
