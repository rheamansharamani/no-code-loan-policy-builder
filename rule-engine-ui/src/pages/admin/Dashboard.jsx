import { Link } from "react-router-dom";
import "./Admin.css";

export default function Dashboard() {
  const stats = [
    {
      title: "Active Rules",
      value: 12,
      color: "#0D4B87",
    },
    {
      title: "Applications Today",
      value: 148,
      color: "#FF6B35",
    },
    {
      title: "Approved",
      value: 112,
      color: "#28A745",
    },
    {
      title: "Rejected",
      value: 36,
      color: "#DC3545",
    },
  ];

  const recentRules = [
    "Credit Score > 720",
    "Monthly Income ≥ ₹30,000",
    "Age between 21 - 60",
    "Employment = Salaried",
    "Loan Amount ≤ ₹15 Lakhs",
  ];

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage lending rules and monitor loan approvals.</p>
        </div>

        <Link to="/admin/rules" className="primary-btn">
          + Create Rule
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <h2 style={{ color: item.color }}>{item.value}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h3>Recent Business Rules</h3>

          <ul>
            {recentRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>

          <Link to="/admin/rules" className="secondary-btn">
            View All Rules
          </Link>

        </div>

        <div className="dashboard-card">

          <h3>System Overview</h3>

          <p>
            Business teams can configure loan eligibility rules without
            engineering support.
          </p>

          <div className="overview-box">
            ✔ Rule Engine Active
          </div>

          <div className="overview-box">
            ✔ AI Rule Generator Connected
          </div>

          <div className="overview-box">
            ✔ Decision Engine Running
          </div>

        </div>

      </div>

    </div>
  );
}