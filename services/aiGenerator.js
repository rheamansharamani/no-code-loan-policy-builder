import { LOAN_CONFIG } from "../public/js/config.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function safeFetch(url, opts) {
    if (typeof fetch === 'function') {
        return fetch(url, opts);
    }

    // Node older versions fallback
    try {
        const nodeFetch = await import('node-fetch');
        return nodeFetch.default(url, opts);
    } catch (e) {
        throw new Error('Fetch is not available in this environment');
    }
}

function inferProduct(prompt) {
    const text = String(prompt || '').toLowerCase();

    if (text.includes("car")) return "Car Loan";
    if (text.includes("education")) return "Education Loan";
    if (text.includes("gold")) return "Gold Loan";
    return "Home Loan";
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

    return mapping[normalized] || (/[0-9]/.test(normalized) ? ">=" : "=");
}

function normalizeFieldId(product, rawFieldId, rawFieldName) {
    const fields = product && LOAN_CONFIG[product] ? LOAN_CONFIG[product].fields : Object.values(LOAN_CONFIG).flatMap((config) => config.fields || []);

    if (rawFieldId && fields.some((field) => field.id === rawFieldId)) return rawFieldId;

    const key = String(rawFieldName || rawFieldId || "").toLowerCase().replace(/\s+/g, "");
    const byId = fields.find((f) => f.id.toLowerCase() === key);
    if (byId) return byId.id;

    const byLabel = fields.find((f) => f.label.toLowerCase() === (rawFieldName || "").toLowerCase());
    if (byLabel) return byLabel.id;

    const aliasMap = {
        age: "applicant_age",
        studentage: "student_age",
        income: "monthly_income",
        coapplicantincome: "coapplicant_income",
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
        country: "country",
        vehiclecost: "vehicle_cost"
    };

    if (aliasMap[key] && fields.some(f => f.id === aliasMap[key])) return aliasMap[key];

    return fields[0]?.id || "";
}

function parseAmountToNumber(rawValue) {
    if (!rawValue && rawValue !== 0) return 0;
    const normalizedValue = String(rawValue).toLowerCase().trim();
    if (normalizedValue.includes("lakh")) {
        const base = Number.parseFloat(normalizedValue.replace(/[^0-9.]/g, "")) || 0;
        return Math.round(base * 100000);
    }
    if (normalizedValue.includes("thousand") || normalizedValue.includes("k")) {
        const base = Number.parseFloat(normalizedValue.replace(/[^0-9.]/g, "")) || 0;
        return Math.round(base * 1000);
    }
    return Number.parseFloat(normalizedValue.replace(/[^0-9.]/g, "")) || 0;
}

function normalizeConditionsList(conds, product) {
    const arr = Array.isArray(conds) ? conds : [];
    return arr.map(c => ({
        id: c.id || crypto?.randomUUID?.() || (Math.random()+""),
        fieldId: normalizeFieldId(product, c.fieldId, c.fieldName || c.field || c.label),
        operator: normalizeOperator(c.operator),
        value: (function(){
            const fid = normalizeFieldId(product, c.fieldId, c.fieldName || c.field || c.label);
            const fieldDef = (LOAN_CONFIG[product]?.fields || []).find(f=>f.id===fid) || null;
            if (fieldDef && fieldDef.type === 'number') return String(parseAmountToNumber(c.value));
            return c.value ?? "";
        })()
    }));
}

function buildFallbackRule(prompt) {
    const product = inferProduct(prompt);
    const productConfig = LOAN_CONFIG[product] || Object.values(LOAN_CONFIG)[0];
    const conditions = [];

    const ageMatch = prompt.match(/age\s*(?:above|over|greater than|>=|>)?\s*(\d+)/i);
    if (ageMatch) {
        conditions.push({ fieldId: product === 'Education Loan' ? 'student_age' : 'applicant_age', operator: '>=', value: ageMatch[1] });
    }

    const incomeMatch = prompt.match(/income\s*(?:above|over|greater than|>=|>)?\s*(\d+(?:\.\d+)?(?:\s*(?:lakh|thousand|k))?)/i);
    if (incomeMatch) {
        const val = parseAmountToNumber(incomeMatch[1]);
        conditions.push({ fieldId: product === 'Education Loan' ? 'coapplicant_income' : 'monthly_income', operator: '>=', value: String(val) });
    }

    const cibilMatch = prompt.match(/cibil\s*(?:above|over|greater than|>=|>)?\s*(\d+)/i);
    if (cibilMatch) {
        conditions.push({ fieldId: product === 'Education Loan' ? 'coapplicant_cibil' : 'cibil_score', operator: '>=', value: cibilMatch[1] });
    }

    if (/salaried/i.test(prompt)) conditions.push({ fieldId: 'employment_type', operator: '=', value: 'Salaried' });
    if (/self\s*employed/i.test(prompt)) conditions.push({ fieldId: 'employment_type', operator: '=', value: 'Self Employed' });
    if (/business/i.test(prompt)) conditions.push({ fieldId: 'employment_type', operator: '=', value: 'Business' });

    if (!conditions.length) {
        conditions.push({ fieldId: productConfig.fields[0]?.id || '', operator: '>=', value: '' });
    }

    return {
        success: true,
        source: 'fallback',
        explanation: 'Heuristic fallback used (no Groq or Groq failed).',
        rule: {
            id: crypto?.randomUUID?.() || (Math.random()+""),
            selectedProduct: product,
            ruleName: `${product} Eligibility Rule (AI fallback)`,
            conditions: normalizeConditionsList(conditions, product)
        }
    };
}

function parseStructuredRule(content) {
    try {
        const cleaned = String(content || '').replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
            success: true,
            source: 'groq',
            explanation: parsed.explanation || 'Rule generated with Groq.',
            rule: {
                id: parsed.id || (crypto?.randomUUID?.() || (Math.random()+"")),
                selectedProduct: parsed.selectedProduct || inferProduct(parsed.ruleName || ''),
                ruleName: parsed.ruleName || 'AI Generated Rule',
                conditions: normalizeConditionsList(parsed.conditions || [], parsed.selectedProduct || inferProduct(parsed.ruleName || ''))
            }
        };
    } catch (e) {
        throw new Error('Failed to parse AI output as JSON: ' + e.message);
    }
}

export async function generateRuleFromPrompt(prompt, options = {}) {
    const forceFallback = options.forceFallback === true;

    if (!prompt || !String(prompt).trim()) throw new Error('Prompt is required');

    if (forceFallback || !process.env.GROQ_API_KEY) {
        return buildFallbackRule(prompt);
    }

    try {
        const resp = await safeFetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                temperature: 0.2,
                messages: [
                    { role: 'system', content: 'You convert business rule requests into JSON for a lending rule engine. Return only valid JSON with fields selectedProduct, ruleName, conditions, explanation. Each condition must include fieldId, operator, value.' },
                    { role: 'user', content: prompt }
                ]
            }),
            timeout: 15000
        });

        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content || data?.result || '';
        if (!content) throw new Error('No content returned by Groq');

        return parseStructuredRule(content);
    } catch (error) {
        // return fallback but include error message so caller can notify user
        const fallback = buildFallbackRule(prompt);
        fallback.source = 'fallback';
        fallback.explanation = `Groq error: ${error.message}. Using fallback heuristics.`;
        fallback._error = error.message;
        return fallback;
    }
}

export default generateRuleFromPrompt;
