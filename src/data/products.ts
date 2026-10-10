export interface Product {
  name: string;
  /** Suffix saucedemo.com uses in the product's `data-test` attributes, e.g. `add-to-cart-<slug>`. */
  slug: string;
  price: number;
}

export const PRODUCTS = {
  backpack: { name: "Sauce Labs Backpack", slug: "sauce-labs-backpack", price: 29.99 },
  bikeLight: { name: "Sauce Labs Bike Light", slug: "sauce-labs-bike-light", price: 9.99 },
  boltTShirt: { name: "Sauce Labs Bolt T-Shirt", slug: "sauce-labs-bolt-t-shirt", price: 15.99 },
  fleeceJacket: {
    name: "Sauce Labs Fleece Jacket",
    slug: "sauce-labs-fleece-jacket",
    price: 49.99,
  },
  onesie: { name: "Sauce Labs Onesie", slug: "sauce-labs-onesie", price: 7.99 },
} as const satisfies Record<string, Product>;
