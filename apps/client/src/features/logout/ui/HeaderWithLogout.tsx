"use client";

import { logout, useAlertNotifications, type Alert } from "@repo/lib";
import { Header } from "@repo/ui";

// 점수 알림을 누르면 메인에서 그 점수의 카테고리를 열어 보여 준다.
const getAlertHref = (alert: Alert) => (alert.scoreId ? `/?score=${alert.scoreId}` : undefined);

export function HeaderWithLogout() {
  const notification = useAlertNotifications({ getHref: getAlertHref });
  return <Header notification={notification} onLogout={logout} />;
}
