import { AuthGuard } from "@repo/lib";
import { HeaderWithLogout } from "@/features/logout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <HeaderWithLogout />
      {children}
    </AuthGuard>
  );
}
