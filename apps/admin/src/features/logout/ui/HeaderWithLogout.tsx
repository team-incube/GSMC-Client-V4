"use client";

import { logout } from "@repo/lib";
import { Header } from "@repo/ui";

export function HeaderWithLogout() {
  return <Header isAdmin onLogout={logout} />;
}
