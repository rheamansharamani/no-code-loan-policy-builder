import { Link, useNavigate } from "react-router-dom";
import { clearStoredAuthSession } from "../../services/api";
import "./Common.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    clearStoredAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <aside className="sidebar">
      <h2>Dashboard</h2>

      <Link to="/admin/dashboard">Dashboard</Link>

      <Link to="/admin/rules">Rule Builder</Link>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}