"use client";

import { getAccessToken, handleUnauthenticated } from "@repo/lib";
import { useEffect, useSyncExternalStore } from "react";

const subscribe = () => () => {};

// 토큰이 없으면 자식(API 호출)을 렌더하기 전에 /login으로 보낸다.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  // 서버에는 sessionStorage가 없으므로 서버 스냅샷은 false로 둔다.
  const authed = useSyncExternalStore(subscribe, () => getAccessToken() !== null, () => false);

  useEffect(() => {
    if (!getAccessToken()) handleUnauthenticated();
  }, []);

  return authed ? children : null;
}
