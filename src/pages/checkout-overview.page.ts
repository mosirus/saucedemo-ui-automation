import type { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated.page";

/** Checkout step two: order overview. */
export class CheckoutOverviewPage extends AuthenticatedPage {
  readonly path = "/checkout-step-two.html";

  readonly itemNames: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.getByTestId("inventory-item-name");
    this.itemTotalLabel = page.getByTestId("subtotal-label");
    this.taxLabel = page.getByTestId("tax-label");
    this.totalLabel = page.getByTestId("total-label");
    this.finishButton = page.getByTestId("finish");
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
