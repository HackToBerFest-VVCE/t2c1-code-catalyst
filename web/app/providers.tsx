"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const SafeConnectionProvider = ConnectionProvider as unknown as React.ComponentType<{ endpoint: string; children: React.ReactNode }>;
const SafeWalletProvider = WalletProvider as unknown as React.ComponentType<{ wallets: any[]; autoConnect?: boolean; children: React.ReactNode }>;
const SafeWalletModalProvider = WalletModalProvider as unknown as React.ComponentType<{ children: React.ReactNode }>;

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

  // Wallets supporting the Solana Wallet Standard (Phantom, Solflare, etc.)
  // are detected and loaded automatically by @solana/wallet-adapter-react.
  const wallets = useMemo(() => [], []);

  return (
    <SafeConnectionProvider endpoint={endpoint}>
      <SafeWalletProvider wallets={wallets} autoConnect={false}>
        <SafeWalletModalProvider>{children}</SafeWalletModalProvider>
      </SafeWalletProvider>
    </SafeConnectionProvider>
  );
}
