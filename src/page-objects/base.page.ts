import { Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = "/"): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }
}
