/** Flat sales tax rate saucedemo.com applies on the checkout overview. */
const TAX_RATE = 0.08;

export interface OrderSummary {
  itemTotal: number;
  tax: number;
  total: number;
}

const roundToCents = (amount: number): number => Math.round(amount * 100) / 100;

export const formatPrice = (amount: number): string => `$${amount.toFixed(2)}`;

/** Independently computes the totals the checkout overview is expected to show (the test oracle). */
export function calculateOrderSummary(prices: readonly number[]): OrderSummary {
  const itemTotal = roundToCents(prices.reduce((sum, price) => sum + price, 0));
  const tax = roundToCents(itemTotal * TAX_RATE);
  return { itemTotal, tax, total: roundToCents(itemTotal + tax) };
}
