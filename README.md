# [![Playwright Tests](https://github.com/dkd11898/Pairsoft-Test/actions/workflows/playwright.yml/badge.svg)](https://github.com/dkd11898/Pairsoft-Test/actions)
# OrangeHRM Automation Assignment
**Playwright + TypeScript | Page Object Model (POM)**

## Overview

This project contains an end-to-end UI automation solution for the OrangeHRM demo application using **Playwright with TypeScript**.

The solution follows industry best practices including:

- Page Object Model (POM)
- Reusable page classes
- Dynamic credential extraction (No hardcoded credentials)
- Clean and maintainable code
- Assertions using Playwright Test
- Automatic screenshots and traces on failure
- HTML Reporting

---

## Assignment Covered

✔ Open OrangeHRM Login Page

✔ Read Username & Password dynamically from the login information panel

✔ Login without hardcoded credentials

✔ Navigate to **Admin**

✔ Delete the second user record

✔ Confirm deletion

✔ Verify the deleted username no longer exists

---

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Playwright Test Runner

---

## Project Structure

```
.
├── src
│   ├── pages
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── AdminPage.ts
│   │
│   ├── utils
│   └── fixtures
│
├── tests
│   └── orangehrm.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

## Demo

> The demo recording is available from the live test artifacts and should not be included in the ZIP submission. Run the test locally with `npx playwright test` to reproduce the flow.

---

## Prerequisites

- Node.js 18+
- npm

---

## Installation

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Execute Tests

Run all tests

```bash
npx playwright test
```

Run in headed mode

```bash
npx playwright test --headed
```

Run a single test

```bash
npx playwright test tests/orangehrm.spec.ts
```

---

## Reports

Open HTML Report

```bash
npx playwright show-report
```

View execution trace

```bash
npx playwright show-trace test-results/<folder>/trace.zip
```

---

## Notes

- Credentials are extracted dynamically from the login page.
- No username or password is hardcoded.
- The framework follows the Page Object Model for better scalability and maintainability.
- The test validates successful deletion by ensuring the deleted username is no longer present in the table.

---

## Target Application

https://opensource-demo.orangehrmlive.com

---

## Author

**Dipendra Dabhi**

Senior SDET | QA Automation Engineer