import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import posts from './post/postSlice';
import snackbar from './snackbar/snackbarSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';
export const store = configureStore({
  reducer: { posts, snackbar, user: userReducer, notification: notificationReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
