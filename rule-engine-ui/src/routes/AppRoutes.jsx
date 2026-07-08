import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";

import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import Rules from "../pages/admin/Rules";

import UserDashboard from "../pages/user/Dashboard";
import ApplyLoan from "../pages/user/ApplyLoan";
import Result from "../pages/user/Result";

import { getStoredAuthSession } from "../services/api";

function ProtectedRoute({ children, allowedRole }) {
  const authUser = getStoredAuthSession();

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  if (authUser.role !== allowedRole) {
    return (
      <Navigate
        to={authUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="rules" element={<Rules />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="apply" element={<ApplyLoan />} />
          <Route path="result" element={<Result />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}