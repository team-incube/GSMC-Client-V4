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

// 토큰을 지우고 로그인 페이지로 보낸다. 이미 /login이면 무한 새로고침을 막기 위해 이동하지 않는다.
export function handleUnauthenticated(): void {
  if (typeof window === "undefined") return;
  clearAuthTokens();
  if (window.location.pathname !== "/login") window.location.replace("/login");
}
