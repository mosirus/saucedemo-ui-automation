import type { Page } from "@playwright/test";
import { HeaderComponent } from "@components/header.component";
import { BasePage } from "./base.page";

/** Base for every page behind the login, all of which share the app header. */
export abstract class AuthenticatedPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }
}
