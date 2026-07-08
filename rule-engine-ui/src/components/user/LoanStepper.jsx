import "../common/Common.css";

export default function LoanStepper({ step }) {

  const steps = [
    "Personal",
    "Employment",
    "Financial",
    "Review"
  ];

  return (

    <div className="stepper">

      {steps.map((item, index) => (

        <div
          key={index}
          className={
            index <= step
              ? "step active"
              : "step"
          }
        >
          {item}
        </div>

      ))}

    </div>

  );

}