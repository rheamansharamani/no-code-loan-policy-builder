import { useState } from "react";
import Button from "../common/Button";

export default function RuleForm({ onAdd }) {

  const [rule, setRule] = useState({
    field: "Credit Score",
    operator: ">",
    value: ""
  });

  const submit = () => {

    if (!rule.value) return;

    onAdd(rule);

    setRule({
      field: "Credit Score",
      operator: ">",
      value: ""
    });

  };

  return (

    <div className="rule-form">

      <select
        value={rule.field}
        onChange={(e) =>
          setRule({
            ...rule,
            field: e.target.value
          })
        }
      >
        <option>Credit Score</option>
        <option>Monthly Income</option>
        <option>Age</option>
      </select>

      <select
        value={rule.operator}
        onChange={(e) =>
          setRule({
            ...rule,
            operator: e.target.value
          })
        }
      >
        <option>{">"}</option>
        <option>{"<"}</option>
        <option>{">="}</option>
        <option>{"<="}</option>
      </select>

      <input
        placeholder="Value"
        value={rule.value}
        onChange={(e) =>
          setRule({
            ...rule,
            value: e.target.value
          })
        }
      />

      <Button
        text="Add Rule"
        onClick={submit}
      />

    </div>

  );

}