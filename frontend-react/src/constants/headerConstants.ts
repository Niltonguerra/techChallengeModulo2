import React from 'react';
import {
  MenuBook,
  Calculate,
  HistoryEdu,
  Public,
  Science,
  Psychology,
  Biotech,
  Language,
  Palette,
  Person,
  Settings,
} from '@mui/icons-material';
import type { NavigationItem, UserMenuItem } from '../types/header';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Português', icon: React.createElement(MenuBook), path: '/portugues' },
  { label: 'Matemática', icon: React.createElement(Calculate), path: '/matematica' },
  { label: 'História', icon: React.createElement(HistoryEdu), path: '/historia' },
  { label: 'Geografia', icon: React.createElement(Public), path: '/geografia' },
  { label: 'Biologia', icon: React.createElement(Biotech), path: '/biologia' },
  { label: 'Física', icon: React.createElement(Science), path: '/fisica' },
  { label: 'Química', icon: React.createElement(Psychology), path: '/quimica' },
  { label: 'Inglês', icon: React.createElement(Language), path: '/ingles' },
  { label: 'Artes', icon: React.createElement(Palette), path: '/artes' },
];


export const createUserMenuItems = (onProfileClick: () => void, onSettingsClick: () => void): UserMenuItem[] => [
  { 
    label: 'Meu Perfil', 
    icon: React.createElement(Person), 
    action: onProfileClick 
  },
  { 
    label: 'Configurações', 
    icon: React.createElement(Settings), 
    action: onSettingsClick 
  },
];


export const MENU_CONFIG = {
  navigation: {
    menuId: 'navigation-menu',
    buttonId: 'navigation-button',
  },
  user: {
    menuId: 'user-menu',
    buttonId: 'user-button',
  },
} as const;


export const DEFAULT_USER = {
  name: 'Usuário',
  email: 'usuario@educafacil.com',
  avatar: undefined,
} as const;

export const HEADER_TEXTS = {
  logoText: 'Educa Fácil',
  logoAlt: 'Logo Educa Fácil',
  navigationButton: 'Matérias',
  searchButton: 'Buscar',
  loginButton: 'Entrar',
  logoutButton: 'Sair',
} as const;
