import { PRODUCTS } from "@data/products";
import { expect, test } from "@fixtures/test.fixtures";
import { formatPrice } from "@utils/pricing";

test.describe("Cart", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test("cart badge tracks products added and removed on the inventory", async ({
    inventoryPage,
  }) => {
    const { cartBadge } = inventoryPage.header;

    await inventoryPage.addToCart(PRODUCTS.backpack);
    await expect(cartBadge).toHaveText("1");
    await expect(inventoryPage.removeButton(PRODUCTS.backpack)).toBeVisible();

    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await expect(cartBadge).toHaveText("2");

    await inventoryPage.removeFromCart(PRODUCTS.backpack);
    await expect(cartBadge).toHaveText("1");
    await expect(inventoryPage.addToCartButton(PRODUCTS.backpack)).toBeVisible();

    await inventoryPage.removeFromCart(PRODUCTS.bikeLight);
    await expect(cartBadge).toBeHidden();
  });

  test("cart lists every added product with its price", async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    const products = [PRODUCTS.backpack, PRODUCTS.onesie];

    await inventoryPage.addToCart(...products);
    await inventoryPage.header.openCart();

    await expect(page).toHaveURL(cartPage.path);
    await expect(cartPage.itemNames).toHaveText(products.map((product) => product.name));
    await expect(cartPage.itemPrices).toHaveText(
      products.map((product) => formatPrice(product.price)),
    );
  });

  test("removing a product from the cart page updates the list and badge", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.onesie);
    await inventoryPage.header.openCart();

    await cartPage.removeItem(PRODUCTS.backpack);

    await expect(cartPage.itemNames).toHaveText([PRODUCTS.onesie.name]);
    await expect(cartPage.header.cartBadge).toHaveText("1");
  });
});
