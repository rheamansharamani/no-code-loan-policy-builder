# no-code-loan-policy-builder

This repository contains the independent Rule Builder + AI module for Developer 2.

## Scope

This module is responsible for:
- Visual rule builder for manual rule creation
- Dynamic forms based on loan product metadata
- AI-assisted draft generation for eligibility rules
- Groq integration for generating rule suggestions
- Builder state management and normalized rule payload output

This module does not include:
- Dashboard
- Rule evaluation
- Database persistence
- Rule library
- Version history or audit logs

## Architecture

The builder is intentionally designed as a self-contained frontend module that produces a normalized rule payload and emits a `rule:ready` event. It can later be plugged into Developer 1's API without depending on other platform modules.

## Main Files

- `public/pages/builder.html` — builder UI
- `public/js/builder.js` — state management, validation, and manual/AI workflow
- `public/js/ai.js` — AI request wrapper
- `services/aiGenerator.js` — Groq-backed rule generation and fallback logic
- `routes/ai.js` — backend route for AI generation

## Run Locally

```bash
npm install
npm start
```

Then open http://localhost:3000/.

## Integration Note

Developer 2 owns the rule-building experience only. The module should output a structured rule payload for Developer 1 to consume later through the backend engine.
