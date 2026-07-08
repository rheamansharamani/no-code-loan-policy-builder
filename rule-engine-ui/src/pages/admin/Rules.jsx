import { useState } from "react";
import "./Admin.css";

export default function Rules() {

  const [rules, setRules] = useState([
    {
      field: "Credit Score",
      operator: ">",
      value: 720,
    },
    {
      field: "Monthly Income",
      operator: ">=",
      value: 30000,
    },
    {
      field: "Age",
      operator: "Between",
      value: "21 - 60",
    },
  ]);

  const [newRule, setNewRule] = useState({
    field: "Credit Score",
    operator: ">",
    value: "",
  });

  const handleAddRule = () => {

    if (!newRule.value) return;

    setRules([...rules, newRule]);

    setNewRule({
      field: "Credit Score",
      operator: ">",
      value: "",
    });
  };

  const handleDelete = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Business Rule Builder</h1>
          <p>Create configurable loan eligibility rules.</p>
        </div>
      </div>

      <div className="rule-form">

        <select
          value={newRule.field}
          onChange={(e) =>
            setNewRule({
              ...newRule,
              field: e.target.value,
            })
          }
        >
          <option>Credit Score</option>
          <option>Monthly Income</option>
          <option>Age</option>
          <option>Employment Type</option>
          <option>Loan Amount</option>
        </select>

        <select
          value={newRule.operator}
          onChange={(e) =>
            setNewRule({
              ...newRule,
              operator: e.target.value,
            })
          }
        >
          <option>{">"}</option>
          <option>{"<"}</option>
          <option>{">="}</option>
          <option>{"<="}</option>
          <option>Between</option>
          <option>Equals</option>
        </select>

        <input
          placeholder="Enter Value"
          value={newRule.value}
          onChange={(e) =>
            setNewRule({
              ...newRule,
              value: e.target.value,
            })
          }
        />

        <button onClick={handleAddRule}>
          Add Rule
        </button>

      </div>

      <div className="rules-table">

        <table>

          <thead>

            <tr>
              <th>Field</th>
              <th>Condition</th>
              <th>Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {rules.map((rule, index) => (

              <tr key={index}>

                <td>{rule.field}</td>

                <td>{rule.operator}</td>

                <td>{rule.value}</td>

                <td>
                  <span className="active-status">
                    Active
                  </span>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}