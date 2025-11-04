import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '/src/assets/ptw.png';
import hamburger from '/src/assets/menu.png';
import '../styles/Header.css';

export default function Header({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  return (
    <header className="nav_header">
      {/* Hamburger button (mobile only) */}
      <button
        className={`open-sidebar ${isOpen ? 'hidden' : ''}`}
        aria-label="open-sidebar"
        onClick={toggleMenu}
      >
        <img className="hamburger" src={hamburger} alt="menu" />
      </button>

      {/* Navigation links */}
      <nav className={`nav-bar ${isOpen ? 'show' : ''}`}>
        <div className="nav_center mobile_logo_container">
          <img src={Logo} alt="Pave Train Logo" className="nav_logo" />
        </div>

        <div className="nav_left">
          <Link to="/" className="nav_link" onClick={handleLinkClick}>
            Home
          </Link>
          <Link to="/survey" className="nav_link" onClick={handleLinkClick}>
            Survey
          </Link>
        </div>

        <div className="nav_right">
          <Link to="/register" className="nav_link" onClick={handleLinkClick}>
            Register
          </Link>
          <button id="signin-button">
            <Link
              to={user ? '/account' : '/login'}
              className="nav_link"
              onClick={() => {
                console.log('User state:', user); // Check if this is still showing true
                handleLinkClick();
              }}
            >
              Account
            </Link>
          </button>
        </div>
      </nav>
    </header>
  );
}
