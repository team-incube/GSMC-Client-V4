import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, handleUnauthenticated, saveAuthTokens } from "./session/tokenStorage";
import type { AuthTokens } from "./session/types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // 절대 URL로 baseURL을 덮어쓰지 못하게 막아, 액세스 토큰이 외부 호스트로 나가지 않게 한다.
  allowAbsoluteUrls: false,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

const REFRESH_URL = "/api/auth/token/refresh";

// 여러 요청이 동시에 401을 받아도 갱신 요청은 한 번만 보낸다.
let refreshing: Promise<void> | null = null;

function refreshTokens(): Promise<void> {
  refreshing ??= (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("refresh token이 없습니다.");
    const { data } = await apiClient.post<AuthTokens>(REFRESH_URL, { refreshToken });
    saveAuthTokens(data);
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

// refresh token이 없거나 서버가 거절했을 때만 세션을 끝낸다. 네트워크 오류나 5xx로는 로그아웃시키지 않는다.
function isRefreshRejected(error: unknown): boolean {
  if (!isAxiosError(error)) return true;
  const status = error.response?.status;
  return status === 401 || status === 403;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!isAxiosError(error) || error.response?.status !== 401) return Promise.reject(error);

    const config = error.config as RetriableConfig | undefined;
    // 갱신 요청 자체의 401은 refreshTokens를 부른 쪽에서 처리한다.
    if (config?.url === REFRESH_URL) return Promise.reject(error);
    // 다른 인증 API의 401이나 이미 한 번 재시도한 요청은 갱신하지 않는다(무한 반복 방지).
    if (!config || config._retried || config.url?.startsWith("/api/auth/")) {
      handleUnauthenticated();
      return Promise.reject(error);
    }

    try {
      // 다른 요청이 이미 갱신을 끝냈다면 쓰인 refresh token으로 다시 갱신하지 않고 재시도만 한다.
      const currentToken = getAccessToken();
      if (!currentToken || config.headers.Authorization === `Bearer ${currentToken}`) await refreshTokens();
    } catch (refreshError) {
      if (isRefreshRejected(refreshError)) handleUnauthenticated();
      return Promise.reject(error);
    }
    config._retried = true;
    // 요청 인터셉터가 새 액세스 토큰을 다시 붙인다.
    return apiClient(config);
  },
);
