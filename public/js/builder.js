import { LOAN_CONFIG, OPERATORS } from "./config.js";
import { generateRuleFromPrompt } from "./ai.js";

const state = {
    id: "",
    selectedProduct: "",
    ruleName: "",
    conditions: [],
    mode: "manual",
    aiDraft: null
};

const dom = {
    productSelect: document.getElementById("productSelect"),
    ruleNameInput: document.getElementById("ruleName"),
    conditionsContainer: document.getElementById("conditionsContainer"),
    addConditionBtn: document.getElementById("addConditionBtn"),
    aiPrompt: document.getElementById("aiPrompt"),
    generateRuleBtn: document.getElementById("generateRuleBtn"),
    generationStatus: document.getElementById("generationStatus"),
    aiPreview: document.getElementById("aiPreview"),
    aiAssistantPanel: document.getElementById("aiAssistantPanel"),
    aiReviewActions: document.getElementById("aiReviewActions"),
    aiReviewHint: document.getElementById("aiReviewHint"),
    applyAiRuleBtn: document.getElementById("applyAiRuleBtn"),
    discardAiRuleBtn: document.getElementById("discardAiRuleBtn"),
    saveRuleBtn: document.getElementById("saveRuleBtn"),
    jsonPreview: document.getElementById("jsonPreview"),
    validationSummary: document.getElementById("validationSummary"),
    modeManual: document.getElementById("modeManual"),
    modeAI: document.getElementById("modeAI")
};

function init() {
    populateProducts();
    bindEvents();
    restoreSavedRule();
    renderConditions();
    renderValidation();
    updateJSONPreview();
    applyMode(state.mode);
}

function populateProducts() {
    const products = Object.keys(LOAN_CONFIG);
    products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product;
        option.textContent = product;
        dom.productSelect.appendChild(option);
    });
}

function bindEvents() {
    dom.productSelect.addEventListener("change", handleProductChange);
    dom.ruleNameInput.addEventListener("input", handleRuleNameInput);
    dom.addConditionBtn.addEventListener("click", addCondition);
    dom.generateRuleBtn.addEventListener("click", handleGenerateRule);
    dom.saveRuleBtn.addEventListener("click", handleSaveRule);
    if (dom.applyAiRuleBtn) {
        dom.applyAiRuleBtn.addEventListener("click", applyPendingAiRule);
    }
    if (dom.discardAiRuleBtn) {
        dom.discardAiRuleBtn.addEventListener("click", discardPendingAiRule);
    }
    dom.conditionsContainer.addEventListener("change", handleConditionChange);
    dom.conditionsContainer.addEventListener("input", handleConditionValueChange);
    dom.conditionsContainer.addEventListener("click", handleConditionActions);
    dom.modeManual.addEventListener("click",()=>applyMode('manual'));
    dom.modeAI.addEventListener("click",()=>applyMode('ai'));
}

function getCurrentFields() {
    if (!state.selectedProduct) {
        return [];
    }

    return LOAN_CONFIG[state.selectedProduct].fields;
}

function getFieldById(fieldId) {
    return getCurrentFields().find((field) => field.id === fieldId) || null;
}

function isEmptyValue(value) {
    return value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "");
}

function normalizeOperator(operator) {
    const normalized = String(operator || "").trim().toLowerCase();
    const mapping = {
        ">=": ">=",
        ">": ">",
        "<=": "<=",
        "<": "<",
        "=": "=",
        "equals": "=",
        "equal": "=",
        "greaterthan": ">=",
        "greater than": ">=",
        "gt": ">=",
        "lessthan": "<=",
        "less than": "<=",
        "lt": "<="
    };

    return mapping[normalized] || ">=";
}

function resolveFieldId(product, rawFieldId, rawFieldName) {
    const fields = product && LOAN_CONFIG[product] ? LOAN_CONFIG[product].fields : Object.values(LOAN_CONFIG)[0].fields;

    if (rawFieldId && fields.some((field) => field.id === rawFieldId)) {
        return rawFieldId;
    }

    const normalizedFieldName = String(rawFieldName || "").toLowerCase();
    const directField = fields.find((field) => field.id.toLowerCase() === normalizedFieldName);
    if (directField) {
        return directField.id;
    }

    const labelField = fields.find((field) => field.label.toLowerCase() === normalizedFieldName);
    if (labelField) {
        return labelField.id;
    }

    const aliasMap = {
        age: "applicant_age",
        applicantage: "applicant_age",
        income: "monthly_income",
        monthlyincome: "monthly_income",
        cibil: "cibil_score",
        cibilscore: "cibil_score",
        employment: "employment_type",
        employmenttype: "employment_type",
        salary: "employment_type",
        salaried: "employment_type",
        selfemployed: "employment_type",
        business: "employment_type",
        loanamount: "loan_amount",
        experience: "years_experience",
        country: "country"
    };

    const alias = aliasMap[normalizedFieldName.replace(/\s+/g, "")];
    if (alias && fields.some(f=>f.id===alias)) return alias;

    return fields[0]?.id || "";
}

