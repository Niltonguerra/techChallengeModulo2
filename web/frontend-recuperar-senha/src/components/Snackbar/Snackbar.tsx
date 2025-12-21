import * as React from "react";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "../../store/snackbar/useSnackbar";

export default function GlobalComponent() {
  const { closeSnackbar, isOpen, message, severity, autoHideDuration, key } = useSnackbar();

  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    closeSnackbar();
  };

  return (
    <Snackbar
      key={key ?? undefined}
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
