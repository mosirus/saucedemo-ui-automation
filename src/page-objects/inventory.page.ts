import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.cartLink = page.locator(".shopping_cart_link");
    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  /** Builds the "Add to cart" button locator for a given product, by its data-test slug. */
  addToCartButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
  }

  async addProductToCart(productSlug: string): Promise<void> {
    await this.addToCartButton(productSlug).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
