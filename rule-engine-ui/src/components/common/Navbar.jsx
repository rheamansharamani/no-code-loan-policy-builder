import { Link } from "react-router-dom";
import "./Common.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        RuleEngine
      </div>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/admin/dashboard">
          Admin
        </Link>

        <Link to="/user/dashboard">
          Apply Loan
        </Link>

      </div>

    </nav>
  );
}