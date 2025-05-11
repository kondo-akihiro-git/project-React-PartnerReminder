import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import MeetingList from './pages/MeetingList';
import MeetingDetail from './pages/MeetingDetail';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/meetings" element={<MeetingList />} />
          <Route path="/meetings/:meetingId" element={<MeetingDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
