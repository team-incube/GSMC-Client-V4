import "./globals.css";
import { Header } from "@repo/ui";
import { themeInitScript } from "@repo/ui/theme-script";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <Header isAdmin />
          {children}
        </Providers>
      </body>
    </html>
  );
}
