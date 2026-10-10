import { ENV } from "@config/env.config";
import { USERS, type UserCredentials } from "@data/users";
import { expect, test } from "@fixtures/test.fixtures";

test.describe("Login", () => {
  // These tests exercise the login form itself, so they must start logged out.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    "standard user is redirected to the inventory after logging in",
    { tag: "@smoke" },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard);

      await expect(page).toHaveURL(inventoryPage.path);
      await expect(inventoryPage.title).toHaveText("Products");
    },
  );

  const rejectedLogins: { scenario: string; credentials: UserCredentials; error: string }[] = [
    {
      scenario: "the username is empty",
      credentials: { username: "", password: ENV.password },
      error: "Epic sadface: Username is required",
    },
    {
      scenario: "the password is empty",
      credentials: { username: USERS.standard.username, password: "" },
      error: "Epic sadface: Password is required",
    },
    {
      scenario: "the password is wrong",
      credentials: { username: USERS.standard.username, password: "wrong_password" },
      error: "Epic sadface: Username and password do not match any user in this service",
    },
    {
      scenario: "the user is locked out",
      credentials: USERS.lockedOut,
      error: "Epic sadface: Sorry, this user has been locked out.",
    },
  ];

  for (const { scenario, credentials, error } of rejectedLogins) {
    test(
      `rejects the login when ${scenario}`,
      { tag: "@negative" },
      async ({ page, loginPage }) => {
        await loginPage.login(credentials);

        await expect(loginPage.errorMessage).toHaveText(error);
        await expect(page).toHaveURL(loginPage.path);
      },
    );
  }

  test(
    "redirects to the login page when opening the inventory without a session",
    { tag: "@negative" },
    async ({ page, loginPage, inventoryPage }) => {
      await inventoryPage.open();

      await expect(page).toHaveURL(loginPage.path);
      await expect(loginPage.errorMessage).toHaveText(
        "Epic sadface: You can only access '/inventory.html' when you are logged in.",
      );
    },
  );
});

test.describe("Logout", () => {
  test("logged-in user can log out and loses access to the inventory", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await inventoryPage.open();
    await inventoryPage.header.logout();

    await expect(page).toHaveURL(loginPage.path);
    await expect(loginPage.loginButton).toBeVisible();

    await inventoryPage.open();
    await expect(page).toHaveURL(loginPage.path);
  });
});
