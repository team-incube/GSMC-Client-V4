"use client";

import { logout } from "@repo/lib";
import { Header } from "@repo/ui";
import { toast } from "sonner";

export function HeaderWithLogout() {
  const handleLogout = () => logout().catch((error: Error) => toast.error(error.message));

  return <Header isAdmin onLogout={handleLogout} />;
}
