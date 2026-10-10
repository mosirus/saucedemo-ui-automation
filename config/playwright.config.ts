import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./env.config";

export default defineConfig({
  testDir: "../tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [
    ["html", { outputFolder: "../playwright-report", open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: ENV.BASE_URL,
    headless: ENV.HEADLESS,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    { name: "Chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
