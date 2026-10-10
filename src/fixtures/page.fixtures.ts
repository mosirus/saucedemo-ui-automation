import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../page-objects/login.page";
import { InventoryPage } from "../page-objects/inventory.page";
import { CartPage } from "../page-objects/cart.page";
import { CheckoutPage } from "../page-objects/checkout.page";

type FrameworkFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = baseTest.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";
