"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  X,
  AlertCircle,
  Eye,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { ItineraryPlan } from "@/lib/offline-pass-generator";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ItineraryPlan | null;
  cityName: string;
  travelerType: "indian" | "foreign";
  foreignCountry?: string;
  certificateId?: string;
}

export function SendEmailModal({
  isOpen,
  onClose,
  plan,
  cityName,
  travelerType,
  foreignCountry,
  certificateId,
}: SendEmailModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfigTips, setShowConfigTips] = useState(false);

  if (!isOpen || !plan) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: cleanEmail,
          cityName,
          plan,
          travelerType,
          foreignCountry,
          certificateId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to deliver email. Please try again.");
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while sending.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!plan) return;
    const summary =
      `Touristमत्रम् Certified Itinerary for ${plan.city} (${plan.numDays} Days)\n` +
      `Total Budget: ${plan.totalBudget?.toLocaleString()} ${plan.currency}\n` +
      `Transit Pass: ${plan.transitPass}\n` +
      `Certificate: ${certificateId || plan.certificateId || "CERTIFIED"}\n\n` +
      plan.days
        .map(
          (d) =>
            `Day ${d.dayNumber} (${d.theme}):\n` +
            d.stops.map((s) => `  • ${s.time} - ${s.name} (${s.costDisplay})`).join("\n")
        )
        .join("\n\n") +
      `\n\n🚨 24/7 Tourist Helpline: 1363 | Emergency: 112`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenDirectGmail = () => {
    const cleanEmail = email.trim() || "";
    const cert = certificateId || plan.certificateId || "CERT-VERIFIED";
    const subject = `Your Verified Itinerary for ${cityName} · Touristमत्रम् [${cert}]`;
    const summary =
      `Touristमत्रम् Certified Itinerary for ${plan.city} (${plan.numDays} Days)\n` +
      `Total Budget: ${plan.totalBudget?.toLocaleString()} ${plan.currency}\n` +
      `Transit Pass: ${plan.transitPass}\n` +
      `Certificate: ${cert}\n\n` +
      plan.days
        .map(
          (d) =>
            `Day ${d.dayNumber} (${d.theme}):\n` +
            d.stops.map((s) => `  • ${s.time} - ${s.name} (${s.costDisplay})`).join("\n")
        )
        .join("\n\n") +
      `\n\n🚨 24/7 Tourist Helpline: 1363 | Emergency: 112`;

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      cleanEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
    window.open(url, "_blank");
  };

  const handleDownloadEML = () => {
    if (!successData?.previewHtml) return;
    const emlContent = [
      `From: "Touristमत्रम् Concierge" <itinerary@touristmatram.in>`,
      `To: ${successData.sentTo}`,
      `Subject: ${successData.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      successData.previewHtml,
    ].join("\r\n");

    const blob = new Blob([emlContent], { type: "message/rfc822" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TouristMatram-${cityName}-Itinerary.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMethodBadge = (via: string) => {
    if (via === "resend_api") {
      return {
        label: "Direct Cloud Delivery (Resend API)",
        color: "#4CAF7D",
        bg: "rgba(76, 175, 125, 0.12)",
      };
    }
    if (via === "gmail_smtp") {
      return {
        label: "Direct Gmail SMTP Dispatch",
        color: "#4CAF7D",
        bg: "rgba(76, 175, 125, 0.12)",
      };
    }
    if (via === "custom_smtp") {
      return {
        label: "Custom SMTP Gateway",
        color: "#4CAF7D",
        bg: "rgba(76, 175, 125, 0.12)",
      };
    }
    return {
      label: "Live Test Inbox + 1-Click Gmail Sync",
      color: "#F8D057",
      bg: "rgba(248, 208, 87, 0.12)",
    };
  };

  return (
    <div className="persona-modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="persona-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560, position: "relative" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "var(--gray-light)",
            cursor: "pointer",
            padding: 6,
            borderRadius: "50%",
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {!successData ? (
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(234, 67, 53, 0.15)",
                  border: "1px solid rgba(234, 67, 53, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={20} color="#EA4335" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#FFF" }}>Send Itinerary to Gmail</h3>
                <p style={{ fontSize: 12, color: "var(--gray-light)" }}>
                  Receive your verified travel itinerary, day-by-day stops, vouchers & helpline card.
                </p>
              </div>
            </div>

            {/* Quick Trip Snapshot */}
            <div
              style={{
                background: "var(--dark-elevated)",
                border: "1px solid var(--dark-border)",
                borderRadius: 12,
                padding: "12px 16px",
                margin: "18px 0",
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "var(--gray-light)" }}>Destination:</span>
                <strong style={{ color: "#FFF" }}>{cityName}, India 🇮🇳</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "var(--gray-light)" }}>Duration & Budget:</span>
                <span style={{ color: "var(--yellow)", fontWeight: 700 }}>
                  {plan.numDays} Days · {plan.totalBudget?.toLocaleString()} {plan.currency}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--gray-light)" }}>Transit Pass:</span>
                <span style={{ color: "#FFF", fontSize: 12 }}>{plan.transitPass?.slice(0, 34)}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--gray-light)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Recipient Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. traveler@gmail.com"
                    autoFocus
                    required
                    style={{
                      width: "100%",
                      background: "#111",
                      border: "1.5px solid var(--dark-border)",
                      borderRadius: 10,
                      padding: "12px 14px",
                      color: "#FFF",
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--yellow)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
                  />
                </div>
                <div style={{ fontSize: 11, color: "var(--gray-light)", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                  <span>✨ Multi-language ready with encrypted Solana hash attestation.</span>
                  <button
                    type="button"
                    onClick={() => setShowConfigTips(!showConfigTips)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--yellow)",
                      cursor: "pointer",
                      fontSize: 11,
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Delivery Config
                  </button>
                </div>
              </div>

              {showConfigTips && (
                <div
                  style={{
                    background: "rgba(248, 208, 87, 0.05)",
                    border: "1px dashed rgba(248, 208, 87, 0.3)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 16,
                    fontSize: 11.5,
                    color: "var(--gray-light)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "var(--yellow)" }}>Email Delivery Methods Supported:</strong>
                  <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    <li><strong>Resend API</strong>: Add <code>RESEND_API_KEY=re_...</code> in <code>.env.local</code>.</li>
                    <li><strong>Gmail SMTP</strong>: Add <code>GMAIL_USER</code> and <code>GMAIL_APP_PASSWORD</code> in <code>.env.local</code>.</li>
                    <li><strong>1-Click Gmail</strong>: Click <em>Open in Gmail Web</em> below to send directly from your personal inbox with zero setup!</li>
                  </ul>
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: "rgba(224, 85, 85, 0.12)",
                    border: "1px solid rgba(224, 85, 85, 0.4)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: "#FF7B72",
                    fontSize: 12.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={handleOpenDirectGmail}
                  className="btn-dark"
                  style={{ flex: 1, padding: "12px", justifyContent: "center", fontSize: 13 }}
                  title="Open draft immediately in your Gmail web client"
                >
                  <ExternalLink size={14} color="#EA4335" />
                  <span>Open in Gmail Web</span>
                </button>
                <button
                  type="submit"
                  className="btn-hero-yellow"
                  style={{ flex: 1.3, padding: "12px", justifyContent: "center" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Dispatch Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: "center", padding: "6px 0" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(76, 175, 125, 0.15)",
                border: "2px solid #4CAF7D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px auto",
              }}
            >
              <CheckCircle size={30} color="#4CAF7D" />
            </div>

            <h3 style={{ fontSize: 19, fontWeight: 900, color: "#FFF", marginBottom: 4 }}>
              Itinerary Dispatched Successfully!
            </h3>
            <p style={{ fontSize: 13, color: "var(--gray-light)", marginBottom: 16, lineHeight: 1.4 }}>
              A certified copy for <strong style={{ color: "#FFF" }}>{cityName}</strong> was prepared for:
              <br />
              <strong style={{ color: "var(--yellow)", fontSize: 14 }}>{successData.sentTo}</strong>
            </p>

            {/* Delivery Status Card */}
            <div
              style={{
                background: "var(--dark-elevated)",
                border: "1px solid var(--dark-border)",
                borderRadius: 12,
                padding: "12px 14px",
                textAlign: "left",
                fontSize: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <span style={{ color: "var(--gray-light)" }}>Gateway Mode:</span>
                {(() => {
                  const b = getMethodBadge(successData.dispatchedVia);
                  return (
                    <span
                      style={{
                        color: b.color,
                        background: b.bg,
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {b.label}
                    </span>
                  );
                })()}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "var(--gray-light)" }}>Certificate ID:</span>
                <span style={{ color: "var(--yellow)", fontFamily: "monospace" }}>
                  {certificateId || plan.certificateId || "CERT-VERIFIED"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--gray-light)" }}>Delivery Notice:</span>
                <span style={{ color: "#FFF", fontSize: 11, textAlign: "right", maxWidth: "65%" }}>
                  {successData.notice}
                </span>
              </div>
            </div>

            {/* Direct Gmail Action Banner */}
            <div
              style={{
                background: "rgba(234, 67, 53, 0.08)",
                border: "1px solid rgba(234, 67, 53, 0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div style={{ textAlign: "left", fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: "#FFF" }}>Want it in your personal Gmail right now?</div>
                <div style={{ fontSize: 11, color: "var(--gray-light)" }}>
                  Open pre-filled Gmail composer with 1 click:
                </div>
              </div>
              <a
                href={successData.gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#EA4335",
                  color: "#FFF",
                  fontWeight: 700,
                  fontSize: 12,
                  padding: "8px 14px",
                  borderRadius: 8,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                <ExternalLink size={13} />
                <span>Open Gmail</span>
              </a>
            </div>

            {/* Utility Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {successData.testInboxUrl && (
                <a
                  href={successData.testInboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark"
                  style={{
                    padding: "9px",
                    fontSize: 12,
                    justifyContent: "center",
                    textDecoration: "none",
                    borderColor: "rgba(248, 208, 87, 0.4)",
                  }}
                >
                  <ExternalLink size={13} color="var(--yellow)" />
                  <span>View Test Inbox</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleDownloadEML}
                className="btn-dark"
                style={{ padding: "9px", fontSize: 12, justifyContent: "center" }}
              >
                <Download size={13} />
                <span>Download .EML</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn-dark"
                style={{ padding: "9px", fontSize: 12, justifyContent: "center" }}
              >
                <Eye size={13} />
                <span>{showPreview ? "Hide Preview" : "Preview HTML"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="btn-dark"
                style={{ padding: "9px", fontSize: 12, justifyContent: "center" }}
              >
                {copied ? <Check size={13} color="#4CAF7D" /> : <Copy size={13} />}
                <span>{copied ? "Copied!" : "Copy Summary"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-hero-yellow"
              style={{ width: "100%", padding: "11px", justifyContent: "center" }}
            >
              <span>Done</span>
            </button>

            {/* Embedded Email HTML Preview */}
            {showPreview && successData.previewHtml && (
              <div
                style={{
                  marginTop: 16,
                  textAlign: "left",
                  border: "1px solid var(--dark-border)",
                  borderRadius: 10,
                  overflow: "hidden",
                  maxHeight: 320,
                  overflowY: "auto",
                  background: "#0D1117",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    background: "var(--dark-elevated)",
                    borderBottom: "1px solid var(--dark-border)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--yellow)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Generated Responsive Email Document</span>
                  <span style={{ color: "var(--gray-light)" }}>To: {successData.sentTo}</span>
                </div>
                <iframe
                  srcDoc={successData.previewHtml}
                  title="Email Preview"
                  style={{ width: "100%", height: 280, border: "none", background: "#0D1117" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
