# CLAUDE.md — Project Rules

This file governs Claude's behavior across every file and folder in this project.

---

## Code Reviews (`/review`)

- Review **every single use case** — not just the happy path
- Check edge cases: missing fields, `null`/`undefined`, invalid types, empty arrays, boundary values
- Check **case-sensitivity in imports/paths** — Linux deployments are case-sensitive (e.g. `Models/item.js` vs `models/item.js`)
- Check **auth on every route**: is the user authenticated? does the resource belong to them?
- Check all **error paths**: are errors caught, logged, and returning safe messages (no stack traces to client)?
- For security reviews, compare against the correct base: use `git diff HEAD~1` for the last commit, not `git diff origin/main` after pushing

---

## Code Quality

- Write **simple but deep logic** — clean readable flow, no unnecessary complexity
- Fix **ALL identified issues in a single pass** — do not leave any for a follow-up
- Follow this logic order: parse inputs → validate → query → respond
- No magic numbers without a comment explaining the value

---

## Do Nots

- Do not leave bugs after a fix pass — verify every issue is resolved before finishing
- Do not introduce type errors
- Do not mock the database in tests — use real queries against real data
- Do not use `gh pr` commands — `gh` CLI is not installed; fall back to local `git diff` review

---

## Environment

- **Stack**: Node.js + Express + MongoDB (Mongoose) — JavaScript, not TypeScript
- **`gh` CLI**: not installed
- **Git identity**: may not be configured — check with `git config user.email` before committing
- **Security reviews**: use `git diff HEAD~1` to review the last commit, not the remote diff
