# Saucedemo UI Automation

UI automation suite for [saucedemo.com](https://www.saucedemo.com), built with [Playwright Test](https://playwright.dev/) + TypeScript using the **Page Object Model (POM)**.

## Coverage

| Area         | Scenarios                                                                                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login**    | valid login · empty username · empty password · wrong password · locked-out user · direct URL access without a session · logout                                               |
| **Cart**     | badge count on add/remove · cart lists names and prices · remove from the cart page                                                                                           |
| **Checkout** | full E2E purchase of _Sauce Labs Onesie_ (with item total / tax / total verified) · multi-item totals · required first name / last name / postal code · cancel keeps the cart |

Tags: `@smoke` (critical path, runs on Chromium, Firefox and WebKit), `@e2e`, `@negative`.

## Project structure

```
├── .github/workflows/e2e-tests.yml   # CI: static checks → E2E, nightly schedule
├── config/
│   ├── env.config.ts                 # typed env vars (.env) + shared paths
│   └── playwright.config.ts          # projects, reporters, auth setup dependency
├── src/
│   ├── components/                   # UI fragments shared across pages (header)
│   ├── pages/                        # one page object per screen
│   ├── fixtures/test.fixtures.ts     # injects page objects into tests
│   ├── data/                         # users, products (with prices), customer builder
│   └── utils/pricing.ts              # independent oracle for order totals
└── tests/
    ├── setup/auth.setup.ts           # logs in once, saves storage state
    └── e2e/                          # login, cart, checkout specs
```

## Setup

Requires Node.js 22+ (see `.nvmrc`).

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env   # optional, defaults target the public demo site
```

## Running

| Command                 | What it does                                 |
| ----------------------- | -------------------------------------------- |
| `npm test`              | full suite (all projects)                    |
| `npm run test:chromium` | full suite on Chromium only                  |
| `npm run test:smoke`    | `@smoke` tests only                          |
| `npm run test:headed`   | Chromium, with a visible browser             |
| `npm run test:ui`       | Playwright UI mode                           |
| `npm run test:debug`    | step-through debugging                       |
| `npm run report`        | open the last HTML report                    |
| `npm run check`         | typecheck + lint + format check (same as CI) |

## Design decisions

- **Page Object Model with composition.** Every screen has its own page object; pages behind the login extend `AuthenticatedPage`, which composes the shared `HeaderComponent` (cart and logout) instead of duplicating it. Each page declares its `path`, so specs assert navigation with `expect(page).toHaveURL(cartPage.path)` instead of hand-written regexes.
- **Stable locators only.** All locators use `getByTestId` against the app's `data-test` attributes (`testIdAttribute: "data-test"`), or `getByRole`. There are no CSS class selectors, and specs never build raw locators (enforced by `playwright/no-raw-locators`).
- **Assertions live in specs.** Page objects expose locators and user intents (`login()`, `addToCart()`, `submit()`, `finishOrder()`), so the same page object serves positive and negative tests. The one exception is synchronisation: `CheckoutInformationPage.submit()` re-fills the form until every field holds its value, because the app occasionally drops a value typed right after the form mounts on WebKit.
- **Log in once, reuse the session.** The `setup` project logs in and saves `storageState`. Every other test starts already authenticated, so only the login specs exercise the login form (they explicitly opt out of the stored session). The saucedemo session cookie lives for 10 minutes. The full run takes about 1 minute, but if the suite grows past that, switch to a per-worker login fixture.
- **Independent test oracle.** Order totals are not just checked for a `$` sign. `calculateOrderSummary()` computes the expected item total, 8% tax and total from the product catalogue, and the overview must match exactly.
- **Data-driven negative tests.** Validation cases are tables of `{ scenario, input, expectedError }` that generate one named test each, so adding a case is a one-line change.
- **Readable reports.** The E2E flow is split into `test.step`s, so the HTML report and traces show exactly which step broke.
- **No hard waits.** The suite relies only on auto-waiting and web-first assertions.
- **Quality gates.** TypeScript `strict`, type-aware ESLint (`no-floating-promises` catches missing `await`s), `eslint-plugin-playwright` and Prettier run in CI before any browser starts.

## CI/CD

`.github/workflows/e2e-tests.yml` runs on push/PR to `main`/`master`, nightly, and on demand:

1. **static-checks:** typecheck, lint, format check.
2. **e2e-tests:** installs browsers and runs the suite. It reports through the `github` reporter (inline PR annotations) and JUnit, and uploads the HTML report on every run plus traces/screenshots/videos on failure.