function normalizeCondition(condition, product) {
    const fields = product && LOAN_CONFIG[product] ? LOAN_CONFIG[product].fields : getCurrentFields();
    const resolvedFieldId = resolveFieldId(product, condition.fieldId || condition.field || condition.fieldName, condition.fieldName || condition.field || condition.label);
    const matchedField = fields.find((candidate) => candidate.id === resolvedFieldId) || null;

    return {
        id: condition.id || crypto.randomUUID(),
        fieldId: resolvedFieldId,
        operator: normalizeOperator(condition.operator),
        value: matchedField && matchedField.type === "number" ? String(condition.value ?? "") : condition.value ?? ""
    };
}

function createCondition(fieldId = null) {
    const fields = getCurrentFields();
    const fallbackFieldId = fieldId || fields[0]?.id || "";

    return {
        id: crypto.randomUUID(),
        fieldId: fallbackFieldId,
        operator: ">=",
        value: ""
    };
}

function remapConditionsToProduct(oldProduct, newProduct) {
    if (!state.conditions.length) return;

    state.conditions = state.conditions.map(cond => normalizeCondition(cond, newProduct));
}

function addCondition() {
    const fields = getCurrentFields();

    if (fields.length === 0) {
        setStatus("Please select a loan product before adding conditions.", "error");
        return;
    }

    state.conditions.push(createCondition(fields[0].id));
    renderConditions();
    renderValidation();
    updateJSONPreview();
}

function renderConditions() {
    dom.conditionsContainer.innerHTML = "";

    if (!state.selectedProduct) {
        dom.conditionsContainer.innerHTML = `
            <div class="empty-state">
                <p>Select a loan product to start building your rule.</p>
            </div>
        `;
        return;
    }

    if (state.conditions.length === 0) {
        dom.conditionsContainer.innerHTML = `
            <div class="empty-state">
                <p>No conditions yet. Add one to define your eligibility rules.</p>
            </div>
        `;
        return;
    }

    state.conditions.forEach((condition, index) => {
        const field = getFieldById(condition.fieldId);
        const card = document.createElement("div");
        card.className = "condition-card";
        card.innerHTML = `
            <div class="condition-header">
                <h3>Condition ${index + 1}</h3>
                <button type="button" class="delete-btn" data-action="delete" data-id="${condition.id}">Remove</button>
            </div>
            <div class="condition-grid">
                <div>
                    <label for="field-${condition.id}">Field</label>
                    <select id="field-${condition.id}" class="condition-field" data-id="${condition.id}">
                        ${getCurrentFields().map((fieldOption) => `
                            <option value="${fieldOption.id}" ${fieldOption.id === condition.fieldId ? "selected" : ""}>${fieldOption.label}</option>
                        `).join("")}
                    </select>
                </div>
                <div>
                    <label for="operator-${condition.id}">Operator</label>
                    <select id="operator-${condition.id}" class="condition-operator" data-id="${condition.id}">
                        ${OPERATORS.map((operator) => `
                            <option value="${operator}" ${operator === condition.operator ? "selected" : ""}>${operator}</option>
                        `).join("")}
                    </select>
                </div>
                <div>
                    <label for="value-${condition.id}">Value</label>
                    ${renderValueInput(condition, field)}
                </div>
            </div>
        `;
        dom.conditionsContainer.appendChild(card);
    });
}

function renderValueInput(condition, field) {
    if (!field) {
        return `<input class="condition-value" data-id="${condition.id}" type="text" value="${condition.value}" placeholder="Enter value">`;
    }

    if (field.type === "select") {
        return `
            <select id="value-${condition.id}" class="condition-value" data-id="${condition.id}">
                ${field.options.map((option) => `
                    <option value="${option}" ${option === condition.value ? "selected" : ""}>${option}</option>
                `).join("")}
            </select>
        `;
    }

    return `
        <input
            id="value-${condition.id}"
            class="condition-value"
            data-id="${condition.id}"
            type="${field.type}"
            value="${condition.value}"
            placeholder="Enter value"
        >
    `;
}

function handleProductChange(event) {
    const prev = state.selectedProduct;
    state.selectedProduct = event.target.value;

    if (prev && state.selectedProduct && prev !== state.selectedProduct) {
        remapConditionsToProduct(prev, state.selectedProduct);
    }

    if (!state.conditions.length && state.selectedProduct) {
        state.conditions.push(createCondition(getCurrentFields()[0]?.id));
    }

    dom.productSelect.value = state.selectedProduct;
    renderConditions();
    renderValidation();
    updateJSONPreview();
}

