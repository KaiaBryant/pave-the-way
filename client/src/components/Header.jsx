import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
    return (
        <header className="header" id="header">
            <nav className="nav">
                <Link to="/" className="nav_logo">
                    PaveTheWay
                </Link>

                <div className="nav_menu" id="nav-menu">
                    <ul className="nav_list">
                        <li className="nav_item">
                            <Link to="/" className="nav_link">
                                Home
                            </Link>
                        </li>

                        <li className="nav_item dropdown">
                            <Link to="/survey" className="nav_link">
                                Survey
                            </Link>
                        </li>

                        <li className="nav_item">
                            <Link to="/register" className="nav_link">
                                Register
                            </Link>
                        </li>

                        <li className="nav_item">
                            <Link to="/login" className="nav_link">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}