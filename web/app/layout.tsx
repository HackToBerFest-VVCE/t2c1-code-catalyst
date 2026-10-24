import "./globals.css";

export const metadata = {
  title: "ProofTrip | Tourism AI Agent Registry",
  description: "Discover Solana-registered tourism agents and save verifiable trip plans.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
