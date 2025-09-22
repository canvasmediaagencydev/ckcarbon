import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CKCarbon",
  description: "Carbon footprint calculator for CK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
