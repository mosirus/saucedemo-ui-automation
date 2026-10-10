import { expect, type Locator, type Page } from "@playwright/test";
import type { CustomerInfo } from "@data/customers";
import { AuthenticatedPage } from "./authenticated.page";

/** Checkout step one: customer information. */
export class CheckoutInformationPage extends AuthenticatedPage {
  readonly path = "/checkout-step-one.html";

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.cancelButton = page.getByTestId("cancel");
    this.errorMessage = page.getByTestId("error");
  }

  async submit(customer: CustomerInfo): Promise<void> {
    const fields: [Locator, string][] = [
      [this.firstNameInput, customer.firstName],
      [this.lastNameInput, customer.lastName],
      [this.postalCodeInput, customer.postalCode],
    ];

    // The form occasionally drops a value typed right after it mounts (reproduced ~1 in 10 runs
    // on WebKit), so re-fill until every field holds its value. This is synchronisation, not a check.
    await expect(async () => {
      for (const [input, value] of fields) await input.fill(value);
      for (const [input, value] of fields) await expect(input).toHaveValue(value, { timeout: 500 });
    }).toPass({ timeout: 10_000 });

    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