function handleRuleNameInput(event) {
    state.ruleName = event.target.value;
    renderValidation();
    updateJSONPreview();
}

function handleConditionChange(event) {
    const target = event.target;

    if (target.classList.contains("condition-field")) {
        const condition = findConditionById(target.dataset.id);
        if (!condition) {
            return;
        }

        condition.fieldId = target.value;
        condition.value = "";
        renderConditions();
        updateJSONPreview();
        return;
    }

    if (target.classList.contains("condition-operator")) {
        const condition = findConditionById(target.dataset.id);
        if (condition) {
            condition.operator = target.value;
            updateJSONPreview();
        }
    }
}

function handleConditionValueChange(event) {
    const target = event.target;

    if (!target.classList.contains("condition-value")) {
        return;
    }

    const condition = findConditionById(target.dataset.id);
    if (condition) {
        condition.value = target.value;
        updateJSONPreview();
        renderValidation();
    }
}

function handleConditionActions(event) {
    const target = event.target;
    if (!target.matches("[data-action='delete']")) {
        return;
    }

    state.conditions = state.conditions.filter((condition) => condition.id !== target.dataset.id);
    renderConditions();
    renderValidation();
    updateJSONPreview();
}

function findConditionById(conditionId) {
    return state.conditions.find((condition) => condition.id === conditionId) || null;
}

