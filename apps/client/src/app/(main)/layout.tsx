import { Header } from "@repo/ui";
import { AuthGuard } from "@/features/auth-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <AuthGuard>{children}</AuthGuard>
    </>
  );
}
