import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from './components/Header/Header';
import SearchPost from './components/searchPost/SearchPost';
import TypographyShowcase from './pages/styleGuide/TypographyShowcase';
import './styles/scss/base/App.scss';
import { theme } from './styles/scss/themes/theme';
import type { User } from './types/header-types';
import 'dayjs/locale/pt-br';
import { store, type RootState } from './store';
import { CreateEditPostFormPage } from './pages/createPostForm/CreatePostForm';
import LoginPage from './pages/Login/LoginPage';
import 'dayjs/locale/pt-br';
import Admin from './pages/Admin/Admin';
import SnackBarComponent from './components/Snackbar/Snackbar';
import { loginSuccess, logout } from './store/userSlice';
import { CreateEditUserFormPage } from './pages/createUserForm/CreateUserForm';
import Home from './pages/home/Home';
import ResetPassword from './pages/resetPassword/ResetPassword';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordForm';
import { DropdownPlayground } from './pages/temp-componet/DropdownPlayground';
import { CreateQuestionPageForm } from './pages/createQuestionForm/CreateQuestionForm';
import Question from './pages/Question/Question';
import ConversationPage from './pages/Conversation/ConversationPage';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleLogin = (userData: User, token: string) => {
    dispatch(loginSuccess({ user: userData, token }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="app">
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      <SnackBarComponent />
      <main className="main-content">
        <Routes>
          <Route path="/create-question" element={<CreateQuestionPageForm />} />
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/question" element={<Question />} />
          <Route path="/questions/:questionId/chat" element={<ConversationPage />} />
          <Route path="/admin">
            <Route path="post">
              <Route path="create" element={<CreateEditPostFormPage />} />
              <Route path="edit/:id" element={<CreateEditPostFormPage />} />
            </Route>
            <Route index element={<Admin />} />
          </Route>
          <Route path="aluno">
            <Route
              path="create/:permission"
              element={<CreateEditUserFormPage />}
            />
          </Route>
          <Route path="professor">
            <Route
              path="create/:permission"
              element={<CreateEditUserFormPage />}
            />
          </Route>
          <Route path="/styleGuide" element={<TypographyShowcase />} />
          <Route path="/search" element={<SearchPost />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          {/* TODO: PAGINA SOMENTE DE TESTE DEPOIS DELETAR */}
          <Route path="/playground/dropdown" element={<DropdownPlayground />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const AppWrapper = () => (
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  </Provider>
);

export default AppWrapper;
