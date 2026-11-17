import { AuthGuard } from "@/features/auth-guard";
import { HeaderWithLogout } from "@/features/logout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWithLogout />
      <AuthGuard>{children}</AuthGuard>
    </>
  );
}
