import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authenticateUser,
  getStoredAuthSession,
  saveAuthSession,
} from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredAuthSession();

    if (storedUser) {
      navigate(
        storedUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
        { replace: true }
      );
    }
  }, [navigate]);

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    const user = authenticateUser(email, password, role);

    if (!user) {
      setError("Invalid email, password, or selected role.");
      return;
    }

    saveAuthSession(user);

    const targetPath =
      user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

    navigate(targetPath, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="overlay">
          <h1>Smart Loan Rule Engine</h1>

          <p>
            AI-powered configurable lending platform that enables business teams
            to create loan eligibility rules without developer intervention.
          </p>

          <div className="features">
            <div>✔ Instant Loan Decisions</div>
            <div>✔ Configurable Rule Engine</div>
            <div>✔ AI Rule Generator</div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p>Please login to continue</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="user">Loan Applicant</option>
            <option value="admin">Administrator</option>
          </select>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}