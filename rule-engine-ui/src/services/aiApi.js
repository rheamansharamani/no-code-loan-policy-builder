// rule-engine-ui/src/services/aiApi.js
//
// Real network call to the Express backend's AI rule generator.
// Requires:
//   1. Backend running: `npm start` in the project root (port 3000)
//   2. Vite dev proxy configured in vite.config.js (already added) so
//      "/api/*" from this app (port 5173) is forwarded to port 3000.
//
// Deliberately scoped to just this one endpoint — auth and rule
// persistence for this app are separate, bigger pieces of work.

const AI_GENERATE_ENDPOINT = "/api/ai/generate";

/**
 * @param {string} prompt - natural language rule description
 * @returns {Promise<{success:boolean, source:string, explanation:string, rule:{id:string, selectedProduct:string, ruleName:string, conditions:Array}}>}
 */
export async function generateRuleFromPrompt(prompt) {
  const trimmed = (prompt || "").trim();
  if (!trimmed) {
    throw new Error("Please describe the rule you want to generate.");
  }

  const response = await fetch(AI_GENERATE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: trimmed }),
  });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error("Backend did not return valid JSON. Is the Express server running on port 3000?");
  }

  if (!response.ok || body.success === false) {
    throw new Error(body.message || `AI generation failed (HTTP ${response.status}).`);
  }

  return body;
}