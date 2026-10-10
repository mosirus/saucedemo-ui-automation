import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  // Step one: customer information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly stepOneErrorMessage: Locator;

  // Step two: order overview
  readonly summaryItemNames: Locator;
  readonly summaryTotalLabel: Locator;
  readonly finishButton: Locator;

  // Step three: completion
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.stepOneErrorMessage = page.locator('[data-test="error"]');

    this.summaryItemNames = page.locator(".inventory_item_name");
    this.summaryTotalLabel = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomerInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
