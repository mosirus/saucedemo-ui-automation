# UI Automation Test Report

**Target:** [https://www.saucedemo.com](https://www.saucedemo.com)
**Framework:** Playwright Test 1.64, TypeScript, Page Object Model
**Execution date:** 2026-10-10 · Windows 11 · Node.js 22 · local run against the live site

## Results

| Run                                               | Command                              | Result                       |
| ------------------------------------------------- | ------------------------------------ | ---------------------------- |
| Full suite, Chromium                              | `npm run test:chromium`              | **17 / 17 passed** (20.1 s)  |
| Flakiness check, Chromium, every test repeated 5× | `--project=chromium --repeat-each=5` | **81 / 81 passed**, 0 flaky  |
| `@smoke` on Chromium + Firefox + WebKit           | `npm run test:smoke`                 | **7 / 7 passed** (18.8 s)    |
| E2E checkout on WebKit, repeated 20×              | `--project=webkit --repeat-each=20`  | **21 / 21 passed**, 0 flaky  |
| Full suite, all browsers, repeated 3×             | `npm test -- --repeat-each=3`        | **61 / 61 passed** (1.0 min) |
| Static checks                                     | `npm run check`                      | typecheck, lint, format pass |

The 17 results are 16 tests plus the one-off `setup` login that produces the shared session.

## Test inventory

| #   | Spec               | Test                                                                     | Tags            |
| --- | ------------------ | ------------------------------------------------------------------------ | --------------- |
| 1   | `login.spec.ts`    | standard user is redirected to the inventory after logging in            | `@smoke`        |
| 2   | `login.spec.ts`    | rejects the login when the username is empty                             | `@negative`     |
| 3   | `login.spec.ts`    | rejects the login when the password is empty                             | `@negative`     |
| 4   | `login.spec.ts`    | rejects the login when the password is wrong                             | `@negative`     |
| 5   | `login.spec.ts`    | rejects the login when the user is locked out                            | `@negative`     |
| 6   | `login.spec.ts`    | redirects to the login page when opening the inventory without a session | `@negative`     |
| 7   | `login.spec.ts`    | logged-in user can log out and loses access to the inventory             |                 |
| 8   | `cart.spec.ts`     | cart badge tracks products added and removed on the inventory            |                 |
| 9   | `cart.spec.ts`     | cart lists every added product with its price                            |                 |
| 10  | `cart.spec.ts`     | removing a product from the cart page updates the list and badge         |                 |
| 11  | `checkout.spec.ts` | customer buys Sauce Labs Onesie and the order is completed               | `@smoke` `@e2e` |
| 12  | `checkout.spec.ts` | order overview totals add up for multiple products                       |                 |
| 13  | `checkout.spec.ts` | requires the first name                                                  | `@negative`     |
| 14  | `checkout.spec.ts` | requires the last name                                                   | `@negative`     |
| 15  | `checkout.spec.ts` | requires the postal code                                                 | `@negative`     |
| 16  | `checkout.spec.ts` | cancelling returns to the cart with its items kept                       |                 |

## Primary scenario: E2E checkout (#11)

Each step is a `test.step`, so the HTML report shows which one fails:

1. **Add the product to the cart:** badge shows `1`.
2. **Review the cart:** URL `/cart.html`, the only item is _Sauce Labs Onesie_ at `$7.99`.
3. **Enter customer information:** proceeds from `/checkout-step-one.html`.
4. **Verify the order overview and totals:** `Item total: $7.99`, `Tax: $0.64`, `Total: $8.63`. The expected values come from an independent calculation (`src/utils/pricing.ts`), not from the page.
5. **Finish the order:** URL `/checkout-complete.html`, "Thank you for your order!", and the cart badge is cleared.

## Defect found during stabilisation

On WebKit, the checkout information form sometimes drops the value typed into **First Name** right after the form mounts. A standalone probe reproduced it in 2 of 20 runs, while Last Name and Postal Code kept their values. For a real product this would be a bug report. In the suite, `CheckoutInformationPage.submit()` re-fills the form until every field holds its value, so the tests stay deterministic instead of relying on retries.

## Known gaps / next steps

- Persona users (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`) have known defects on the demo site. They are worth covering with `test.fail()` annotations or visual comparisons.
- Product sorting (name / price) is not yet covered.
- Accessibility checks (e.g. `@axe-core/playwright`) are not yet included.
