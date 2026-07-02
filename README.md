# OrangeHRM Playwright TypeScript Assignment

Overview
This repository contains an end-to-end Playwright test suite (TypeScript) for the OrangeHRM demo site. Tests follow the Page Object Model to keep selectors and flows maintainable.

Key files
- `src/pages/LoginPage.ts` — login page object
- `src/pages/AdminPage.ts` — admin page object (delete flow)
- `tests/orangehrm.spec.ts` — primary test that logs in and performs a delete action
- `playwright.config.ts` — Playwright configuration

Quick setup
1. Install dependencies
```bash
npm install
```

2. Install Playwright browsers (run once)
```bash
npx playwright install --with-deps
```

Run tests
- Run the full suite:
```bash
npx playwright test
```
- Run a single spec (headed for debugging):
```bash
npx playwright test tests/orangehrm.spec.ts --headed
```

Notes for reviewers
- The tests run against the public demo site: https://opensource-demo.orangehrmlive.com
- If a test fails or times out, open the trace for a visual replay:
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```
- To inspect or refine selectors, run the spec headed or use the Playwright recorder:
```bash
npx playwright codegen https://opensource-demo.orangehrmlive.com
```

Repository housekeeping
- A `.gitignore` is included to keep generated artifacts out of the repo (e.g., `node_modules`, `test-results`).
- Debug/inspect scripts were removed to keep the project focused and shareable.

Share / push
```bash
git remote add origin <remote-url>
git branch -M main
git push -u origin main
```

If you'd like, I can produce a short GIF or video that demonstrates a test run for inclusion in the README or a follow-up email to a recruiter.
