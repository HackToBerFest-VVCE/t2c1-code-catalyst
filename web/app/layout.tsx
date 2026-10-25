import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Touristमत्रम् — Curated Cultural Travel & Certified Price Protection",
  description:
    "Touristमत्रम् — Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Touristमत्रम् — Curated Cultural Travel & Certified Price Protection",
    description: "Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
    images: [{ url: "/images/hero-banner.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
