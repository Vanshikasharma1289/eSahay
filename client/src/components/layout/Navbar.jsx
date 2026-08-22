import { Link } from "react-router";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        eSahay
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>

      <Link to="/register" className="nav-cta">
        Get Started
      </Link>
    </header>
  );
}

export default Navbar;