import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper"

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ckcarbon.co.th'),
  title: {
    default: "CK Carbon - ผู้ผลิตถ่านคุณภาพสูง",
    template: "%s | CK Carbon"
  },
  description: "CK Carbon ผู้ผลิตและจำหน่ายถ่านคุณภาพสูง รับผลิต OEM ถ่านตามต้องการ มาตรฐานสากล ส่งถึงมือคุณ",
  keywords: ["ถ่าน", "charcoal", "CK Carbon", "ผลิตถ่าน", "OEM ถ่าน", "ถ่านคุณภาพ", "ถ่านส่งออก"],
  authors: [{ name: "CK Carbon" }],
  creator: "CK Carbon",
  publisher: "CK Carbon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://www.ckcarbon.co.th",
    siteName: "CK Carbon",
    title: "CK Carbon - ผู้ผลิตถ่านคุณภาพสูง",
    description: "CK Carbon ผู้ผลิตและจำหน่ายถ่านคุณภาพสูง รับผลิต OEM ถ่านตามต้องการ มาตรฐานสากล",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CK Carbon"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CK Carbon - ผู้ผลิตถ่านคุณภาพสูง",
    description: "CK Carbon ผู้ผลิตและจำหน่ายถ่านคุณภาพสูง รับผลิต OEM ถ่านตามต้องการ มาตรฐานสากล",
    images: ["/og-image.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />

        {/* PWA Manifest & Theme */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="noto-sans-thai">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
