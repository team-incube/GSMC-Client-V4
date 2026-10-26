import { HeaderWithLogout } from "@/features/logout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWithLogout />
      {children}
    </>
  );
}
