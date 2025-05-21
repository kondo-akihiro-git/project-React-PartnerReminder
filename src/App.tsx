import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserTop from './pages/user/UserTop';
import MeetingList from './pages/meeting/MeetingList';
import MeetingDetail from './pages/meeting/MeetingDetail';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import GoodPointsList from './pages/meeting/GoodPointsList';
import { JSX } from 'react';
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from './components/LoadingIndicator';
import UserSetting from './pages/user/UserSetting';

const theme = createTheme();

// ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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
      try {
        // CookieにセットされたJWTをサーバーが読むため、axiosはwithCredentials:trueにする
        await axios.get(`${BASE_URL}/me`, { withCredentials: true });
        setIsChecking(false); // 認証成功
      } catch {
        navigate("/login");
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
          <Route path="/" element={<UserTop />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/meetings" element={<PrivateRoute element={<MeetingList />} />} />
          <Route path="/meetings/:meetingId" element={<PrivateRoute element={<MeetingDetail />} />} />
          <Route path="/goodpoints" element={<PrivateRoute element={<GoodPointsList />} />} />
          <Route path="/usersetting" element={<PrivateRoute element={<UserSetting />} />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
