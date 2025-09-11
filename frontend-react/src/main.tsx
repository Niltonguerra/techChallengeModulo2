import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeVariablesProvider } from './providers/ThemeVariablesProvider';
import './styles/scss/main.scss';
import './pages/LoginPage';
import { theme } from './styles/scss/themes/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ThemeVariablesProvider>
        <App />
      </ThemeVariablesProvider>
    </ThemeProvider>
  </StrictMode>
);
