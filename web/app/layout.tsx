import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Touristमत्रम् — Tourism AI & Verified Travel on Solana",
  description:
    "Touristमत्रम् — Discover verified travel agents on Solana, plan curated itineraries, and commit tamper-evident travel agreements on Devnet.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Touristमत्रम् — Tourism AI on Solana",
    description: "Discover verified travel agents on Solana and commit tamper-evident trip records on Devnet.",
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
