"use client";

import React, { useEffect, useCallback } from "react";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  X,
  Wallet,
  ShieldCheck,
  Headset,
  IndianRupee,
  Link as LinkIcon,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  PhoneCall,
  UserCheck,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import CopyAddress from "./CopyAddress";
import type { MainTab } from "../app/page";
import type { LanguageCode } from "../lib/i18n";
import { SUPPORTED_LANGUAGES } from "../lib/i18n";

// Client-only dynamic import of WalletMultiButton to prevent Next.js SSR hydration mismatches
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <button className="wallet-adapter-button" style={{ opacity: 0.8 }}>
        Loading Wallet...
      </button>
    ),
  }
);

export interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  isDevnetHealthy: boolean;
  savedRecordsCount: number;
  onOpenLanguageModal: () => void;
  onOpenPersonaModal: () => void;
  language: LanguageCode;
  travelerType: "indian" | "foreign" | null;
  foreignCountry: string;
  selectedCurrency: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  isDevnetHealthy,
  savedRecordsCount,
  onOpenLanguageModal,
  onOpenPersonaModal,
  language,
  travelerType,
  foreignCountry,
  selectedCurrency,
}) => {
  const wallet = useWallet();

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentLangName =
    SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || "English";
  const PROGRAM_ID =
    process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID ||
    "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";

  return (
    <div
      className="account-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="account-modal-container">
        {/* Header */}
        <div className="account-modal-header">
          <div>
            <div className="account-modal-kicker">
              <span>Solana Devnet Hub</span>
              <span className="account-kicker-dot" />
              <span>Decentralized Identity</span>
            </div>
            <h2 id="account-modal-title" className="account-modal-title">
              Account &amp; Travel Hub
            </h2>
            <p className="account-modal-subtitle">
              Manage your Web3 credentials, inspect on-chain travel contracts, consult verified AI concierges, and access emergency helplines.
            </p>
          </div>
          <button
            type="button"
            className="account-modal-close-btn"
            onClick={onClose}
            aria-label="Close Account Details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="account-modal-body">
          {/* Quick Direct Link to Dedicated Account Page */}
          <div style={{
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            borderRadius: 14,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={18} color="#2563eb" />
              <div>
                <div style={{ fontSize: "0.88rem", color: "var(--color-notte)", fontWeight: 700 }}>
                  Looking for full Account Profile &amp; AI Agents Settings?
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-oliva)", marginTop: 2 }}>
                  Edit your name, country, date/time format, welcome message, and view assigned concierges in separate columns.
                </div>
              </div>
            </div>
            <NextLink
              href="/account"
              onClick={onClose}
              className="account-btn-save-change"
              style={{
                height: 36,
                padding: "0 16px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <span>Open Dedicated Account Page</span>
              <ExternalLink size={13} />
            </NextLink>
          </div>

          {/* 1. Phantom / Solflare Wallet Section */}
          <div className="account-card account-card--wallet">
            <div className="account-card-header">
              <div className="account-card-icon-wrap">
                <Wallet size={18} color="var(--color-ottone)" />
              </div>
              <div className="account-card-title-group">
                <div className="account-card-heading-row">
                  <h3 className="account-card-title">Phantom &amp; Web3 Wallet</h3>
                  {wallet.connected ? (
                    <span className="account-badge account-badge--verified">
                      <span className="account-badge-dot" /> Connected to Devnet
                    </span>
                  ) : (
                    <span className="account-badge account-badge--neutral">
                      Disconnected
                    </span>
                  )}
                </div>
                <p className="account-card-desc">
                  {wallet.connected
                    ? "Authenticated identity on Solana. Used to sign immutable trip records and verify travel passes."
                    : "Connect Phantom or Solflare to unlock cryptographic itinerary attestation and on-chain records."}
                </p>
              </div>
            </div>

            <div className="account-wallet-action-row">
              <div className="account-wallet-btn-wrap">
                <WalletMultiButton />
              </div>

              {wallet.connected && wallet.publicKey && (
                <div className="account-address-box">
                  <span className="account-address-label">Active Address:</span>
                  <CopyAddress
                    value={wallet.publicKey.toBase58()}
                    label="Wallet Address"
                    colorTheme="emerald"
                    compact
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. Solana Devnet Network & Program Registry */}
          <div className="account-card">
            <div className="account-card-header">
              <div className="account-card-icon-wrap">
                <Layers size={18} color="var(--color-ottone)" />
              </div>
              <div className="account-card-title-group">
                <div className="account-card-heading-row">
                  <h3 className="account-card-title">Solana Devnet Cluster &amp; Smart Contract</h3>
                  <span
                    className={`account-badge ${
                      isDevnetHealthy
                        ? "account-badge--verified"
                        : "account-badge--danger"
                    }`}
                  >
                    <span
                      className="account-badge-dot"
                      style={{
                        background: isDevnetHealthy
                          ? "var(--color-verified)"
                          : "#E53935",
                      }}
                    />
                    {isDevnetHealthy ? "Devnet Healthy (400ms)" : "Devnet Degraded"}
                  </span>
                </div>
                <p className="account-card-desc">
                  Tourism Registry and Itinerary PDA Program running on Solana Devnet with zero-fee smart contract commitments.
                </p>
              </div>
            </div>

            <div className="account-devnet-details">
              <div className="account-detail-row">
                <span className="account-detail-label">Tourism Program ID:</span>
                <CopyAddress
                  value={PROGRAM_ID}
                  label="Solana Tourism Program ID"
                  colorTheme="gold"
                  compact
                  explorerUrl={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
                />
              </div>

              <div className="account-detail-stats">
                <div className="account-stat-chip">
                  <span className="stat-label">RPC Endpoint</span>
                  <span className="stat-value">api.devnet.solana.com</span>
                </div>
                <div className="account-stat-chip">
                  <span className="stat-label">Commitment</span>
                  <span className="stat-value">confirmed</span>
                </div>
                <div className="account-stat-chip">
                  <span className="stat-label">Registry Standard</span>
                  <span className="stat-value">Anchor IDL v0.30</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Core Platforms Grid (Concierge, Price Checker, Safety, Records) */}
          <div className="account-nav-grid">
            {/* AI Concierge */}
            <div
              className="account-nav-tile"
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTab("agents");
                onClose();
              }}
            >
              <div className="account-tile-top">
                <div className="account-tile-icon">
                  <Headset size={18} color="var(--color-ottone)" />
                </div>
                <span className="account-tile-tag">4 Agents Live</span>
              </div>
              <h4 className="account-tile-title">AI Concierge Directory</h4>
              <p className="account-tile-desc">
                Consult autonomous Solana agents with on-chain reputation scores for heritage, safety, and budgeting.
              </p>
              <div className="account-tile-action">
                <span>Consult Agents</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Fair Price Checker */}
            <div
              className="account-nav-tile"
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTab("price");
                onClose();
              }}
            >
              <div className="account-tile-top">
                <div className="account-tile-icon">
                  <IndianRupee size={18} color="var(--color-ottone)" />
                </div>
                <span className="account-tile-tag">Verified Benchmarks</span>
              </div>
              <h4 className="account-tile-title">Fair Price Checker</h4>
              <p className="account-tile-desc">
                Real-time anti-scam rate cards for auto-rickshaws, city taxis, regional meals, and entry tariffs across India.
              </p>
              <div className="account-tile-action">
                <span>Check Rates</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Travel Safety Hub */}
            <div
              className="account-nav-tile"
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTab("safety");
                onClose();
              }}
            >
              <div className="account-tile-top">
                <div className="account-tile-icon">
                  <ShieldCheck size={18} color="var(--color-verified)" />
                </div>
                <span className="account-tile-tag">24/7 Helplines</span>
              </div>
              <h4 className="account-tile-title">Safety &amp; Emergency Hub</h4>
              <p className="account-tile-desc">
                Instant access to 112 (National Emergency), 1363 (Tourist Helpline), 1091 (Women Safety), and hospital contacts.
              </p>
              <div className="account-tile-action">
                <span>View Emergency Contacts</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Certified Records */}
            <div
              className="account-nav-tile"
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTab("records");
                onClose();
              }}
            >
              <div className="account-tile-top">
                <div className="account-tile-icon">
                  <LinkIcon size={18} color="var(--color-ottone)" />
                </div>
                <span className="account-tile-tag">
                  {savedRecordsCount > 0
                    ? `${savedRecordsCount} Attestations`
                    : "On-Chain Ledger"}
                </span>
              </div>
              <h4 className="account-tile-title">Certified Records</h4>
              <p className="account-tile-desc">
                Access your cryptographically signed trip records, Solana transaction signatures, and QR verification passes.
              </p>
              <div className="account-tile-action">
                <span>Open Records</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* 4. Language & Traveler Persona Controls */}
          <div className="account-preferences-bar">
            {/* Language Trigger */}
            <button
              type="button"
              className="account-pref-btn"
              onClick={() => {
                onOpenLanguageModal();
                onClose();
              }}
            >
              <div className="account-pref-icon">
                <Globe size={16} color="var(--color-ottone)" />
              </div>
              <div className="account-pref-text">
                <span className="pref-label">Display Language</span>
                <span className="pref-value">{currentLangName} (11 Available)</span>
              </div>
              <ChevronRight size={16} className="pref-arrow" />
            </button>

            {/* Traveler Persona Trigger */}
            <button
              type="button"
              className="account-pref-btn"
              onClick={() => {
                onOpenPersonaModal();
                onClose();
              }}
            >
              <div className="account-pref-icon">
                <UserCheck size={16} color="var(--color-ottone)" />
              </div>
              <div className="account-pref-text">
                <span className="pref-label">Traveler Persona</span>
                <span className="pref-value">
                  {travelerType === "indian"
                    ? "🇮🇳 Indian Citizen"
                    : travelerType === "foreign"
                    ? `Foreign Traveler · ${foreignCountry}`
                    : "Citizen Status · Configure"}
                </span>
              </div>
              <ChevronRight size={16} className="pref-arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
