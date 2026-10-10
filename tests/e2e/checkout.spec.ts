import { test, expect } from "../../src/fixtures/page.fixtures";
import { ENV } from "../../config/env.config";
import { PRODUCT_SLUGS } from "../../src/utils/products";

const ONESIE = "Sauce Labs Onesie";

test.describe("E2E Checkout Flow", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(ENV.STANDARD_USERNAME, ENV.STANDARD_PASSWORD);
  });

  test("adds Sauce Labs Onesie to cart, checks out, and completes the order @smoke @e2e", async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Add item 'Sauce Labs Onesie' to cart
    await inventoryPage.addProductToCart(PRODUCT_SLUGS[ONESIE]);
    await expect(inventoryPage.cartBadge).toHaveText("1");

    // 2. Go to cart
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(cartPage.itemNames()).toHaveText([ONESIE]);

    // 3. Proceed checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    await checkoutPage.fillCustomerInfo({
      firstName: "QA",
      lastName: "Automation",
      postalCode: "12345",
    });
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(checkoutPage.summaryItemNames).toHaveText([ONESIE]);
    await expect(checkoutPage.summaryTotalLabel).toContainText("Total: $");

    // 4. Ensure that the checkout process is completed
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText("Thank you for your order!");
    await expect(checkoutPage.completeText).toContainText(
      "Your order has been dispatched"
    );
    await expect(checkoutPage.backToProductsButton).toBeVisible();
  });

  test("cannot continue past step one without required customer information", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(PRODUCT_SLUGS[ONESIE]);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    // Leave all fields blank and try to continue
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.stepOneErrorMessage).toBeVisible();
    await expect(checkoutPage.stepOneErrorMessage).toContainText("First Name is required");
  });
});
