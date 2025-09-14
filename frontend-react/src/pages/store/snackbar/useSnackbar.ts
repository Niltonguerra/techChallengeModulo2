import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../index";
import {
  showSnackbar as showAction,
  hideSnackbar as hideAction,
  type SnackbarPayload,
} from "./snackbarSlice";

export function useSnackbar() {
  const dispatch = useAppDispatch();
  const { open, message, severity, autoHideDuration, key } = useAppSelector(
    (s) => s.snackbar
  );

  const showSnackbar = useCallback((p: SnackbarPayload) => dispatch(showAction(p)), [dispatch]);
  const closeSnackbar = useCallback(() => dispatch(hideAction()), [dispatch]);

  return useMemo(
    () => ({
      // state
      isOpen: open,
      message,
      severity,
      autoHideDuration,
      key,
      // functions
      showSnackbar,
      closeSnackbar
    }),
    [open, message, severity, autoHideDuration, key, showSnackbar, closeSnackbar]
  );
}
