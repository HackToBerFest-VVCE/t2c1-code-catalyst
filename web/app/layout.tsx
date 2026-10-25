import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ProofTrip — Tourism AI on Solana",
  description:
    "Discover verified travel agents on Solana, plan AI-powered itineraries, and commit tamper-evident trip records on Devnet.",
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
