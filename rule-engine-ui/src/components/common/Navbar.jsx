import { Link, useNavigate } from "react-router-dom";
import { clearStoredAuthSession } from "../../services/api";
import "./Common.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    clearStoredAuthSession();
    navigate('/', { replace: true });
  };

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

        <button className="nav-logout" onClick={handleLogout}>Logout</button>

      </div>

    </nav>
  );
}
