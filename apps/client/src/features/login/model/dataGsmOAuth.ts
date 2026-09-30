export const DATAGSM_OAUTH_STATE_KEY = "datagsm_oauth_state";

function generateState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function buildDataGsmAuthorizeUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI;
  const authorizeUrl = process.env.NEXT_PUBLIC_DATAGSM_AUTHORIZE_URL;

  if (!clientId || !redirectUri || !authorizeUrl) {
    throw new Error(
      "DataGSM OAuth 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_DATAGSM_CLIENT_ID, NEXT_PUBLIC_DATAGSM_REDIRECT_URI, NEXT_PUBLIC_DATAGSM_AUTHORIZE_URL 확인.",
    );
  }

  const state = generateState();
  sessionStorage.setItem(DATAGSM_OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });

  return `${authorizeUrl}?${params.toString()}`;
}
