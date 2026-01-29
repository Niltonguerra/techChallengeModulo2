import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { QuestionNotification } from '../types/conversation';

interface NotificationsState {
  items: QuestionNotification[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<QuestionNotification>) {
      const notification: QuestionNotification = {
        ...action.payload,
        id: action.payload.id ?? nanoid(),
        read: action.payload.read ?? false,
      };

      const existingIndex = state.items.findIndex(
        n => n.questionId === notification.questionId
      );

      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
      }

      state.items.unshift(notification);
    },

    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },

    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
