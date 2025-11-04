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
  const [user, setUser] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    async function fetchAccount() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to fetch: ${res}`);
        const result = await res.json();
        console.log('Checking active session i.e., user logged in:', result);
        if (result.loggedIn) {
          setUser(true);
          const accountRes = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/account`,
            { credentials: 'include' }
          );
          const accountData = await accountRes.json();
          console.log('User data fetched:', accountData);
          setUserData(accountData);
        }
      } catch (err) {
        console.log('Failed to fetch account validation:', err);
      }
    }

    fetchAccount();
  }, []);

  return (
    <BrowserRouter>
      <Header user={user || false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/survey"
          element={<Survey user={user || false} userData={userData} />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login user={user || false} setUser={setUser} />}
        />
        <Route path="/result" element={<Result />} />
        <Route
          path="/account"
          element={
            <Account
              user={user || false}
              setUser={setUser}
              userData={userData}
            />
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
