import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const ENV = {
  BASE_URL: process.env.BASE_URL || "https://www.saucedemo.com",
  STANDARD_USERNAME: process.env.STANDARD_USERNAME || "standard_user",
  STANDARD_PASSWORD: process.env.STANDARD_PASSWORD || "secret_sauce",
  LOCKED_OUT_USERNAME: process.env.LOCKED_OUT_USERNAME || "locked_out_user",
  HEADLESS: process.env.HEADLESS !== "false",
};
