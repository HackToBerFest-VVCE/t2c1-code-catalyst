import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "YatraSetu — Curated Cultural Travel & Certified Price Protection",
  description:
    "YatraSetu — Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "YatraSetu — Curated Cultural Travel & Certified Price Protection",
    description: "Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
    images: [{ url: "/logo.png", width: 1024, height: 341 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
