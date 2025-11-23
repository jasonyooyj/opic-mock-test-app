import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPIc 모의고사",
  description: "OPIc IH/AL 레벨 모의고사 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


