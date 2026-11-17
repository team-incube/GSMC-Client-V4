import type { Metadata } from "next";
import "./globals.css";
import { themeInitScript } from "@repo/ui/theme-script";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GSMC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
