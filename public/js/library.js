// public/js/library.js
//
// Job of this file: maintain a LIST of saved rules (not just the last one).
// builder.js already dispatches a `rule:ready` CustomEvent on every save —
// this file just listens for that and appends to a library array, instead
// of needing any change to builder.js's internals.

const LIBRARY_KEY = "loan-rule-library";

export function getLibrary() {
    try {
        const raw = localStorage.getItem(LIBRARY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setLibrary(rules) {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(rules));
}

export function upsertRule(rule) {
    const rules = getLibrary();
    const idx = rules.findIndex((r) => r.id === rule.id);
    const withMeta = { ...rule, savedAt: new Date().toISOString() };
    if (idx >= 0) {
        rules[idx] = withMeta;
    } else {
        rules.unshift(withMeta);
    }
    setLibrary(rules);
    return rules;
}

export function deleteRule(id) {
    const rules = getLibrary().filter((r) => r.id !== id);
    setLibrary(rules);
    return rules;
}

// --- Wire into builder.js's existing rule:ready event, no changes needed there ---
window.addEventListener("rule:ready", (e) => {
    upsertRule(e.detail);
    renderLibrary();
});

function renderLibrary() {
    const container = document.getElementById("ruleLibraryList");
    if (!container) return;

    const rules = getLibrary();
    if (rules.length === 0) {
        container.innerHTML = `<p class="hero-copy">No rules saved yet. Build one and click Save Rule.</p>`;
        return;
    }

    container.innerHTML = rules.map((rule) => `
        <div class="panel" style="margin-bottom:12px;padding:12px;">
            <strong>${rule.ruleName || "Untitled Rule"}</strong>
            <p class="eyebrow">${rule.selectedProduct} · ${rule.conditions.length} condition(s) · saved ${new Date(rule.savedAt).toLocaleTimeString()}</p>
            <button type="button" class="btn btn-primary" data-load="${rule.id}">Load into Tester</button>
            <button type="button" class="btn" data-delete="${rule.id}">Delete</button>
        </div>
    `).join("");

    container.querySelectorAll("[data-load]").forEach((btn) =>
        btn.addEventListener("click", () => {
            const rule = getLibrary().find((r) => r.id === btn.dataset.load);
            window.dispatchEvent(new CustomEvent("rule:selected-for-test", { detail: rule }));
        })
    );

    container.querySelectorAll("[data-delete]").forEach((btn) =>
        btn.addEventListener("click", () => {
            deleteRule(btn.dataset.delete);
            renderLibrary();
        })
    );
}

renderLibrary();