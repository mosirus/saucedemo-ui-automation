import type { Locator, Page } from "@playwright/test";
import type { Product } from "@data/products";
import { AuthenticatedPage } from "./authenticated.page";

export class CartPage extends AuthenticatedPage {
  readonly path = "/cart.html";

  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.getByTestId("inventory-item-name");
    this.itemPrices = page.getByTestId("inventory-item-price");
    this.checkoutButton = page.getByTestId("checkout");
  }

  async removeItem(product: Product): Promise<void> {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
