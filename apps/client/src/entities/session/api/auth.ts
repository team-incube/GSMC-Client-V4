import { apiClient } from "@repo/lib";
import type { AuthorizationUrl, AuthTokens, SigninInput } from "../model/types";

export async function fetchAuthorizationUrl(redirectUri: string): Promise<AuthorizationUrl> {
  const { data } = await apiClient.get<AuthorizationUrl>("/api/auth/authorization-url", {
    params: { redirectUri },
  });
  return data;
}

export async function signin(input: SigninInput): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>("/api/auth/signin", input);
  return data;
}
