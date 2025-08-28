import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './pages/store';
import Home from './pages/Home';
import SearchPost from './components/SearchPost'; //<< temporary
import Header from './components/Header/Header';
import { theme } from './styles/scss/themes/theme';
import './styles/scss/base/App.scss'; // Importar estilos globais
import TypographyShowcase from './components/TypographyShowcase';
import type { User } from './types/header-types';

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
                <Route path="/styleGuide" element={<TypographyShowcase />} />
                <Route path="/search" element={<SearchPost />} />
              </Routes>
            </main>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
