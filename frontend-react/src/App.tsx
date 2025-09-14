import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from './components/Header/Header';
import SearchPost from './components/searchPost/SearchPost'; 
import TypographyShowcase from './pages/styleGuide/TypographyShowcase';
import Home from './pages/home/Home';
import './styles/scss/base/App.scss';
import { theme } from './styles/scss/themes/theme';
import type { User } from './types/header-types';
import "dayjs/locale/pt-br";
import { store } from './store';
import { CreateEditFormPage } from './pages/create_post_form/CreatePostForm';
import LoginPage from './pages/LoginPage';
import { loginSuccess, logout } from './pages/store/userSlice';
import './styles/scss/base/App.scss';
import 'dayjs/locale/pt-br';
import Admin from './pages/Admin';
import SnackBarComponent from './components/Snackbar';

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
            <SnackBarComponent />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create_post" element={<CreateEditFormPage />} />
                <Route path="/edit_post/:id" element={<CreateEditFormPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/styleGuide" element={<TypographyShowcase />} />
                <Route path="/search" element={<SearchPost />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWrapper;
