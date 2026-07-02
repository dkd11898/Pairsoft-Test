# OrangeHRM Playwright TypeScript Assignment

This repository contains an end-to-end Playwright TypeScript test implementing the OrangeHRM assignment using the Page Object Model (POM).

Summary
- Tests: Playwright + TypeScript
- Pattern: Page Object Model (`src/pages/LoginPage.ts`, `src/pages/AdminPage.ts`)
- Primary spec: `tests/orangehrm.spec.ts`

Prerequisites
- Node.js 18+ and npm
- Git (for pushing/sharing)

Install dependencies
```bash
npm install
# Install Playwright browsers (run once)
npx playwright install --with-deps
```

Run the full test suite
```bash
npx playwright test
```

Run a single spec (headed for debugging)
```bash
npx playwright test tests/orangehrm.spec.ts --headed
```

Test notes & troubleshooting
- Tests expect the demo OrangeHRM site to be reachable: https://opensource-demo.orangehrmlive.com
- If a test times out, open the failing trace with:
	```bash
	npx playwright show-trace test-results/<test-folder>/trace.zip
	```
- Common fixes: run the spec headed to inspect selectors, or re-run `npx playwright codegen` to confirm selectors.

Repository hygiene
- I removed local debug/inspect scripts and screenshots to keep the repo clean.
- `.gitignore` added to exclude `node_modules`, `test-results`, and temporary artifacts.

Project structure
- `src/pages/` — Page Object Model classes (`LoginPage.ts`, `AdminPage.ts`)
- `tests/` — Playwright test specs
- `playwright.config.ts` — Playwright settings

Share with recruiter (push)
1. Add remote (replace `<remote-url>`):
```bash
git remote add origin <remote-url>
```
2. Set branch and push:
```bash
git branch -M main
git push -u origin main
```

If you want, I can also prepare a short `SUMMARY.md` or a demo GIF showing tests running.

Contact / Notes for reviewer
- The test demonstrates POM, clean selectors, and a simple delete flow on the Admin page. See the `src/pages` folder for implementation details.
