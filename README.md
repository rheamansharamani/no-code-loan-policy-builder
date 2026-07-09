# No-Code Loan Policy Builder

AI-powered Business Rule Engine for configurable loan eligibility rules.

This repository contains two main parts:

- Backend (Express): provides an AI rule-generation endpoint and serves static assets. (port 3000)
- Frontend (React + Vite): the rule-builder UI and applicant flows. (port 5173)

Quick Start
-----------
1. Install dependencies (run once):

```bash
# From repository root
npm install
cd rule-engine-ui
npm install
```

2. Start the backend server (project root):

```bash
npm start
```

This starts the Express server on port `3000` and exposes the AI route at `/api/ai/generate`.

3. Start the frontend dev server (in a new terminal):

```bash
cd rule-engine-ui
npm run dev
```

This starts Vite on port `5173`. Vite is configured to proxy `/api` → `http://localhost:3000` so the AI endpoint is reachable from the UI.

Mock accounts (for local development)
------------------------------------
- Administrator: `admin@example.com` / `admin123`
- Loan Applicant: `user@example.com` / `user123`

Where to look / edit
--------------------
- Frontend entry: `rule-engine-ui/src/main.jsx` and `rule-engine-ui/src/App.jsx`.
- Routes and protected routes: `rule-engine-ui/src/routes/AppRoutes.jsx`.
- Admin Rule Builder page: `rule-engine-ui/src/pages/admin/Rules.jsx` (product selector, manual/AI toggle lives here).
- Loan product configuration (product-specific fields): `rule-engine-ui/src/config/loanConfig.js`.
- AI client used by the frontend: `rule-engine-ui/src/services/aiApi.js` (POSTs to `/api/ai/generate`).
- Frontend auth/session helpers: `rule-engine-ui/src/services/api.js`.
- Backend AI router: `routes/ai.js` and generator logic in `services/aiGenerator.js`.
- Static builder preview (served by backend): `public/pages/builder.html` (optional).

What I changed (local edits)
----------------------------
- UI: `Rules.jsx` now has a Product selector and Manual / AI mode toggle. Manual entry shows product-specific fields. AI Builder uses the selected product and calls the backend.
- Dev server proxy: `rule-engine-ui/vite.config.js` now proxies `/api` to `http://localhost:3000`.
- Logout: navbar and sidebar were updated so both admin and user can log out correctly (auth key is `ruleEngineAuth`).

Troubleshooting
---------------
- If the AI panel says "Backend did not return valid JSON", ensure the backend is running (`npm start`) and reachable on port `3000`.
- If changes in frontend components seem stale, stop and restart `npm run dev` to clear Vite's module cache.

Next steps you might want
------------------------
- Persist rules to the backend (API + DB) instead of keeping them in memory.
- Add server-side authentication and secure the AI endpoint.
- Add nicer styling to the Manual/AI mode toggle in `rule-engine-ui/src/pages/admin/Admin.css`.

Contributing
------------
Send PRs against the `main` branch. Keep changes scoped and include a short description of intent.

License
-------
MIT (adjust as needed)
