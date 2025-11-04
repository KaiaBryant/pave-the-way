import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login({ user, setUser, setUserData }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!password.trim() || !email.trim()) {
      return setError('Please enter a valid email and password');
    } else if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address');
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Allow cookies to be stored
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('User logged in:', data);
      if (!res.ok) throw new Error(data.error || 'Login failed');
      // Saves the user from server response
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      const accountRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/account`,
        { credentials: 'include' }
      );
      const accountData = await accountRes.json();
      setUserData(accountData);

      setUser(true);
      // Redirect to account
      navigate('/account');
    } catch (err) {
      setError('Log in Failed: Try Again');
    }
  };

  return (
    <div className="main-container justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4 input-field"
          aria-label="Email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4 input-field"
          aria-label="Password"
        />

        {error && <p className="text-danger">{error}</p>}

        <button
          type="submit"
          className="btn btn-lg btn-dark btn-primary transition d-block mx-auto"
        >
          Login
        </button>
      </form>
    </div>
  );
}
