import "./Common.css";

export default function Button({
  text,
  onClick,
  type = "button",
  className = ""
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
    >
      {text}
    </button>
  );
}