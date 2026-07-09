import { useState, useEffect } from "react";
import "./Admin.css";
import { LOAN_CONFIG, fieldLabel } from "../../config/loanConfig";
import { generateRuleFromPrompt } from "../../services/aiApi";

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

  const productOptions = Object.keys(LOAN_CONFIG);
  const [selectedProduct, setSelectedProduct] = useState(productOptions[0]);
  const [mode, setMode] = useState('manual'); // 'manual' or 'ai'

  // Manual rule form state uses fieldId (from loan config)
  const defaultFieldId = LOAN_CONFIG[selectedProduct].fields[0].id;
  const [newRule, setNewRule] = useState({
    fieldId: defaultFieldId,
    operator: ">",
    value: "",
  });

  useEffect(() => {
    // when product changes, reset manual form field
    setNewRule((prev) => ({ ...prev, fieldId: LOAN_CONFIG[selectedProduct].fields[0].id, value: "" }));
  }, [selectedProduct]);

  const handleAddRule = () => {

    if (!newRule.value) return;

    const label = fieldLabel(selectedProduct, newRule.fieldId);

    setRules([...rules, {
      field: label,
      operator: newRule.operator,
      value: newRule.value,
    }]);

    setNewRule({
      fieldId: LOAN_CONFIG[selectedProduct].fields[0].id,
      operator: ">",
      value: "",
    });
  };

  const handleDelete = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  // --- AI Rule Generator: real call to the Express backend ---
  const [aiProduct, setAiProduct] = useState(productOptions[0]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiStatus, setAiStatus] = useState(null); // { source, explanation, count }

  useEffect(() => {
    // keep AI product in sync with selectedProduct when switching modes
    setAiProduct(selectedProduct);
  }, [selectedProduct]);

  const handleGenerate = async () => {
    setAiError("");
    setAiStatus(null);

    if (!aiPrompt.trim()) {
      setAiError('Describe the rule first, e.g. "approve if income is above 40000 and CIBIL above 700".');
      return;
    }

    setAiLoading(true);
    try {
      const result = await generateRuleFromPrompt(
        `For ${aiProduct}: ${aiPrompt.trim()}`
      );

      const generatedConditions = (result.rule?.conditions || []).map((condition) => ({
        field: fieldLabel(result.rule.selectedProduct || aiProduct, condition.fieldId),
        operator: condition.operator,
        value: condition.value,
      }));

      setRules((prev) => [...prev, ...generatedConditions]);
      setAiStatus({
        source: result.source,
        explanation: result.explanation,
        count: generatedConditions.length,
      });
      setAiPrompt("");
    } catch (err) {
      setAiError(err.message || "Could not generate a rule. Is the backend running on port 3000?");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Business Rule Builder</h1>
          <p>Create configurable loan eligibility rules.</p>
        </div>
      </div>

      <div className="product-mode-row">
        <label>Product</label>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          {productOptions.map((product) => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>

        <div className="mode-toggle">
          <button className={mode==='manual'? 'active' : ''} onClick={() => setMode('manual')}>Manual Entry</button>
          <button className={mode==='ai'? 'active' : ''} onClick={() => setMode('ai')}>AI Builder</button>
        </div>
      </div>

      {mode === 'ai' && (
        <div className="ai-panel">
          <h3>AI Rule Generator</h3>
          <p className="ai-panel-sub">Describe the rule in plain English — this calls the real backend, not a mock.</p>

          <div className="ai-panel-row">
            <select value={aiProduct} onChange={(e) => setAiProduct(e.target.value)}>
              {productOptions.map((product) => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>

            <input
              placeholder='e.g. "approve if income is above 40000 and CIBIL above 700"'
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />

            <button onClick={handleGenerate} disabled={aiLoading}>
              {aiLoading ? "Generating…" : "Generate with AI"}
            </button>
          </div>

          {aiError && <p className="ai-panel-error">{aiError}</p>}
          {aiStatus && (
            <p className="ai-panel-status">
              Added {aiStatus.count} condition(s) via {aiStatus.source === "groq" ? "Groq" : "fallback heuristics"}.
              {aiStatus.explanation ? ` ${aiStatus.explanation}` : ""}
            </p>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="rule-form">

          <label>Field</label>
          <select
            value={newRule.fieldId}
            onChange={(e) =>
              setNewRule({
                ...newRule,
                fieldId: e.target.value,
              })
            }
          >
            {LOAN_CONFIG[selectedProduct].fields.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>

          <label>Condition</label>
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

          <label>Value</label>
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
      )}

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
