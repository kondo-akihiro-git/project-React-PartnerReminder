import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import MeetingList from './pages/MeetingList';
import { ChakraProvider,defaultSystem  } from '@chakra-ui/react'


function App() {
  return (
    <ChakraProvider value={defaultSystem}>
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/meetings" element={<MeetingList />} />
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

export default App;
