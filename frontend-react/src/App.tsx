import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
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
import { store, type RootState } from './store';
import { CreateEditFormPage } from './pages/createPostForm/CreatePostForm';
import LoginPage from './pages/LoginPage';

import './styles/scss/base/App.scss';
import 'dayjs/locale/pt-br';
import Admin from './pages/Admin';
import SnackBarComponent from './components/Snackbar';
import { loginSuccess, logout } from './store/userSlice';

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
                <Route path="/admin">
                  <Route path="post">
                    <Route path="create" element={<CreateEditFormPage />} />
                    <Route path="edit/:id" element={<CreateEditFormPage />} />
                  </Route>
                  <Route index element={<Admin />} />
                </Route>
                <Route path="/styleGuide" element={<TypographyShowcase />} />
                <Route path="/search" element={<SearchPost />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
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
