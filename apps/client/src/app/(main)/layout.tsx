import { AuthGuard } from "@repo/lib";
import { HeaderWithLogout } from "@/features/logout";
import { ScoreStatusSync } from "@/features/score-status-sync";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ScoreStatusSync />
      <HeaderWithLogout />
      {children}
    </AuthGuard>
  );
}
