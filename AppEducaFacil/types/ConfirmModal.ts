export interface ConfirmOptions {
  message: string;
  TextButton1?: string;
  TextButton2?: string;
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}