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
import './styles/scss/base/App.scss';
import { theme } from './styles/scss/themes/theme';
import 'dayjs/locale/pt-br';
import { store, type RootState } from './store';
import 'dayjs/locale/pt-br';
import SnackBarComponent from './components/Snackbar/Snackbar';
import { logout } from './store/userSlice';
import ResetPassword from './pages/resetPassword/ResetPassword';


function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      <SnackBarComponent />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ResetPassword />} />
        </Routes>
      </main>
      <Footer />
    </>
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
