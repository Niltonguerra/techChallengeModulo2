import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Header from './components/Header/Header';
import SearchPost from './components/SearchPost'; //<< temporary
import TypographyShowcase from './components/TypographyShowcase';
import Home from './pages/Home';
import { store } from './pages/store';
import './styles/scss/base/App.scss'; // Importar estilos globais
import { theme } from './styles/scss/themes/theme';
import type { User } from './types/header-types';

import "dayjs/locale/pt-br";
import Admin from "./pages/Admin";

function App() {
  //isso vai ser removido, é só um mock substituto enquanto o sistema de autenticação não fica pronto
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      avatar: '/api/placeholder/40/40',
      role: 'Estudante'
    });
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(undefined);
  };
  //o mock termina nessa linha

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Header
              isLoggedIn={isLoggedIn}
              user={user}
              onLogout={handleLogout}
              onLogin={handleLogin}
            />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} /> 
                <Route path="/styleGuide" element={<TypographyShowcase />} />
                <Route path="/search" element={<SearchPost />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
