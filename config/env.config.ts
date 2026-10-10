import path from "node:path";
import dotenv from "dotenv";

const PROJECT_ROOT = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

export const ENV = {
  baseUrl: readEnv("BASE_URL", "https://www.saucedemo.com"),
  /** saucedemo.com uses one shared password for every demo user. */
  password: readEnv("SAUCE_PASSWORD", "secret_sauce"),
  headless: readEnv("HEADLESS", "true") !== "false",
  isCI: !!process.env.CI,
} as const;

export const PATHS = {
  /** Browser storage state of the logged-in standard user, written by the auth setup project. */
  standardUserAuthState: path.join(PROJECT_ROOT, ".auth", "standard-user.json"),
} as const;
