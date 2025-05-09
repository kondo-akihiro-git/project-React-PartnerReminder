import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import MeetingList from './pages/MeetingList';
import { ChakraProvider,defaultSystem  } from '@chakra-ui/react'
import MeetingDetail from './pages/MeetingDetail';


function App() {
  return (
    <ChakraProvider value={defaultSystem}>
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/meetings" element={<MeetingList />} />
        <Route path="/meetings/:meetingId" element={<MeetingDetail />} />
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

export default App;
