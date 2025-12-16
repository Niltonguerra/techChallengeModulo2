export interface SnackbarProps {
  message: string;
}

export interface SnackbarOptions {
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
}