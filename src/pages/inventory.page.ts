import type { Locator, Page } from "@playwright/test";
import type { Product } from "@data/products";
import { AuthenticatedPage } from "./authenticated.page";

export class InventoryPage extends AuthenticatedPage {
  readonly path = "/inventory.html";

  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId("title");
  }

  addToCartButton(product: Product): Locator {
    return this.page.getByTestId(`add-to-cart-${product.slug}`);
  }

  removeButton(product: Product): Locator {
    return this.page.getByTestId(`remove-${product.slug}`);
  }

  async addToCart(...products: Product[]): Promise<void> {
    for (const product of products) {
      await this.addToCartButton(product).click();
    }
  }

  async removeFromCart(product: Product): Promise<void> {
    await this.removeButton(product).click();
  }
}
