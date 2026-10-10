import { isAxiosError } from "axios";
import { fetchAuthorizationUrl } from "@/entities/session";

const OAUTH_STATE_KEY = "datagsm_oauth_state";
const CALLBACK_PATH = "/callback";

function getRedirectUri(): string {
  return `${window.location.origin}${CALLBACK_PATH}`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export async function startDataGsmLogin(): Promise<void> {
  try {
    const { url, state } = await fetchAuthorizationUrl(getRedirectUri());
    sessionStorage.setItem(OAUTH_STATE_KEY, state);
    window.location.assign(url);
  } catch (error) {
    throw new Error(getErrorMessage(error, "로그인 페이지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."));
  }
}
