import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import MeetingList from './pages/MeetingList';
import MeetingDetail from './pages/MeetingDetail';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import GoodPointsList from './pages/GoodPointsList';
import { JSX } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { decryptUserId } from './utils/crypto';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from './components/LoadingIndicator';

const theme = createTheme();

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
};

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const encryptedToken = localStorage.getItem('user_token');
      if (!encryptedToken) {
        navigate('/login');
        return;
      }

      const userId = decryptUserId(encryptedToken);
      if (!userId) {
        localStorage.removeItem('user_token');
        navigate('/login');
        return;
      }

      try {
        await axios.get(`http://localhost:8000/verify-user/${userId}`);
        setIsChecking(false); // OK
      } catch {
        localStorage.removeItem('user_token');
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  if (isChecking) {
    return <LoadingIndicator />;
  }

  return element;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/meetings" element={<PrivateRoute element={<MeetingList />} />} />
          <Route path="/meetings/:meetingId" element={<PrivateRoute element={<MeetingDetail />} />} />
          <Route path="/goodpoints" element={<PrivateRoute element={<GoodPointsList />} />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
