import "../common/Common.css";

export default function EligibilityCard({
  title,
  value
}) {

  return (

    <div className="eligibility-card">

      <h2>{value}</h2>

      <p>{title}</p>

    </div>

  );

}