import { test as base } from "@playwright/test";
import { CartPage } from "@pages/cart.page";
import { CheckoutCompletePage } from "@pages/checkout-complete.page";
import { CheckoutInformationPage } from "@pages/checkout-information.page";
import { CheckoutOverviewPage } from "@pages/checkout-overview.page";
import { InventoryPage } from "@pages/inventory.page";
import { LoginPage } from "@pages/login.page";

interface PageFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
});

export { expect } from "@playwright/test";
