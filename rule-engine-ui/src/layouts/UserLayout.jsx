import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "./Layout.css";

export default function UserLayout() {
  return (
    <div className="user-layout">

      <Navbar />

      <main className="user-content">
        <Outlet />
      </main>

    </div>
  );
}