export interface User {
  name: string;
  email: string;
  photo: string;
  id: string;
}

export interface UserDataReceived {
  name: string;
  email: string;
  photo: string;
  id: string;
  permission: string;
}

export interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface UserMenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface HeaderProps {
  isLoggedIn?: boolean;
  user: User | null;
  onLogout?: () => void;
  onLogin?: (userData: User, token: string) => void;
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
}
