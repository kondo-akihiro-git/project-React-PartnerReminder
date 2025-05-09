import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import MeetingList from './pages/MeetingList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/meetings" element={<MeetingList />} />
      </Routes>
    </Router>
  );
}

export default App;
