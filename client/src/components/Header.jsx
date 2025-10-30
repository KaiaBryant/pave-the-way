import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "/src/assets/ptw.png";
import hamburger from "/src/assets/hamburger.svg";
import "../styles/Header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  return (
    <header className="nav_header">
      {/* Hamburger button (mobile only) */}
      <button
        className={`open-sidebar ${isOpen ? "hidden" : ""}`}
        aria-label="open-sidebar"
        onClick={toggleMenu}
      >
        <img className="hamburger" src={hamburger} alt="menu" />
      </button>

      {/* Navigation links */}
      <nav className={`nav-bar ${isOpen ? "show" : ""}`}>
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

        {/* Account dropdown */}
        <div
          className="nav_account"
          onMouseEnter={() => setAccountOpen(true)}
          onMouseLeave={() => setAccountOpen(false)}
        >
          <button
            className="nav_link account_button"
            onClick={() => setAccountOpen(!accountOpen)}
          >
            Account
          </button>

          {/* Desktop hover OR mobile toggle */}
          {accountOpen && (
            <ul className="dropdown_menu">
              <li>
                <Link to="/register" onClick={handleLinkClick}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  Log In
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
