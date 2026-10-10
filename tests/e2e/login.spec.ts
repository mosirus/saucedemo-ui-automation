import { test, expect } from "../../src/fixtures/page.fixtures";
import { ENV } from "../../config/env.config";

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("standard user can log in with valid credentials @smoke", async ({ loginPage, page }) => {
    await loginPage.login(ENV.STANDARD_USERNAME, ENV.STANDARD_PASSWORD);

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator(".title")).toHaveText("Products");
  });

  test("shows an error for a locked out user", async ({ loginPage }) => {
    await loginPage.login(ENV.LOCKED_OUT_USERNAME, "secret_sauce");

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Sorry, this user has been locked out");
  });

  test("shows an error when credentials are empty", async ({ loginPage }) => {
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Username is required");
  });

  test("shows an error for an invalid password", async ({ loginPage }) => {
    await loginPage.login(ENV.STANDARD_USERNAME, "wrong_password");

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "Username and password do not match any user in this service"
    );
  });
});
