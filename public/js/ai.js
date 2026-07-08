function getAiEndpoint() {
    if (typeof window !== "undefined" && window.RULE_BUILDER_CONFIG?.aiEndpoint) {
        return window.RULE_BUILDER_CONFIG.aiEndpoint;
    }
    return "/api/ai/generate";
}

async function generateRuleFromPrompt(prompt, options = {}) {
    try {
        const response = await fetch(getAiEndpoint(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt, ...options })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return { success: false, message: 'Invalid JSON returned from AI service', raw: text };
        }

        if (!response.ok) {
            return { success: false, message: data.message || 'AI service returned an error', raw: data };
        }

        return data;
    } catch (error) {
        return { success: false, message: error.message || 'Network error while calling AI service' };
    }
}

export { generateRuleFromPrompt };
export default generateRuleFromPrompt;
