import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from './components/Header/Header';
import './styles/scss/base/App.scss';
import { theme } from './styles/scss/themes/theme';

import SnackBarComponent from './components/Snackbar/Snackbar';
import { CreateEditUserFormPage } from './pages/createUserForm/CreateUserForm';
import { Provider } from 'react-redux';
import { store } from './store';



function App() {
  return (
    <>
      <Header
        isLoggedIn={false}
        user={null}
      />
      <SnackBarComponent />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CreateEditUserFormPage/>} />
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
