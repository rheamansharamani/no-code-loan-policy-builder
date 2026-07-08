import "../common/Common.css";

export default function RuleCard({
  field,
  operator,
  value
}) {

  return (

    <div className="rule-card">

      <h4>{field}</h4>

      <p>

        {field} {operator} {value}

      </p>

    </div>

  );

}