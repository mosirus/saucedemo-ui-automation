import { defineConfig } from "eslint/config";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["node_modules/", "playwright-report/", "test-results/", ".auth/"] },
  {
    files: ["**/*.ts"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // A missing `await` on a Playwright call is the most common source of flaky tests.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-raw-locators": "error",
      "playwright/prefer-web-first-assertions": "error",
    },
  },
  prettier,
);
