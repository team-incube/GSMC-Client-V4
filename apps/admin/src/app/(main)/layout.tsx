import { Header } from "@repo/ui";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header isAdmin />
      {children}
    </>
  );
}
