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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="noto-sans-thai">
        {children}
      </body>
    </html>
  );
}
