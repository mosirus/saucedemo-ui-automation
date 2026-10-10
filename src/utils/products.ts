/** Maps readable product names to the `data-test` slug saucedemo.com uses for their "Add to cart" buttons. */
export const PRODUCT_SLUGS = {
  "Sauce Labs Backpack": "sauce-labs-backpack",
  "Sauce Labs Bike Light": "sauce-labs-bike-light",
  "Sauce Labs Bolt T-Shirt": "sauce-labs-bolt-t-shirt",
  "Sauce Labs Fleece Jacket": "sauce-labs-fleece-jacket",
  "Sauce Labs Onesie": "sauce-labs-onesie",
} as const;

export type ProductName = keyof typeof PRODUCT_SLUGS;
