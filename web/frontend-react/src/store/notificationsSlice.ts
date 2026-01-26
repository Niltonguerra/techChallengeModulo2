import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuestionNotification } from '../types/conversation';

interface NotificationsState {
  items: QuestionNotification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<QuestionNotification>) {
      // Procura se já existe notificação para a mesma questão
      const existing = state.items.find(n => n.questionId === action.payload.questionId);

      if (existing) {
        // Atualiza a notificação existente com os novos dados
        existing.title = action.payload.title;
        existing.read = false; // sempre marca como nova
        existing.senderPhoto = action.payload.senderPhoto;
        existing.senderId = action.payload.senderId;
      } else {
        // Se não existe, adiciona no início da lista
        state.items.unshift(action.payload);
      }
    },

    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },

    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
