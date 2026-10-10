import { buildCustomer, type CustomerInfo } from "@data/customers";
import { PRODUCTS } from "@data/products";
import { expect, test } from "@fixtures/test.fixtures";
import { calculateOrderSummary, formatPrice } from "@utils/pricing";

test.describe("Checkout", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test(
    "customer buys Sauce Labs Onesie and the order is completed",
    { tag: ["@smoke", "@e2e"] },
    async ({
      page,
      inventoryPage,
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      const product = PRODUCTS.onesie;
      const expected = calculateOrderSummary([product.price]);

      await test.step("add the product to the cart", async () => {
        await inventoryPage.addToCart(product);
        await expect(inventoryPage.header.cartBadge).toHaveText("1");
      });

      await test.step("review the cart", async () => {
        await inventoryPage.header.openCart();
        await expect(page).toHaveURL(cartPage.path);
        await expect(cartPage.itemNames).toHaveText([product.name]);
        await expect(cartPage.itemPrices).toHaveText([formatPrice(product.price)]);
      });

      await test.step("enter customer information", async () => {
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(checkoutInformationPage.path);
        await checkoutInformationPage.submit(buildCustomer());
      });

      await test.step("verify the order overview and totals", async () => {
        await expect(page).toHaveURL(checkoutOverviewPage.path);
        await expect(checkoutOverviewPage.itemNames).toHaveText([product.name]);
        await expect(checkoutOverviewPage.itemTotalLabel).toHaveText(
          `Item total: ${formatPrice(expected.itemTotal)}`,
        );
        await expect(checkoutOverviewPage.taxLabel).toHaveText(`Tax: ${formatPrice(expected.tax)}`);
        await expect(checkoutOverviewPage.totalLabel).toHaveText(
          `Total: ${formatPrice(expected.total)}`,
        );
      });

      await test.step("finish the order", async () => {
        await checkoutOverviewPage.finishOrder();
        await expect(page).toHaveURL(checkoutCompletePage.path);
        await expect(checkoutCompletePage.completeHeader).toHaveText("Thank you for your order!");
        await expect(checkoutCompletePage.completeText).toContainText(
          "Your order has been dispatched",
        );
        await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
      });
    },
  );

  test("order overview totals add up for multiple products", async ({
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    const products = [PRODUCTS.backpack, PRODUCTS.fleeceJacket, PRODUCTS.boltTShirt];
    const expected = calculateOrderSummary(products.map((product) => product.price));

    await inventoryPage.addToCart(...products);
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(buildCustomer());

    await expect(checkoutOverviewPage.itemNames).toHaveText(
      products.map((product) => product.name),
    );
    await expect(checkoutOverviewPage.itemTotalLabel).toHaveText(
      `Item total: ${formatPrice(expected.itemTotal)}`,
    );
    await expect(checkoutOverviewPage.taxLabel).toHaveText(`Tax: ${formatPrice(expected.tax)}`);
    await expect(checkoutOverviewPage.totalLabel).toHaveText(
      `Total: ${formatPrice(expected.total)}`,
    );
  });

  test.describe("customer information validation", () => {
    test.beforeEach(async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCart(PRODUCTS.onesie);
      await inventoryPage.header.openCart();
      await cartPage.proceedToCheckout();
    });

    const missingFieldCases: { field: string; customer: CustomerInfo; error: string }[] = [
      {
        field: "first name",
        customer: buildCustomer({ firstName: "" }),
        error: "Error: First Name is required",
      },
      {
        field: "last name",
        customer: buildCustomer({ lastName: "" }),
        error: "Error: Last Name is required",
      },
      {
        field: "postal code",
        customer: buildCustomer({ postalCode: "" }),
        error: "Error: Postal Code is required",
      },
    ];

    for (const { field, customer, error } of missingFieldCases) {
      test(
        `requires the ${field}`,
        { tag: "@negative" },
        async ({ page, checkoutInformationPage }) => {
          await checkoutInformationPage.submit(customer);

          await expect(checkoutInformationPage.errorMessage).toHaveText(error);
          await expect(page).toHaveURL(checkoutInformationPage.path);
        },
      );
    }

    test("cancelling returns to the cart with its items kept", async ({
      page,
      cartPage,
      checkoutInformationPage,
    }) => {
      await checkoutInformationPage.cancel();

      await expect(page).toHaveURL(cartPage.path);
      await expect(cartPage.itemNames).toHaveText([PRODUCTS.onesie.name]);
    });
  });
});
