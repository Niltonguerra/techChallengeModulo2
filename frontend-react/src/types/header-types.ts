export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
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
  onLogin?: () => void;
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
}
