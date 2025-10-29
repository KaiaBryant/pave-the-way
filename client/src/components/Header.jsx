import { Link } from "react-router-dom";
import Logo from "/src/assets/ptw.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <nav className="nav_list">
        <div className="nav_left">
          <Link to="/" className="nav_link">
            Home
          </Link>
        </div>

        <div className="nav_center">
          <img src={Logo} alt="Pave Train Logo" className="nav_logo" />
        </div>

        <div className="nav_right">
          <Link to="/survey" className="nav_link">
            Survey
          </Link>
          <Link to="/contact" className="nav_link">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
