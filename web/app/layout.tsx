import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "ProofTrip | Tourism AI Agent Registry",
  description: "Discover Solana-registered tourism agents and save verifiable trip plans.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
