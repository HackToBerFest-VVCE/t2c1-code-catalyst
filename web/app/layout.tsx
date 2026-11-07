import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "YatraSetu — Curated Cultural Travel & Certified Price Protection",
  description:
    "YatraSetu — Discover verified travel concierges, plan bespoke cultural itineraries, and secure guaranteed pricing with tamper-proof digital travel certificates.",
  authors: [
    { name: "Suresh Kishor Savant" },
    { name: "Gahana B G" },
  ],
  creator: "Team Code Catalyst (Suresh Kishor Savant & Gahana B G)",
  publisher: "HackToBerFest 2026 (VVCE)",
  other: {
    "provenance:team": "Code Catalyst",
    "provenance:authors": "Suresh Kishor Savant, Gahana B G",
    "provenance:event": "HackToBerFest 2026 VVCE",
    "provenance:fingerprint": "e8aeb05e01109b19cdc176f391fc72b79a7f6a54b2d3919",
    "provenance:canonical": "https://github.com/HackToBerFest-VVCE/t2c1-code-catalyst",
  },
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
        {/*
          PROVENANCE ATTRIBUTION & ORIGINAL AUTHOR CERTIFICATION:
          Project: YatraSetu (ProofTrip)
          Original Creators: Suresh Kishor Savant & Gahana B G
          Team: Code Catalyst | HackToBerFest 2026 (VVCE)
          Track: Web3, AI & Smart Tourism Infrastructure on Solana
          Genesis SHA-256: e8aeb05e01109b19cdc176f391fc72b79a7f6a54b2d3919
        */}
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
