import { apiClient } from "@repo/lib";
import type { AuthorizationUrl } from "../model/types";

export async function fetchAuthorizationUrl(redirectUri: string): Promise<AuthorizationUrl> {
  const { data } = await apiClient.get<AuthorizationUrl>("/api/auth/authorization-url", {
    params: { redirectUri },
  });
  return data;
}
