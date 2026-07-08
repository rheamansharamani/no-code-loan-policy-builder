import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";

export default function ApplyLoan() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    income: "",
    creditScore: "",
    loanAmount: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const rejectedRules = [];

    if (Number(form.creditScore) < 720) {
      rejectedRules.push({
        field: "Credit Score",
        required: "> 720",
        value: form.creditScore
      });
    }

    if (Number(form.income) < 30000) {
      rejectedRules.push({
        field: "Monthly Income",
        required: ">= ₹30,000",
        value: form.income
      });
    }

    navigate("/user/result", {
      state: {
        approved: rejectedRules.length === 0,
        rules: rejectedRules,
        data: form
      }
    });

  };

  return (

    <div className="apply-container">

      <h1>Loan Application</h1>

      <form className="loan-form" onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          onChange={handleChange}
          required
        />

        <input
          name="income"
          type="number"
          placeholder="Monthly Income"
          onChange={handleChange}
          required
        />

        <input
          name="creditScore"
          type="number"
          placeholder="Credit Score"
          onChange={handleChange}
          required
        />

        <input
          name="loanAmount"
          type="number"
          placeholder="Loan Amount"
          onChange={handleChange}
          required
        />

        <button type="submit">
          Check Eligibility
        </button>

      </form>

    </div>

  );

}