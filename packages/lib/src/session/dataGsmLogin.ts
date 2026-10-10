import { isAxiosError } from "axios";
import { fetchAuthorizationUrl, signin } from "./auth";
import { saveAuthTokens } from "./tokenStorage";

const OAUTH_STATE_KEY = "datagsm_oauth_state";
const CALLBACK_PATH = "/callback";

export type DataGsmLoginResult = { ok: true } | { ok: false; message: string };

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

export async function completeDataGsmLogin(search: string): Promise<DataGsmLoginResult> {
  const params = new URLSearchParams(search);
  const savedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);

  if (params.get("error")) {
    return { ok: false, message: "DataGSM 로그인이 취소되었거나 실패했습니다." };
  }

  const state = params.get("state");
  if (!state || !savedState || state !== savedState) {
    return { ok: false, message: "인증 요청을 확인할 수 없습니다. 다시 시도해주세요." };
  }

  const code = params.get("code");
  if (!code) {
    return { ok: false, message: "인증 코드를 받지 못했습니다. 다시 시도해주세요." };
  }

  try {
    const tokens = await signin({ code, state, redirectUri: getRedirectUri() });
    saveAuthTokens(tokens);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error, "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.") };
  }
}
