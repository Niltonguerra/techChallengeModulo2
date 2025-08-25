import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

/**
 * Hook específico para variáveis CSS do Header
 * Mantém apenas as variáveis essenciais para o componente
 */
export const useHeaderThemeVariables = () => {
  const theme = useTheme();

  const headerVariables = useMemo(() => ({
    // Cores essenciais para o Header
    '--primary-main': theme.palette.primary.main,
    '--primary-dark': theme.palette.primary.dark,
    '--primary-contrast': theme.palette.primary.contrastText,
    '--text-primary': theme.palette.text.primary,
    '--text-secondary': theme.palette.text.secondary,
    '--background-paper': theme.palette.background.paper,
    '--error-main': theme.palette.error.main,
    '--error-light': theme.palette.error.light,
    '--divider': theme.palette.divider || '#e0e0e0',
    '--action-hover': theme.palette.action?.hover || 'rgba(0, 0, 0, 0.04)',
  }), [theme]);

  return headerVariables;
};
