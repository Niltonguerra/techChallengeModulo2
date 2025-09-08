import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import SearchPost from './components/SearchPost';
import TypographyShowcase from './components/TypographyShowcase';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import { store, type RootState } from './pages/store';
import { loginSuccess, logout } from './pages/store/userSlice';
import './styles/scss/base/App.scss';
import { theme } from './styles/scss/themes/theme';
import type { User } from './types/header-types';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);

  const handleLogin = (userData: User, token: string) => {
    dispatch(loginSuccess({ user: userData, token }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/styleGuide" element={<TypographyShowcase />} />
              <Route path="/search" element={<SearchPost />} />
              <Route
                path="/login"
                element={
                  <LoginPage
                    onLogin={(userData, token) => handleLogin(userData, token)}
                  />
                }
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWrapper;
