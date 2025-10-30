import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Contact from './pages/Contact';

import Dummy from './pages/dummyResults';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dummypage" element={<Dummy />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
