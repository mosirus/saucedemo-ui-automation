import { defineConfig, devices, type ReporterDescription } from "@playwright/test";
import { ENV, PATHS } from "./env.config";

const reporters: ReporterDescription[] = [
  ["list"],
  ["html", { outputFolder: "../playwright-report", open: "never" }],
];

if (ENV.isCI) {
  reporters.push(["github"], ["junit", { outputFile: "../test-results/junit.xml" }]);
}

const authenticated = { storageState: PATHS.standardUserAuthState };

export default defineConfig({
  testDir: "../tests",
  outputDir: "../test-results",
  tsconfig: "../tsconfig.json",
  fullyParallel: true,
  forbidOnly: ENV.isCI,
  retries: ENV.isCI ? 2 : 0,
  workers: ENV.isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: reporters,
  use: {
    baseURL: ENV.baseUrl,
    headless: ENV.headless,
    testIdAttribute: "data-test",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], ...authenticated },
      dependencies: ["setup"],
    },
    // Cross-browser coverage is limited to the smoke set to keep the feedback loop fast.
    {
      name: "firefox",
      grep: /@smoke/,
      use: { ...devices["Desktop Firefox"], ...authenticated },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      grep: /@smoke/,
      use: { ...devices["Desktop Safari"], ...authenticated },
      dependencies: ["setup"],
    },
  ],
});
