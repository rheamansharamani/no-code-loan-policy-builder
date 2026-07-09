// public/js/evaluator.js
//
// Job of this file: given a saved rule (from builder.js's rule:ready payload)
// and a customer's input values, decide Eligible / Rejected + the exact reason.
//
// This deliberately matches the rule shape builder.js already produces:
//   { id, selectedProduct, ruleName, conditions: [{ id, fieldId, operator, value }] }
// No new data model introduced — this plugs into what already exists.

import { LOAN_CONFIG } from "./config.js";

function coerce(fieldType, raw) {
    if (fieldType === "number") {
        const n = Number(raw);
        return Number.isNaN(n) ? null : n;
    }
    return String(raw ?? "").trim();
}

function compare(operator, actual, expected) {
    switch (operator) {
        case ">=": return actual >= expected;
        case "<=": return actual <= expected;
        case ">": return actual > expected;
        case "<": return actual < expected;
        case "=": return String(actual).toLowerCase() === String(expected).toLowerCase();
        default: return false;
    }
}

function fieldLabel(product, fieldId) {
    const field = (LOAN_CONFIG[product]?.fields || []).find((f) => f.id === fieldId);
    return field ? field.label : fieldId;
}

/**
 * Evaluates a customer's data against a saved rule.
 * @param {object} rule - shape produced by builder.js buildRulePayload()
 * @param {object} customerData - { [fieldId]: value }
 * @returns {{ eligible: boolean, failedCondition: object|null, reason: string|null, checks: object[] }}
 */
export function evaluateRule(rule, customerData) {
    const product = rule.selectedProduct;
    const fields = LOAN_CONFIG[product]?.fields || [];
    const checks = [];

    for (const condition of rule.conditions) {
        const field = fields.find((f) => f.id === condition.fieldId);
        const fieldType = field ? field.type : "text";

        const actual = coerce(fieldType === "select" ? "text" : fieldType, customerData[condition.fieldId]);
        const expected = coerce(fieldType === "select" ? "text" : fieldType, condition.value);

        const passed = actual !== null && compare(condition.operator, actual, expected);

        checks.push({ fieldId: condition.fieldId, label: fieldLabel(product, condition.fieldId), passed, actual, expected, operator: condition.operator });

        if (!passed) {
            return {
                eligible: false,
                failedCondition: condition,
                reason: `${fieldLabel(product, condition.fieldId)} should be ${condition.operator} ${condition.value}. Provided: ${customerData[condition.fieldId] ?? "—"}`,
                checks,
            };
        }
    }

    return { eligible: true, failedCondition: null, reason: null, checks };
}