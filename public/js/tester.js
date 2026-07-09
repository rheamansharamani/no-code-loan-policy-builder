// public/js/tester.js
//
// Job of this file: let the user pick a saved rule, fill in a sample
// customer's data (form generated dynamically from LOAN_CONFIG, so it
// automatically matches whatever fields that loan product needs), and
// show Eligible/Rejected with the exact reason via evaluator.js.

import { LOAN_CONFIG } from "./config.js";
import { evaluateRule } from "./evaluator.js";

let activeRule = null;

function renderCustomerForm(rule) {
    const container = document.getElementById("testerForm");
    const fields = LOAN_CONFIG[rule.selectedProduct]?.fields || [];

    container.innerHTML = fields.map((field) => {
        if (field.type === "select") {
            return `
                <div class="field-group">
                    <label>${field.label}</label>
                    <select data-field="${field.id}">
                        ${field.options.map((o) => `<option value="${o}">${o}</option>`).join("")}
                    </select>
                </div>`;
        }
        return `
            <div class="field-group">
                <label>${field.label}</label>
                <input data-field="${field.id}" type="${field.type === "number" ? "number" : "text"}" placeholder="Enter ${field.label}">
            </div>`;
    }).join("");
}

function renderRuleSummary(rule) {
    const el = document.getElementById("testerActiveRule");
    el.innerHTML = `<strong>${rule.ruleName}</strong> <span class="eyebrow">(${rule.selectedProduct})</span>`;
}

window.addEventListener("rule:selected-for-test", (e) => {
    activeRule = e.detail;
    renderRuleSummary(activeRule);
    renderCustomerForm(activeRule);
    document.getElementById("testerResult").innerHTML = "";
});

// Also allow testing the rule currently open in the builder, right after saving
window.addEventListener("rule:ready", (e) => {
    if (!activeRule) {
        activeRule = e.detail;
        renderRuleSummary(activeRule);
        renderCustomerForm(activeRule);
    }
});

document.getElementById("evaluateBtn")?.addEventListener("click", () => {
    const resultEl = document.getElementById("testerResult");

    if (!activeRule) {
        resultEl.innerHTML = `<p class="status-pill error">Load a rule from the Library first.</p>`;
        return;
    }

    const customerData = {};
    document.querySelectorAll("#testerForm [data-field]").forEach((input) => {
        customerData[input.dataset.field] = input.value;
    });

    const result = evaluateRule(activeRule, customerData);

    resultEl.innerHTML = result.eligible
        ? `<p class="status-pill success">✅ Eligible</p>`
        : `<p class="status-pill error">❌ Rejected<br><span style="font-weight:400;">${result.reason}</span></p>`;
});