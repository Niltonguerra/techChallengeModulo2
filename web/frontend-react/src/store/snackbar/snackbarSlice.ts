import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SnackbarSeverity = "success" | "error" | "info" | "warning";

export type SnackbarPayload = {
  message: string;
  severity?: SnackbarSeverity;
  autoHideDuration?: number;
};

export type SnackbarState = {
  open: boolean;
  message: string | null;
  severity: SnackbarSeverity;
  autoHideDuration: number;
  key: number | null;
};

const initialState: SnackbarState = {
  open: false,
  message: null,
  severity: "info",
  autoHideDuration: 3000,
  key: null,
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar(state, { payload }: PayloadAction<SnackbarPayload>) {
			state.message = payload.message ?? state.message;
			state.severity = payload.severity ?? state.severity;
			state.autoHideDuration = payload.autoHideDuration ?? state.autoHideDuration;
			state.key = Date.now();
			state.open = true;
    },
    hideSnackbar(state) {
      state.open = false;
    },
    resetSnackbar: () => initialState,
  },
});

export const { showSnackbar, hideSnackbar, resetSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;