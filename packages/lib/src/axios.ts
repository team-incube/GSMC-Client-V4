import axios from "axios";
import { getAccessToken } from "./session/tokenStorage";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
