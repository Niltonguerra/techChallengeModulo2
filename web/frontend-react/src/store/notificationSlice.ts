import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotificationItem } from '../types/questionView';



type NotificationState = {
  unreadCount: number;
  items: NotificationItem[];
};

const initialState: NotificationState = {
  unreadCount: 0,
  items: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },


    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
      state.unreadCount = action.payload.length;
    },

    clearUnread(state) {
      state.unreadCount = 0;
    },

    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        n => n.questionId !== action.payload,
      );
      state.unreadCount = state.items.length;
    },
  },
});

export const {
  addNotification,
  clearUnread,
  setNotifications,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
