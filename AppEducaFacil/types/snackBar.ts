export interface SnackbarProps {
  message: string;
}

export interface SnackbarOptions {
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  top?: boolean; // display the snackbar at the top of the screen instead of at the bottom
  noHeader?: boolean; // if theres no header, add some additional space to compensate
}

export interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
}