function validateState() {
    const errors = [];

    if (!state.selectedProduct) {
        errors.push("Select a loan product to continue.");
    }

    if (!state.ruleName.trim()) {
        errors.push("Provide a rule name.");
    }

    if (state.conditions.length === 0) {
        errors.push("At least one condition is required.");
        return { isValid: false, errors };
    }

    state.conditions.forEach((condition, index) => {
        if (!condition.fieldId) {
            errors.push(`Condition ${index + 1} is missing a field.`);
            return;
        }

        const field = getFieldById(condition.fieldId);
        if (!field) {
            errors.push(`Condition ${index + 1} references an invalid field.`);
            return;
        }

        if (!condition.operator) {
            errors.push(`Condition ${index + 1} is missing an operator.`);
        }

        if (field.type === "number") {
            if (isEmptyValue(condition.value)) {
                errors.push(`Condition ${index + 1} needs a value.`);
            } else if (Number.isNaN(Number(condition.value))) {
                errors.push(`Condition ${index + 1} requires a numeric value.`);
            }
        } else if (isEmptyValue(condition.value)) {
            errors.push(`Condition ${index + 1} needs a value.`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

function renderValidation() {
    const validation = validateState();

    if (!dom.validationSummary) {
        return;
    }

    if (validation.isValid) {
        dom.validationSummary.innerHTML = `
            <div class="status-card success">
                <strong>Rule is ready.</strong>
                <span>All required metadata is present and the structure is valid.</span>
            </div>
        `;
        return;
    }

    dom.validationSummary.innerHTML = `
        <div class="status-card error">
            <strong>Please fix the following issues:</strong>
            <ul>
                ${validation.errors.map((error) => `<li>${error}</li>`).join("")}
            </ul>
        </div>
    `;
}

function buildRulePayload() {
    return {
        id: state.id || crypto.randomUUID(),
        selectedProduct: state.selectedProduct,
        ruleName: state.ruleName.trim(),
        conditions: state.conditions.map((condition) => ({
            id: condition.id,
            fieldId: condition.fieldId,
            operator: condition.operator,
            value: condition.value
        }))
    };
}

function applyMode(mode){
    state.mode = mode;
    const isAiMode = mode === 'ai';

    dom.modeAI.classList.toggle('btn-primary', isAiMode);
    dom.modeManual.classList.toggle('btn-primary', !isAiMode);

    if (dom.aiAssistantPanel) {
        dom.aiAssistantPanel.style.display = isAiMode ? 'block' : 'none';
    }

    if (dom.aiReviewHint) {
        dom.aiReviewHint.textContent = isAiMode
            ? 'AI can suggest a starting rule, but you should review it manually before applying it.'
            : 'Manual mode is active. Build rules yourself and use AI only as a draft.';
    }

    if (!isAiMode) {
        hideAiReviewActions();
    }
}

function hideAiReviewActions() {
    if (dom.aiReviewActions) {
        dom.aiReviewActions.hidden = true;
    }
}

function showAiDraft(payload, explanation = '', source = 'ai') {
    state.aiDraft = payload;
    dom.aiPreview.innerHTML = `
        <div class="preview-card">
            <h3>AI Draft Ready</h3>
            <p>${explanation || 'The AI draft is ready. Review it carefully before applying it.'}</p>
            <p class="muted">Source: ${source}</p>
        </div>
    `;
    if (dom.aiReviewActions) {
        dom.aiReviewActions.hidden = false;
    }
}

function discardPendingAiRule() {
    state.aiDraft = null;
    hideAiReviewActions();
    if (dom.aiPreview) {
        dom.aiPreview.innerHTML = '<div class="preview-card"><h3>AI Draft</h3><p>No draft is active right now.</p></div>';
    }
    setStatus('AI draft discarded. You can keep building manually.', 'warning');
}

function applyPendingAiRule() {
    if (!state.aiDraft) {
        setStatus('There is no AI draft to apply yet.', 'warning');
        return;
    }

    applyGeneratedRule(state.aiDraft);
    state.aiDraft = null;
    hideAiReviewActions();
    setStatus('AI draft applied to the builder. Review and save it before sharing.', 'warning');
}

function handleSaveRule() {
    const validation = validateState();

    if (!validation.isValid) {
        renderValidation();
        setStatus("Fix validation issues before saving the rule.", "error");
        return;
    }

    const rule = buildRulePayload();
    state.id = rule.id;
    localStorage.setItem("loan-rule-builder-latest", JSON.stringify(rule));
    window.dispatchEvent(new CustomEvent("rule:ready", { detail: rule }));
    updateJSONPreview();
    setStatus("Rule captured successfully and ready for integration.", "success");
}

async function handleGenerateRule() {
    const prompt = dom.aiPrompt.value.trim();

    if (!prompt) {
        setStatus("Describe the rule you want to generate before using AI.", "error");
        return;
    }

    setStatus("Contacting AI service...", "loading");

    (async () => {
        const result = await generateRuleFromPrompt(prompt);

        if (!result || result.success === false) {
            const fallback = await generateRuleFromPrompt(prompt, { forceFallback: true });
            if (fallback && fallback.rule) {
                showAiDraft(fallback.rule, fallback.explanation || 'Fallback draft generated. Review it carefully before applying it.', fallback.source || 'fallback');
                setStatus("AI draft ready. Review it before applying.", "warning");
            } else {
                setStatus(result?.message || "AI generation and fallback both failed.", "error");
            }
            return;
        }

        const payload = result.rule || result;
        if (payload && payload.conditions) {
            showAiDraft(payload, result.explanation || 'The AI draft is ready. Review it carefully before applying it.', result.source || 'ai');
            setStatus("AI draft ready. Review it before applying.", "warning");
        } else {
            setStatus("AI returned no usable rule. Try a different prompt.", "error");
        }
    })();
}

function applyGeneratedRule(rule) {
    if (!rule) {
        return;
    }

    const normalizedProduct = Object.keys(LOAN_CONFIG).find((product) => product.toLowerCase() === (rule.selectedProduct || "").toLowerCase()) || rule.selectedProduct || state.selectedProduct;

    state.id = rule.id || state.id;
    state.selectedProduct = normalizedProduct;
    state.ruleName = rule.ruleName || state.ruleName || "AI Generated Rule";
    state.conditions = (rule.conditions || []).map((condition) => normalizeCondition(condition, normalizedProduct));

    if (!state.conditions.length) {
        state.conditions.push(createCondition(getCurrentFields()[0]?.id));
    }

    dom.productSelect.value = normalizedProduct;
    dom.ruleNameInput.value = state.ruleName;
    renderConditions();
    renderValidation();
    updateJSONPreview();
}

function updateJSONPreview() {
    dom.jsonPreview.textContent = JSON.stringify(buildRulePayload(), null, 4);
}

function restoreSavedRule() {
    const storedRule = localStorage.getItem("loan-rule-builder-latest");
    if (!storedRule) {
        return;
    }

    try {
        const parsedRule = JSON.parse(storedRule);
        if (parsedRule && parsedRule.selectedProduct) {
            state.id = parsedRule.id || "";
            state.selectedProduct = parsedRule.selectedProduct;
            state.ruleName = parsedRule.ruleName || "";
            state.conditions = (parsedRule.conditions || []).map((condition) => normalizeCondition(condition, parsedRule.selectedProduct));
            dom.productSelect.value = parsedRule.selectedProduct;
            dom.ruleNameInput.value = parsedRule.ruleName || "";
            renderConditions();
            renderValidation();
            updateJSONPreview();
        }
    } catch (error) {
        console.warn("Unable to restore saved rule", error);
    }
}

function setStatus(message, tone = "info") {
    dom.generationStatus.textContent = message;
    dom.generationStatus.className = `status-pill ${tone}`;
}

window.RuleBuilderApp = {
    state,
    buildRulePayload,
    validateState
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
