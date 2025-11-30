import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Alert,
  Avatar,
  CssBaseline,
  Button,
  CircularProgress,
} from '@mui/material';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

type MessageState = {
  text: string;
  type: 'error' | 'success';
} | null;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<MessageState>(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage({ text: 'Token inválido ou ausente.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/auth-password/reset-password`,
        {
          token,
          newPassword,
          confirmPassword,
        }
      );

      setMessage({ text: response.data.message, type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || 'Erro ao redefinir senha.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockResetOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h3">
            Redefinir Senha
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: '100%' }}
          >
            {message && (
              <Alert
                severity={message.type}
                sx={{ width: '100%', mb: 2 }}
                onClose={() => setMessage(null)}
              >
                {message.text}
              </Alert>
            )}

            <TextField
              label="Nova senha"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              autoFocus
              disabled={loading || message?.type === 'success'}
            />
            <TextField
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              disabled={loading || message?.type === 'success'}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={loading || message?.type === 'success'}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',

                height: '52.5px',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Redefinir Senha'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
