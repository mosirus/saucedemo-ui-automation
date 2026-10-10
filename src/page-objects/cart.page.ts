import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  itemNames(): Locator {
    return this.cartItems.locator(".inventory_item_name");
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
