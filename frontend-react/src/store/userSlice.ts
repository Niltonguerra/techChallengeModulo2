import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '../types/header-types';

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      sessionStorage.setItem('token', action.payload.token);
    },

    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
