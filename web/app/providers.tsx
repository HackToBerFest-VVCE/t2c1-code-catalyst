"use client";

import React, { useMemo, useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ScrollAnimationManager } from "../components/ScrollAnimationManager";
import { registerRuntimeProvenance } from "../lib/provenance";
import { ProvenanceModal } from "../components/ProvenanceModal";

const SafeConnectionProvider = ConnectionProvider as unknown as React.ComponentType<{ endpoint: string; children: React.ReactNode }>;
const SafeWalletProvider = WalletProvider as unknown as React.ComponentType<{ wallets: any[]; autoConnect?: boolean; children: React.ReactNode }>;
const SafeWalletModalProvider = WalletModalProvider as unknown as React.ComponentType<{ children: React.ReactNode }>;

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  useEffect(() => {
    // 1. Announce cryptographic provenance & register in window
    registerRuntimeProvenance();

    // 2. Add listener for custom provenance modal trigger
    const handleOpenProvenance = () => setIsProvenanceOpen(true);
    window.addEventListener("open-provenance-modal", handleOpenProvenance);

    // 3. Hotkey: Ctrl+Shift+P or Cmd+Shift+P opens author provenance certificate
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        setIsProvenanceOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-provenance-modal", handleOpenProvenance);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

  // Wallets supporting the Solana Wallet Standard (Phantom, Solflare, etc.)
  // are detected and loaded automatically by @solana/wallet-adapter-react.
  const wallets = useMemo(() => [], []);

  return (
    <SafeConnectionProvider endpoint={endpoint}>
      <SafeWalletProvider wallets={wallets} autoConnect={false}>
        <SafeWalletModalProvider>
          <ScrollAnimationManager />
          {children}
          <ProvenanceModal
            isOpen={isProvenanceOpen}
            onClose={() => setIsProvenanceOpen(false)}
          />
        </SafeWalletModalProvider>
      </SafeWalletProvider>
    </SafeConnectionProvider>
  );
}
