"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Sparkles,
  UserPlus,
  Plus,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Copy,
  Layers,
  Compass,
  Wallet,
} from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../../lib/i18n";

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

interface AccountProfile {
  name: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  country: string;
  timeZone: string;
  welcomeMessage: string;
  avatarUrl: string;
}

const DEFAULT_PROFILE: AccountProfile = {
  name: "Can Saas",
  language: "English",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  country: "Indonesia",
  timeZone: "Eastern - US & Canada",
  welcomeMessage:
    "Welcome to my scheduling page. Please follow the instruction to add an event calendar",
  avatarUrl: "",
};

const COUNTRIES = [
  "Indonesia",
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Canada",
  "Singapore",
  "United Arab Emirates",
  "Switzerland",
  "Italy",
  "Spain",
];

const TIMEZONES = [
  { label: "Eastern - US & Canada (UTC-05:00)", offset: -5 },
  { label: "IST - India Standard Time (UTC+05:30)", offset: 5.5 },
  { label: "WIB - Western Indonesia (UTC+07:00)", offset: 7 },
  { label: "GMT - London / UK (UTC+00:00)", offset: 0 },
  { label: "CET - Central Europe (UTC+01:00)", offset: 1 },
  { label: "PST - Pacific Time (UTC-08:00)", offset: -8 },
  { label: "SGT - Singapore / Malaysia (UTC+08:00)", offset: 8 },
  { label: "JST - Japan Standard Time (UTC+09:00)", offset: 9 },
];

