import { Link } from "react-router-dom";
import "./Common.css";

export default function Sidebar() {

  return (

    <aside className="sidebar">

      <h2>Dashboard</h2>

      <Link to="/admin/dashboard">
        Dashboard
      </Link>

      <Link to="/admin/rules">
        Rule Builder
      </Link>

      <Link to="/">
        Logout
      </Link>

    </aside>

  );

}