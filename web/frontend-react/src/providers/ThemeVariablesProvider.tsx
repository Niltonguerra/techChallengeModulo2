import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

interface ThemeVariablesProviderProps {
  children: React.ReactNode;
}
export const ThemeVariablesProvider: React.FC<ThemeVariablesProviderProps> = ({ children }) => {
  const theme = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    // Cores primárias
    root.style.setProperty('--primary-main', theme.palette.primary.main);
    root.style.setProperty('--primary-light', theme.palette.primary.light);
    root.style.setProperty('--primary-dark', theme.palette.primary.dark);
    root.style.setProperty('--primary-contrast', theme.palette.primary.contrastText);

    // Cores secundárias
    root.style.setProperty('--secondary-main', theme.palette.secondary.main);
    root.style.setProperty('--secondary-light', theme.palette.secondary.light);
    root.style.setProperty('--secondary-dark', theme.palette.secondary.dark);
    root.style.setProperty('--secondary-contrast', theme.palette.secondary.contrastText);

    // Cores terciárias (customizada)
    root.style.setProperty('--tertiary-main', theme.palette.tertiary?.main || '#2B264D');
    root.style.setProperty('--tertiary-light', theme.palette.tertiary?.light || '#3D3669');
    root.style.setProperty('--tertiary-dark', theme.palette.tertiary?.dark || '#1F1A3A');
    root.style.setProperty('--tertiary-contrast', theme.palette.tertiary?.contrastText || '#FFFFFF');

    // Cores de texto
    root.style.setProperty('--text-primary', theme.palette.text.primary);
    root.style.setProperty('--text-secondary', theme.palette.text.secondary);
    root.style.setProperty('--text-disabled', theme.palette.text.disabled || 'rgba(0, 0, 0, 0.38)');

    // Cores de fundo
    root.style.setProperty('--background-default', theme.palette.background.default);
    root.style.setProperty('--background-paper', theme.palette.background.paper);

    // Cores de estado
    root.style.setProperty('--error-main', theme.palette.error.main);
    root.style.setProperty('--error-light', theme.palette.error.light);
    root.style.setProperty('--error-dark', theme.palette.error.dark);
    root.style.setProperty('--error-contrast', theme.palette.error.contrastText);

    root.style.setProperty('--warning-main', theme.palette.warning.main);
    root.style.setProperty('--warning-light', theme.palette.warning.light);
    root.style.setProperty('--warning-dark', theme.palette.warning.dark);

    root.style.setProperty('--info-main', theme.palette.info.main);
    root.style.setProperty('--info-light', theme.palette.info.light);
    root.style.setProperty('--info-dark', theme.palette.info.dark);

    root.style.setProperty('--success-main', theme.palette.success.main);
    root.style.setProperty('--success-light', theme.palette.success.light);
    root.style.setProperty('--success-dark', theme.palette.success.dark);

    // Outras cores
    root.style.setProperty('--divider', theme.palette.divider || '#e0e0e0');
    root.style.setProperty('--action-hover', theme.palette.action?.hover || 'rgba(0, 0, 0, 0.04)');
    root.style.setProperty('--action-selected', theme.palette.action?.selected || 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty('--action-disabled', theme.palette.action?.disabled || 'rgba(0, 0, 0, 0.26)');

    // Sombras comuns
    root.style.setProperty('--shadow-1', '0 2px 4px rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--shadow-2', '0 4px 8px rgba(0, 0, 0, 0.12)');
    root.style.setProperty('--shadow-3', '0 8px 16px rgba(0, 0, 0, 0.15)');
    root.style.setProperty('--shadow-4', '0 12px 24px rgba(0, 0, 0, 0.18)');

    // Raios de borda
    root.style.setProperty('--border-radius-sm', '4px');
    root.style.setProperty('--border-radius-md', '8px');
    root.style.setProperty('--border-radius-lg', '12px');
    root.style.setProperty('--border-radius-xl', '16px');
    root.style.setProperty('--border-radius-full', '50%');

    // Espaçamentos (baseado no theme.spacing)
    root.style.setProperty('--spacing-xs', theme.spacing(0.5)); // 4px
    root.style.setProperty('--spacing-sm', theme.spacing(1));   // 8px
    root.style.setProperty('--spacing-md', theme.spacing(2));   // 16px
    root.style.setProperty('--spacing-lg', theme.spacing(3));   // 24px
    root.style.setProperty('--spacing-xl', theme.spacing(4));   // 32px
    root.style.setProperty('--spacing-2xl', theme.spacing(6));  // 48px

    // Tamanhos de fonte
    root.style.setProperty('--font-size-xs', '0.75rem');   // 12px
    root.style.setProperty('--font-size-sm', '0.875rem');  // 14px
    root.style.setProperty('--font-size-md', '1rem');      // 16px
    root.style.setProperty('--font-size-lg', '1.125rem');  // 18px
    root.style.setProperty('--font-size-xl', '1.25rem');   // 20px
    root.style.setProperty('--font-size-2xl', '1.5rem');   // 24px

    // Pesos de fonte
    root.style.setProperty('--font-weight-normal', '400');
    root.style.setProperty('--font-weight-medium', '500');
    root.style.setProperty('--font-weight-semibold', '600');
    root.style.setProperty('--font-weight-bold', '700');

    // Z-indexes
    root.style.setProperty('--z-dropdown', '1000');
    root.style.setProperty('--z-sticky', '1020');
    root.style.setProperty('--z-fixed', '1030');
    root.style.setProperty('--z-modal-backdrop', '1040');
    root.style.setProperty('--z-modal', '1050');
    root.style.setProperty('--z-popover', '1060');
    root.style.setProperty('--z-tooltip', '1070');
    root.style.setProperty('--z-toast', '1080');

  }, [theme]);

  return <>{children}</>;
};
