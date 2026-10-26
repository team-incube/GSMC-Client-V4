import type { AuthTokens } from "./types";

const AUTH_TOKENS_KEY = "gsmc_auth_tokens";

export function saveAuthTokens(tokens: AuthTokens): void {
  sessionStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(AUTH_TOKENS_KEY);
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as AuthTokens).accessToken;
  } catch {
    return null;
  }
}

export function clearAuthTokens(): void {
  sessionStorage.removeItem(AUTH_TOKENS_KEY);
}
