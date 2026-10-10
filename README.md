# Saucedemo UI Automation

UI automation suite for [saucedemo.com](https://www.saucedemo.com), built with [Playwright Test](https://playwright.dev/) + TypeScript using the **Page Object Model (POM)** pattern.

Covers the scenarios from the QA Take Home Test, Task 3:

- **Login** — valid credentials, locked-out user, empty credentials, invalid credentials
- **E2E Checkout Flow** — add "Sauce Labs Onesie" to cart → go to cart → proceed to checkout → fill customer info → ensure the order completes successfully (plus a validation guard on step one)

## Project structure

```
saucedemo-ui-automation/
├── .github/workflows/e2e-tests.yml     # CI pipeline (GitHub Actions)
├── config/
│   ├── env.config.ts                   # environment variables (dotenv)
│   └── playwright.config.ts            # Playwright Test configuration
├── src/
│   ├── page-objects/
│   │   ├── base.page.ts                # shared navigation helpers
│   │   ├── login.page.ts
│   │   ├── inventory.page.ts
│   │   ├── cart.page.ts
│   │   └── checkout.page.ts
│   ├── fixtures/page.fixtures.ts       # injects page objects via Playwright fixtures
│   └── utils/products.ts               # product-name -> data-test slug map
├── tests/e2e/
│   ├── login.spec.ts
│   └── checkout.spec.ts
├── .env.example
├── package.json
├── tsconfig.json
└── REPORT.md                           # test execution report
```

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env   # optional, defaults already target the public demo site
```

## Running the tests

```bash
# Run the full suite headlessly
npm test

# Interactive UI runner
npm run test:ui

# Headed (watch the browser)
npm run test:headed

# Step-through debug mode
npm run test:debug

# Open the last HTML report
npm run report
```

Run a single file or test by name:

```bash
npx playwright test --config=config/playwright.config.ts tests/e2e/checkout.spec.ts
npx playwright test --config=config/playwright.config.ts -g "completes the order"
```

## Configuration

`config/env.config.ts` loads `.env` (see `.env.example`) and defaults to the public `https://www.saucedemo.com` site with the `standard_user` / `secret_sauce` test credentials, so the suite runs out of the box with no setup.

## Design notes

- **Page Object Model**: every page the flow touches (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`) exposes locators and intent-revealing methods (`login()`, `addProductToCart()`, `proceedToCheckout()`, `finishOrder()`); test files never touch a raw selector directly, so a markup change only requires updating one page object.
- **Locators**: all selectors use the app's stable `data-test` / `id` attributes (confirmed against the live site), never brittle CSS class chains or text matching, in line with Playwright's recommended practice.
- **Fixtures** (`src/fixtures/page.fixtures.ts`) inject every page object via Playwright's built-in fixture system — no `new LoginPage(page)` boilerplate scattered through specs.
- **Assertions live in the specs**, never inside page objects, keeping page objects reusable across both positive and negative test cases.
- **Auto-waiting**: relies entirely on Playwright's built-in auto-waiting and web-first assertions (`expect(locator).toHaveText(...)`), no hardcoded `waitForTimeout`.
- **E2E flow test** walks the exact scenario from the brief: add Sauce Labs Onesie → cart → checkout → complete, with a web-first assertion at every step rather than only at the end, so a failure points straight at the step that broke.

## CI/CD

`.github/workflows/e2e-tests.yml` runs the full suite (headless Chromium) on every push/PR to `main` and uploads the Playwright HTML report as a build artifact.
