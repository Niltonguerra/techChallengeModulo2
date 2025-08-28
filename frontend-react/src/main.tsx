import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import './styles/scss/main.scss';
import { theme } from './styles/scss/themes/theme';
import { ThemeVariablesProvider } from './providers/ThemeVariablesProvider';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ThemeVariablesProvider>
        <App />
      </ThemeVariablesProvider>
    </ThemeProvider>
  </StrictMode>
);
