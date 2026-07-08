import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import "./Layout.css";

export default function AdminLayout() {
  return (
    <div className="layout">

      <Sidebar />

      <div className="layout-content">

        <Navbar />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}