export default function AccountPage() {
  const [profile, setProfile] = useState<AccountProfile>(DEFAULT_PROFILE);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedProgramId, setCopiedProgramId] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yatrasetu_account_profile");
      if (saved) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // fallback to default
    }
  }, []);

  // Update real-time clock based on selected time format and time zone
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const tzObj = TIMEZONES.find((t) => t.label === profile.timeZone) || TIMEZONES[0];
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetDate = new Date(utcMs + tzObj.offset * 3600000);

      const hours = targetDate.getHours();
      const minutes = String(targetDate.getMinutes()).padStart(2, "0");
      const seconds = String(targetDate.getSeconds()).padStart(2, "0");

      if (profile.timeFormat === "12h") {
        const ampm = hours >= 12 ? "PM" : "AM";
        const h12 = hours % 12 || 12;
        setCurrentTimeStr(`${h12}:${minutes}:${seconds} ${ampm}`);
      } else {
        const h24 = String(hours).padStart(2, "0");
        setCurrentTimeStr(`${h24}:${minutes}:${seconds}`);
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [profile.timeZone, profile.timeFormat]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("yatrasetu_account_profile", JSON.stringify(profile));
      setSaveStatus("Changes saved successfully!");
      setTimeout(() => setSaveStatus(""), 3500);
    } catch {
      setSaveStatus("Error saving profile to storage.");
      setTimeout(() => setSaveStatus(""), 3500);
    }
  };

  const handleCancel = () => {
    try {
      const saved = localStorage.getItem("yatrasetu_account_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        setProfile(DEFAULT_PROFILE);
      }
      setSaveStatus("Form reset to saved values.");
      setTimeout(() => setSaveStatus(""), 2500);
    } catch {
      setProfile(DEFAULT_PROFILE);
    }
  };

  const handleDeleteAccount = () => {
    try {
      localStorage.removeItem("yatrasetu_account_profile");
      setProfile(DEFAULT_PROFILE);
      setShowDeleteModal(false);
      setSaveStatus("Account profile reset to default defaults.");
      setTimeout(() => setSaveStatus(""), 3500);
    } catch {
      setShowDeleteModal(false);
    }
  };

  const copyProgramId = () => {
    navigator.clipboard.writeText("A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN");
    setCopiedProgramId(true);
    setTimeout(() => setCopiedProgramId(false), 2000);
  };

  return (
    <div className="account-page-root">
      {/* ── Top Architectural Navigation ── */}
      <header className="navbar" role="banner">
        <div className="nav-container">
          <div className="nav-editorial-left">
            <Link href="/" className="nav-editorial-brand" aria-label="YatraSetu Home">
              <span className="brand-word-en">Yatra</span>
              <span className="brand-word-hi">Setu</span>
            </Link>
          </div>

          <div className="nav-editorial-right">
            <Link href="/" className="nav-editorial-link">
              <ArrowLeft size={13} style={{ marginRight: 4 }} />
              RETURN TO SITE
            </Link>
            <div className="nav-editorial-link active">ACCOUNT DETAILS</div>
          </div>
        </div>

        <div className="nav-curve-wrapper" aria-hidden="true">
          <svg
            className="nav-curve-svg"
            viewBox="0 0 1440 28"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0 L1440 0 L1440 1 C1060 26 380 26 0 1 Z"
              fill="rgba(242, 237, 228, 0.98)"
            />
          </svg>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="account-main-content">
        {/* Header Bar matching Reference Image 3 */}
        <div className="account-details-header">
          <div className="account-details-title-row">
            <h1 className="account-details-title">Account Details</h1>
          </div>

          {/* Action buttons on the right side of header (matching Image 3) */}
          <div className="account-header-actions">
            <button
              type="button"
              className="account-btn-look-around"
              onClick={() => setShowTourModal(true)}
            >
              <Sparkles size={16} className="sparkle-icon-pink" />
              <span>Take a look around</span>
            </button>

            <button
              type="button"
              className="account-btn-invite"
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus size={15} />
              <span>Invite user</span>
            </button>

            <Link href="/" className="account-btn-create">
              <Plus size={16} />
              <span>Create</span>
            </Link>

            <div className="account-brand-mark" title="YatraSetu Travel Attestation">
              <span className="brand-mark-text">YS</span>
            </div>
          </div>
        </div>

        {/* White Editorial Card Container matching Reference Image 3 */}
        <div className="account-card-frame">
          {/* Avatar Upload / Remove Row */}
          <div className="account-avatar-section">
            <div className="avatar-preview-wrapper">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt="Account Avatar"
                  className="avatar-image-circle"
                />
              ) : (
                <div className="avatar-placeholder-circle">
                  <span className="avatar-initials">
                    {profile.name
                      ? profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "YS"}
                  </span>
                </div>
              )}
            </div>

            <div className="avatar-actions-col">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="account-btn-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                <span>Upload</span>
              </button>

              <button
                type="button"
                className="account-btn-remove"
                onClick={handleRemoveAvatar}
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Form Grid matching Reference Image 3 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="account-form-grid"
          >
            {/* Row 1: Name and Language */}
            <div className="account-field-group">
              <label className="account-field-label" htmlFor="account-name">
                Name
              </label>
              <input
                id="account-name"
                name="name"
                type="text"
                className="account-field-input"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Can Saas"
              />
            </div>

            <div className="account-field-group">
              <label className="account-field-label" htmlFor="account-language">
                Language
              </label>
              <div className="account-select-wrapper">
                <select
                  id="account-language"
                  name="language"
                  className="account-field-select"
                  value={profile.language}
                  onChange={handleInputChange}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.name}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>

            {/* Row 2: Date Format, Time Format, and Country */}
            <div className="account-field-group-row">
              <div className="account-field-subgroup">
                <label className="account-field-label" htmlFor="account-date-format">
                  Date Format
                </label>
                <div className="account-select-wrapper">
                  <select
                    id="account-date-format"
                    name="dateFormat"
                    className="account-field-select"
                    value={profile.dateFormat}
                    onChange={handleInputChange}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>

              <div className="account-field-subgroup">
                <label className="account-field-label" htmlFor="account-time-format">
                  Time Format
                </label>
                <div className="account-select-wrapper">
                  <select
                    id="account-time-format"
                    name="timeFormat"
                    className="account-field-select"
                    value={profile.timeFormat}
                    onChange={handleInputChange}
                  >
                    <option value="24h">24h</option>
                    <option value="12h">12h</option>
                  </select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>
            </div>

            <div className="account-field-group">
              <label className="account-field-label" htmlFor="account-country">
                Country
              </label>
              <div className="account-select-wrapper">
                <select
                  id="account-country"
                  name="country"
                  className="account-field-select"
                  value={profile.country}
                  onChange={handleInputChange}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>

            {/* Row 3: Time Zone with Live Current Time & Welcome Message */}
            <div className="account-field-group">
              <div className="field-label-with-time">
                <label className="account-field-label" htmlFor="account-time-zone">
                  Time Zone
                </label>
                <span className="live-current-time-text">
                  Current Time: {currentTimeStr || "22:37"}
                </span>
              </div>
              <div className="account-select-wrapper">
                <select
                  id="account-time-zone"
                  name="timeZone"
                  className="account-field-select"
                  value={profile.timeZone}
                  onChange={handleInputChange}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.label} value={tz.label}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>

            <div className="account-field-group">
              <label className="account-field-label" htmlFor="account-welcome-msg">
                Welcome Message
              </label>
              <textarea
                id="account-welcome-msg"
                name="welcomeMessage"
                rows={2}
                className="account-field-textarea"
                value={profile.welcomeMessage}
                onChange={handleInputChange}
                placeholder="Welcome to my scheduling page. Please follow the instruction to add an event calendar"
              />
            </div>

            {/* Notification / Toast Message */}
            {saveStatus && (
              <div className="account-toast-msg" role="status" aria-live="polite">
                <Check size={14} />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* Bottom Button Row matching Reference Image 3 */}
            <div className="account-form-bottom-row">
              <div className="bottom-left-actions">
                <button
                  type="submit"
                  className="account-btn-save-change"
                >
                  Save Change
                </button>
                <button
                  type="button"
                  className="account-btn-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

              <div className="bottom-right-actions">
                <button
                  type="button"
                  className="account-btn-delete-account"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Seamless Web3 & Solana Devnet Hub Integration ── */}
        <div className="account-web3-section">
          <div className="web3-hub-card">
            <div className="web3-hub-header">
              <div className="web3-hub-title-col">
                <span className="web3-eyebrow">SOLANA DEVNET HUB · DECENTRALIZED IDENTITY</span>
                <h3 className="web3-title">Phantom &amp; Web3 Wallet Connection</h3>
                <p className="web3-sub">
                  Connect your Solana Devnet wallet to sign tamper-proof cultural travel itineraries and inspect on-chain tourist protection agreements.
                </p>
              </div>
              <div className="web3-wallet-button-col">
                <WalletMultiButton />
              </div>
            </div>

            <div className="web3-cluster-bar">
              <div className="cluster-stat">
                <span className="cluster-label">CLUSTER STATUS</span>
                <span className="cluster-val green">
                  <span className="pulsing-green-dot" />
                  Devnet Healthy (400ms)
                </span>
              </div>

              <div className="cluster-stat">
                <span className="cluster-label">RPC ENDPOINT</span>
                <span className="cluster-val font-mono">api.devnet.solana.com</span>
              </div>

              <div className="cluster-stat">
                <span className="cluster-label">COMMITMENT</span>
                <span className="cluster-val font-mono">confirmed</span>
              </div>

              <div className="cluster-stat">
                <span className="cluster-label">TOURISM PROGRAM ID</span>
                <div className="program-id-copy-row">
                  <span className="cluster-val font-mono">A7yU8i...VSzN</span>
                  <button
                    type="button"
                    className="btn-cluster-copy"
                    onClick={copyProgramId}
                    title="Copy Program ID"
                  >
                    {copiedProgramId ? <Check size={12} color="#2D5A43" /> : <Copy size={12} />}
                  </button>
                  <a
                    href="https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cluster-link"
                    title="View on Solana Explorer"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Minimal Editorial Footer Bar ── */}
      <footer className="minimal-editorial-footer" role="contentinfo">
        <div className="footer-single-bar-container">
          <div className="footer-status-pill">
            <span className="status-dot-live" />
            <span className="status-label">Now in India</span>
            <span className="status-time">[{currentTimeStr || "Live IST"}]</span>
          </div>
          <div className="footer-copy-text">
            Shubh Yatra (शुभ यात्रा) © 2026 YatraSetu · Certified on Solana Devnet · All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── Invite User Modal ── */}
      {showInviteModal && (
        <div className="account-modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="account-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title">Invite Travel Companion</h3>
            <p className="dialog-sub">
              Invite a fellow traveler or family member to co-manage itineraries and transit pass attestations.
            </p>
            <div style={{ margin: "18px 0" }}>
              <label className="account-field-label">Companion Email Address</label>
              <input
                type="email"
                className="account-field-input"
                placeholder="companion@example.com"
                autoFocus
              />
            </div>
            <div className="dialog-actions-row">
              <button
                type="button"
                className="account-btn-save-change"
                onClick={() => {
                  setShowInviteModal(false);
                  setSaveStatus("Invitation sent successfully!");
                  setTimeout(() => setSaveStatus(""), 3000);
                }}
              >
                Send Invite
              </button>
              <button
                type="button"
                className="account-btn-cancel"
                onClick={() => setShowInviteModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tour Modal ── */}
      {showTourModal && (
        <div className="account-modal-backdrop" onClick={() => setShowTourModal(false)}>
          <div className="account-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title">Welcome to YatraSetu Account Hub</h3>
            <p className="dialog-sub">
              Here you can configure your personalized travel preferences, view your connected Solana Devnet identity, inspect transit attestations, and sync offline itineraries.
            </p>
            <div style={{ margin: "16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Custom time format (24h/12h) &amp; live time zone sync</span>
              </div>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Multi-lingual support across 11 Indian and global languages</span>
              </div>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Decentralized Web3 wallet attestation on Solana Devnet</span>
              </div>
            </div>
            <div className="dialog-actions-row">
              <button
                type="button"
                className="account-btn-save-change"
                onClick={() => setShowTourModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="account-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="account-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title" style={{ color: "#991B1B" }}>
              Reset Account Details?
            </h3>
            <p className="dialog-sub">
              This will reset all your saved local account details, timezone preferences, and custom avatar. This action cannot be undone.
            </p>
            <div className="dialog-actions-row" style={{ marginTop: 24 }}>
              <button
                type="button"
                className="account-btn-delete-account"
                onClick={handleDeleteAccount}
              >
                Confirm Delete
              </button>
              <button
                type="button"
                className="account-btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
