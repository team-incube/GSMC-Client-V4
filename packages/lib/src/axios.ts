import axios from "axios";
import { getAccessToken } from "./session/tokenStorage";

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
apiClient.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error),
);
