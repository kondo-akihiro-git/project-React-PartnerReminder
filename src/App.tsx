import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import MeetingList from './pages/MeetingList';
import MeetingDetail from './pages/MeetingDetail';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import GoodPointsList from './pages/GoodPointsList';
import { JSX } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
const theme = createTheme();
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('user_id');
  return isAuthenticated ? element : <Login />;
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
