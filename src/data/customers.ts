export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Builds valid checkout customer data; override individual fields for negative scenarios. */
export function buildCustomer(overrides: Partial<CustomerInfo> = {}): CustomerInfo {
  return {
    firstName: "QA",
    lastName: "Automation",
    postalCode: "12345",
    ...overrides,
  };
}
