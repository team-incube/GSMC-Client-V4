const DATAGSM_AUTHORIZE_URL = "https://oauth.authorization.datagsm.kr/v1/oauth/authorize";
const DATAGSM_STATE_KEY = "datagsm_oauth_state";

export type DataGsmCallbackResult =
  | { ok: true; code: string }
  | { ok: false; reason: "denied" | "invalid-state" | "missing-code" };

export function buildDataGsmAuthorizeUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error(
      "DataGSM OAuth 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_DATAGSM_CLIENT_ID, NEXT_PUBLIC_DATAGSM_REDIRECT_URI를 확인하세요.",
    );
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem(DATAGSM_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });

  return `${DATAGSM_AUTHORIZE_URL}?${params.toString()}`;
}

function consumeDataGsmState(received: string | null): boolean {
  const saved = sessionStorage.getItem(DATAGSM_STATE_KEY);
  sessionStorage.removeItem(DATAGSM_STATE_KEY);
  return saved !== null && saved === received;
}

export function parseDataGsmCallback(search: string): DataGsmCallbackResult {
  const params = new URLSearchParams(search);
  const stateValid = consumeDataGsmState(params.get("state"));

  if (params.get("error")) return { ok: false, reason: "denied" };
  if (!stateValid) return { ok: false, reason: "invalid-state" };

  const code = params.get("code");
  if (!code) return { ok: false, reason: "missing-code" };

  return { ok: true, code };
}
