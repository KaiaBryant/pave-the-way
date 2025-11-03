import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Contact from './pages/Contact';
import Result from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    async function fetchAccount() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/account`,
          {
            credentials: 'include',
          }
        );

        const result = await res.json();
        if (result.loggedIn) setIsLoggedIn(true);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchAccount();
  }, []);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} isLoggedIn={isLoggedIn} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/register"
          element={<Register />}
          isLoggedIn={isLoggedIn}
        />
        <Route path="/login" element={<Login />} isLoggedIn={isLoggedIn} />
        <Route path="/result" element={<Result />} isLoggedIn={isLoggedIn} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
