import { ENV } from "@config/env.config";

export interface UserCredentials {
  username: string;
  password: string;
}

const withSharedPassword = (username: string): UserCredentials => ({
  username,
  password: ENV.password,
});

export const USERS = {
  standard: withSharedPassword("standard_user"),
  lockedOut: withSharedPassword("locked_out_user"),
} as const satisfies Record<string, UserCredentials>;
