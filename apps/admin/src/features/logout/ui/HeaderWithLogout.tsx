"use client";

import { logout, useAlertNotifications } from "@repo/lib";
import { Header } from "@repo/ui";

export function HeaderWithLogout() {
  const notification = useAlertNotifications();
  return <Header isAdmin notification={notification} onLogout={logout} />;
}
