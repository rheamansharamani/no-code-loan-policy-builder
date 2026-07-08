import { Link } from "react-router-dom";
import "./User.css";

export default function Dashboard() {
  return (
    <div className="user-dashboard">

      <section className="hero">

        <div className="hero-left">

          <h1>Instant Personal Loan</h1>

          <p>
            Get loan approval in seconds using our AI-powered Rule Engine.
            Transparent eligibility checks with configurable business rules.
          </p>

          <Link className="apply-btn" to="/user/apply">
            Apply Now
          </Link>

        </div>

        <div className="hero-right">

          <div className="loan-card">

            <h3>Quick Loan Benefits</h3>

            <ul>
              <li>✔ Instant Eligibility Check</li>
              <li>✔ AI Powered Decisions</li>
              <li>✔ Paperless Application</li>
              <li>✔ Approval in Seconds</li>
            </ul>

          </div>

        </div>

      </section>

      <section className="feature-grid">

        <div className="feature-card">
          <h2>₹15 Lakhs</h2>
          <p>Maximum Loan Amount</p>
        </div>

        <div className="feature-card">
          <h2>11.25%</h2>
          <p>Interest Starts From</p>
        </div>

        <div className="feature-card">
          <h2>30 sec</h2>
          <p>Approval Time</p>
        </div>

      </section>

    </div>
  );
}