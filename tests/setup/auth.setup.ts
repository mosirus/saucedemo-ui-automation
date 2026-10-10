import { PATHS } from "@config/env.config";
import { USERS } from "@data/users";
import { expect, test as setup } from "@fixtures/test.fixtures";

setup("authenticate as standard user", async ({ page, loginPage, inventoryPage }) => {
  await loginPage.open();
  await loginPage.login(USERS.standard);
  await expect(page).toHaveURL(inventoryPage.path);

  await page.context().storageState({ path: PATHS.standardUserAuthState });
});
