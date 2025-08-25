import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import type { Theme } from '@mui/material/styles';

/**
 * Hook personalizado que converte o tema do Material-UI em variáveis CSS
 * para serem usadas em arquivos SCSS
 */
export const useThemeVariables = () => {
  const theme = useTheme();

  const cssVariables = useMemo(() => ({
    // Cores primárias
    '--primary-main': theme.palette.primary.main,
    '--primary-light': theme.palette.primary.light,
    '--primary-dark': theme.palette.primary.dark,
    '--primary-contrast': theme.palette.primary.contrastText,

    // Cores secundárias
    '--secondary-main': theme.palette.secondary.main,
    '--secondary-light': theme.palette.secondary.light,
    '--secondary-dark': theme.palette.secondary.dark,
    '--secondary-contrast': theme.palette.secondary.contrastText,

    // Cores terciárias (customizada)
    '--tertiary-main': theme.palette.tertiary?.main || '#2B264D',
    '--tertiary-light': theme.palette.tertiary?.light || '#3D3669',
    '--tertiary-dark': theme.palette.tertiary?.dark || '#1F1A3A',
    '--tertiary-contrast': theme.palette.tertiary?.contrastText || '#FFFFFF',

    // Cores de texto
    '--text-primary': theme.palette.text.primary,
    '--text-secondary': theme.palette.text.secondary,
    '--text-disabled': theme.palette.text.disabled,

    // Cores de fundo
    '--background-default': theme.palette.background.default,
    '--background-paper': theme.palette.background.paper,

    // Cores de estado
    '--error-main': theme.palette.error.main,
    '--error-light': theme.palette.error.light,
    '--error-dark': theme.palette.error.dark,
    '--error-contrast': theme.palette.error.contrastText,

    '--warning-main': theme.palette.warning.main,
    '--warning-light': theme.palette.warning.light,
    '--warning-dark': theme.palette.warning.dark,

    '--info-main': theme.palette.info.main,
    '--info-light': theme.palette.info.light,
    '--info-dark': theme.palette.info.dark,

    '--success-main': theme.palette.success.main,
    '--success-light': theme.palette.success.light,
    '--success-dark': theme.palette.success.dark,

    // Outras cores
    '--divider': theme.palette.divider,
    '--action-hover': theme.palette.action?.hover || 'rgba(0, 0, 0, 0.04)',
    '--action-selected': theme.palette.action?.selected || 'rgba(0, 0, 0, 0.08)',
    '--action-disabled': theme.palette.action?.disabled || 'rgba(0, 0, 0, 0.26)',

    // Sombras comuns
    '--shadow-1': '0 2px 4px rgba(0, 0, 0, 0.1)',
    '--shadow-2': '0 4px 8px rgba(0, 0, 0, 0.12)',
    '--shadow-3': '0 8px 16px rgba(0, 0, 0, 0.15)',
    '--shadow-4': '0 12px 24px rgba(0, 0, 0, 0.18)',

    // Raios de borda
    '--border-radius-sm': '4px',
    '--border-radius-md': '8px',
    '--border-radius-lg': '12px',
    '--border-radius-xl': '16px',
    '--border-radius-full': '50%',

    // Espaçamentos (baseado no theme.spacing)
    '--spacing-xs': theme.spacing(0.5), // 4px
    '--spacing-sm': theme.spacing(1),   // 8px
    '--spacing-md': theme.spacing(2),   // 16px
    '--spacing-lg': theme.spacing(3),   // 24px
    '--spacing-xl': theme.spacing(4),   // 32px
    '--spacing-2xl': theme.spacing(6),  // 48px

    // Tamanhos de fonte
    '--font-size-xs': '0.75rem',   // 12px
    '--font-size-sm': '0.875rem',  // 14px
    '--font-size-md': '1rem',      // 16px
    '--font-size-lg': '1.125rem',  // 18px
    '--font-size-xl': '1.25rem',   // 20px
    '--font-size-2xl': '1.5rem',   // 24px

    // Pesos de fonte
    '--font-weight-normal': '400',
    '--font-weight-medium': '500',
    '--font-weight-semibold': '600',
    '--font-weight-bold': '700',

    // Z-indexes
    '--z-dropdown': '1000',
    '--z-sticky': '1020',
    '--z-fixed': '1030',
    '--z-modal-backdrop': '1040',
    '--z-modal': '1050',
    '--z-popover': '1060',
    '--z-tooltip': '1070',
    '--z-toast': '1080',
  }), [theme]);

  return cssVariables;
};

/**
 * Função utilitária para aplicar as variáveis CSS como inline styles
 */
export const applyThemeVariables = (theme: Theme): React.CSSProperties => {
  return {
    '--primary-main': theme.palette.primary.main,
    '--primary-light': theme.palette.primary.light,
    '--primary-dark': theme.palette.primary.dark,
    '--primary-contrast': theme.palette.primary.contrastText,
    '--secondary-main': theme.palette.secondary.main,
    '--secondary-light': theme.palette.secondary.light,
    '--secondary-dark': theme.palette.secondary.dark,
    '--tertiary-main': theme.palette.tertiary?.main || '#2B264D',
    '--tertiary-light': theme.palette.tertiary?.light || '#3D3669',
    '--tertiary-dark': theme.palette.tertiary?.dark || '#1F1A3A',
    '--text-primary': theme.palette.text.primary,
    '--text-secondary': theme.palette.text.secondary,
    '--background-default': theme.palette.background.default,
    '--background-paper': theme.palette.background.paper,
    '--error-main': theme.palette.error.main,
    '--error-light': theme.palette.error.light,
    '--warning-main': theme.palette.warning.main,
    '--success-main': theme.palette.success.main,
    '--divider': theme.palette.divider,
    '--action-hover': theme.palette.action?.hover || 'rgba(0, 0, 0, 0.04)',
  } as React.CSSProperties;
};
