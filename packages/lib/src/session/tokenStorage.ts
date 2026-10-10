import type { AuthTokens } from "./types";

const AUTH_TOKENS_KEY = "gsmc_auth_tokens";

export function saveAuthTokens(tokens: AuthTokens): void {
  sessionStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
}
