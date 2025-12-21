import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeVariablesProvider } from './providers/ThemeVariablesProvider';
import './styles/scss/main.scss';
import './pages/Login/LoginPage';
import { theme } from './styles/scss/themes/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ThemeVariablesProvider>
          <App />
        </ThemeVariablesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
