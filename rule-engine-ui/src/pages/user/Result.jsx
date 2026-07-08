import { useLocation, Link } from "react-router-dom";
import "./User.css";

export default function Result() {

  const { state } = useLocation();

  if (!state) {
    return (
      <div className="result-page">
        <h2>No application found.</h2>

        <Link to="/user/dashboard">
          Back
        </Link>
      </div>
    );
  }

  const { approved, rules, data } = state;

  return (

    <div className="result-page">

      {approved ? (

        <div className="success-card">

          <h1>🎉 Loan Approved</h1>

          <p>
            Congratulations <b>{data.name}</b>
          </p>

          <div className="summary">

            <p>✔ Credit Score : {data.creditScore}</p>

            <p>✔ Monthly Income : ₹{data.income}</p>

            <p>✔ Loan Amount : ₹{data.loanAmount}</p>

          </div>

          <Link className="back-btn" to="/user/dashboard">
            Back to Dashboard
          </Link>

        </div>

      ) : (

        <div className="reject-card">

          <h1>Loan Rejected</h1>

          <p>
            Your application does not satisfy the following business rules.
          </p>

          <table>

            <thead>

              <tr>
                <th>Rule</th>
                <th>Your Value</th>
                <th>Required</th>
              </tr>

            </thead>

            <tbody>

              {rules.map((rule, index) => (

                <tr key={index}>

                  <td>{rule.field}</td>

                  <td>{rule.value}</td>

                  <td>{rule.required}</td>

                </tr>

              ))}

            </tbody>

          </table>

          <Link className="back-btn" to="/user/apply">
            Apply Again
          </Link>

        </div>

      )}

    </div>

  );

}