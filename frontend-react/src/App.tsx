import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>(undefined);

  const handleLogin = (userData: User) => {
    setIsLoggedIn(true);

    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(undefined);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
            onLogin={() => handleLogin({} as User)}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/styleGuide" element={<TypographyShowcase />} />
              <Route path="/search" element={<SearchPost />} />
              <Route
                path="/login"
                element={<LoginPage onLogin={handleLogin} />}
              />
            </Routes>
          </main>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
