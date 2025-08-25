import { createTheme } from '@mui/material/styles';

// Extend the theme to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

// Definir o tema principal com createTheme (oficial do MUI)
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4953B8', // Azul primário
      light: '#6B73E6',
      dark: '#373E8C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F57005', // Laranja secundário
      light: '#FF9833',
      dark: '#C75A00',
      contrastText: '#FFFFFF',
    },
    // Cores customizadas adicionais
    tertiary: {
      main: '#2B264D',
      light: '#3D3669',
      dark: '#1F1A3A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F3F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
  },
  typography: {
    fontFamily: 'Inter, Montserrat, sans-serif',
    h1: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: 1.2,
      color: '#0F172A',
    },
    h2: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: 1.2,
      color: '#0F172A',
    },
    h3: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: 1.3,
      color: '#0F172A',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: 1.4,
      color: '#0F172A',
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#334155',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 1.5,
      color: '#64748B',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '16px',
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  components: {
    // Customizações de componentes
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Utilitários customizados para casos específicos
export const customStyles = {
  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #4953B8 0%, #6B73E6 100%)',
    secondary: 'linear-gradient(135deg, #F57005 0%, #FF9833 100%)',
    tertiary: 'linear-gradient(135deg, #2B264D 0%, #3D3669 100%)',
  },
  
  // Estilos para estatísticas
  statBox: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '28px',
    color: '#4953B8',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(73, 83, 184, 0.05)',
    border: '1px solid rgba(73, 83, 184, 0.1)',
    textAlign: 'center' as const,
  },
  
  // Estilos para tags
  techChip: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    backgroundColor: 'rgba(73, 83, 184, 0.1)',
    color: '#4953B8',
    borderRadius: '6px',
    padding: '4px 8px',
    margin: '2px',
    display: 'inline-block',
  },

  // Estilos para cards com sombra
  cardShadow: {
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    '&:hover': {
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-2px)',
      transition: 'all 0.3s ease-in-out',
    },
  },

  // Estilos para gradiente primário
  primaryGradient: {
    background: 'linear-gradient(135deg, #4953B8 0%, #6B73E6 100%)',
    color: '#FFFFFF',
    '&:hover': {
      background: 'linear-gradient(135deg, #373E8C 0%, #4953B8 100%)',
    },
  },
};

// Hook para usar estilos customizados
export const useCustomStyles = () => customStyles;

export default theme;
