import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Touristमित्रम् — Curated Cultural Travel & Certified Price Protection",
  description:
    "Touristमित्रम् — Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "Touristमित्रम् — Curated Cultural Travel & Certified Price Protection",
    description: "Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
    images: [{ url: "/logo.png", width: 1024, height: 341 }],
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
