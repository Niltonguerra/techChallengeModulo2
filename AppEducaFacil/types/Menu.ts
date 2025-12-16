export interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface MenuLink {
  label: string;
  pathname: string;
  params?: Record<string, any>; // O '?' indica que é opcional
}
