import { useState, useEffect, useRef } from 'react';
import { Button, Stack, Typography, CircularProgress, Avatar } from '@mui/material';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../store';
import { addNotification, markAsRead } from '../../store/notificationsSlice';
import { nanoid } from '@reduxjs/toolkit';

interface QuestionUpdatePayload {
  questionId: string;
  title: string;
  senderRole: string;
  senderName?: string;
  senderPhoto?: string;
  senderId: string;
}

export default function SocketTest() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);
  const token = useAppSelector((state) => state.user.token);

  const questionId = '5c444c83-53e5-4840-b1c1-46c76721e811';// '5c444c83-53e5-4840-b1c1-46c76721e811';
  const notifications = useAppSelector((state) => state.notifications.items);

  // Mantém a mesma instância do socket
  const socketRef = useRef<Socket | null>(null);

  // Conexão com socket
  useEffect(() => {
    if (!user) return;

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000', {
        query: { userId: user.id },
        autoConnect: true,
      });
    }

    const socket = socketRef.current;

    // Recebe notificações de atualização de questão
    socket.on('question:update', (data: QuestionUpdatePayload) => {
      // ❌ Ignora notificações enviadas pelo próprio usuário
      if (data.senderId !== user.id) {
        dispatch(
          addNotification({
            id: nanoid(),
            questionId: data.questionId,
            title: `Nova resposta de ${data.senderName || 'alguém'}: ${data.title}`,
            read: false,
            senderPhoto: data.senderPhoto,
            senderId: data.senderId,
          })
        );
      }
    });

    // ⚡ Ao conectar, buscar notificações pendentes (offline)
    socket.on('connect', async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/question/${questionId}/pending-notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const pending: QuestionUpdatePayload[] = response.data || [];
        pending.forEach((data) => {
          if (data.senderId !== user.id) {
            dispatch(
              addNotification({
                id: nanoid(),
                questionId: data.questionId,
                title: `Nova resposta de ${data.senderName || 'alguém'}: ${data.title}`,
                read: false,
                senderPhoto: data.senderPhoto,
                senderId: data.senderId,
              })
            );
          }
        });
      } catch (err) {
        console.error('Erro ao buscar notificações pendentes:', err);
      }
    });

    return () => {
      socket.off('question:update');
      socket.disconnect(); // Fecha conexão ao desmontar
    };
  }, [dispatch, user, token, questionId]);

  // Envia mensagem
  const handleSendMessage = async () => {
    if (!token || !user) return;

    setLoading(true);
    try {
      const message = 'Mensagem de teste enviada pelo playground 222222';

      const response = await axios.post(
        `http://localhost:3000/question/${questionId}/messages`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Mensagem criada:', response.data);
      // Backend notificará apenas destinatário(s)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marca notificação como lida e question view como visto
  const handleClickNotification = async (questionId: string, notificationId: string) => {
    try {
      // 1️⃣ Marca visualizada no backend
      await axios.post(
        `http://localhost:3000/question/${questionId}/view`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Marca como lida no Redux (para atualizar a UI)
      dispatch(markAsRead(notificationId));

      // 3️⃣ Opcional: navegar para a questão
      // navigate(`/question?id=${questionId}`);
    } catch (err) {
      console.error('Erro ao marcar notificação como visualizada', err);
    }
  };


  return (
    <Stack spacing={3} sx={{ padding: 4 }}>
      <Typography variant="h5">Playground – Teste de Notificações</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        disabled={loading || !user}
      >
        {loading ? <CircularProgress size={24} /> : 'Disparar mensagem'}
      </Button>

      <Typography variant="body2" color="text.secondary">
        Clique no botão e veja a notificação chegar ao destinatário real via WebSocket.
      </Typography>

      {/* Lista de notificações */}
      <Stack spacing={1} mt={2}>
        {notifications.map((n) => (
          <Stack
            key={n.id}
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={() => handleClickNotification(n.questionId, n.id)}
            sx={{ cursor: 'pointer' }}
          >
            {n.senderPhoto && <Avatar src={n.senderPhoto} sx={{ width: 24, height: 24 }} />}
            <Typography variant="body2">{n.title}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
