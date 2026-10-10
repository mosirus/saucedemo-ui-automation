import type { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated.page";

/** Checkout step three: order confirmation. */
export class CheckoutCompletePage extends AuthenticatedPage {
  readonly path = "/checkout-complete.html";

  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId("complete-header");
    this.completeText = page.getByTestId("complete-text");
    this.backToProductsButton = page.getByTestId("back-to-products");
  }
}
