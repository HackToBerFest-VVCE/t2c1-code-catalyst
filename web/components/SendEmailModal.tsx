"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle, X, AlertCircle, Eye, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { ItineraryPlan } from "@/lib/offline-pass-generator";
import CopyAddress from "./CopyAddress";

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
        // Surface a clear actionable error for missing API key
        if (res.status === 503) {
          throw new Error(
            "Email service not configured yet. Add your RESEND_API_KEY to .env.local and restart the server."
          );
        }
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
    const summary = `Touristमत्रम् Certified Itinerary for ${plan.city} (${plan.numDays} Days)\n` +
      `Total Budget: ${plan.totalBudget.toLocaleString()} ${plan.currency}\n` +
      `Transit Pass: ${plan.transitPass}\n` +
      `Certificate: ${certificateId || plan.certificateId || "CERTIFIED"}\n\n` +
      plan.days.map(d => `Day ${d.dayNumber} (${d.theme}):\n` + d.stops.map(s => `  • ${s.time} - ${s.name} (${s.costDisplay})`).join("\n")).join("\n\n") +
      `\n\nTourist Helpline: 1363 | Emergency: 112`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="persona-modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="persona-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 540, position: "relative" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, background: "none", border: "none",
            color: "var(--gray-light)", cursor: "pointer", padding: 6, borderRadius: "50%",
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {!successData ? (
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(234, 67, 53, 0.15)", border: "1px solid rgba(234, 67, 53, 0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Mail size={20} color="#EA4335" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#FFF" }}>Send Itinerary to Gmail</h3>
                <p style={{ fontSize: 12, color: "var(--gray-light)" }}>
                  Receive the complete schedule, voucher codes & offline emergency pass directly in your inbox.
                </p>
              </div>
            </div>

            {/* Quick Trip Snapshot */}
            <div style={{
              background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
              borderRadius: 12, padding: "12px 16px", margin: "18px 0", fontSize: 13,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "var(--gray-light)" }}>Destination:</span>
                <strong style={{ color: "#FFF" }}>{cityName}, India 🇮🇳</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "var(--gray-light)" }}>Duration & Budget:</span>
                <span style={{ color: "var(--yellow)", fontWeight: 700 }}>
                  {plan.numDays} Days · {plan.totalBudget.toLocaleString()} {plan.currency}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--gray-light)" }}>Transit Pass:</span>
                <span style={{ color: "#FFF", fontSize: 12 }}>{plan.transitPass.slice(0, 34)}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--gray-light)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Recipient Email (Gmail / Personal / Work)
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
                      width: "100%", background: "#111", border: "1.5px solid var(--dark-border)",
                      borderRadius: 10, padding: "12px 14px", color: "#FFF", fontSize: 14,
                      outline: "none", transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--yellow)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
                  />
                </div>
                <div style={{ fontSize: 11, color: "var(--gray-light)", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <Sparkles size={12} color="var(--yellow)" />
                  <span>Optimized for Gmail mobile and desktop with instant offline caching and star view.</span>
                </div>
              </div>

              {error && (
                <div style={{
                  background: "rgba(224, 85, 85, 0.12)", border: "1px solid rgba(224, 85, 85, 0.4)",
                  borderRadius: 8, padding: "10px 12px", color: "#FF7B72", fontSize: 12.5,
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-dark"
                  style={{ flex: 1, padding: "12px", justifyContent: "center" }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-hero-yellow"
                  style={{ flex: 2, padding: "12px", justifyContent: "center" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Dispatching Itinerary...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send to Gmail</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(76, 175, 125, 0.15)", border: "2px solid #4CAF7D",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px auto",
            }}>
              <CheckCircle size={32} color="#4CAF7D" />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#FFF", marginBottom: 6 }}>
              Itinerary Sent to Your Gmail!
            </h3>
            <p style={{ fontSize: 13, color: "var(--gray-light)", marginBottom: 18, lineHeight: 1.5 }}>
              A certified copy for <strong style={{ color: "#FFF" }}>{cityName}</strong> has been dispatched to:
              <br />
              <strong style={{ color: "var(--yellow)", fontSize: 14 }}>{successData.sentTo}</strong>
            </p>

            <div style={{
              background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
              borderRadius: 12, padding: "14px", textAlign: "left", fontSize: 12,
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                <span style={{ color: "var(--gray-light)" }}>Status:</span>
                <span style={{ color: "var(--success)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle size={13} color="var(--success)" /> Delivered to Inbox
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: "var(--gray-light)" }}>Certificate ID:</span>
                <CopyAddress
                  value={certificateId || plan?.certificateId || "CERT-VERIFIED"}
                  label="Itinerary Certificate ID"
                  startChars={8}
                  endChars={6}
                  colorTheme="gold"
                  compact
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--gray-light)" }}>Delivery Notice:</span>
                <span style={{ color: "#FFF", fontSize: 11 }}>{successData.notice}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn-dark"
                style={{ flex: 1, padding: "10px", fontSize: 12.5, justifyContent: "center" }}
              >
                <Eye size={14} />
                <span>{showPreview ? "Hide Preview" : "Preview Email"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="btn-dark"
                style={{ flex: 1, padding: "10px", fontSize: 12.5, justifyContent: "center" }}
              >
                {copied ? <Check size={14} color="#4CAF7D" /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy Summary"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-hero-yellow"
                style={{ width: "100%", padding: "12px", marginTop: 8, justifyContent: "center" }}
              >
                <span>Done</span>
              </button>
            </div>

            {/* Embedded Email HTML Preview */}
            {showPreview && successData.previewHtml && (
              <div style={{
                marginTop: 18, textAlign: "left", border: "1px solid var(--dark-border)",
                borderRadius: 10, overflow: "hidden", maxHeight: 350, overflowY: "auto",
                background: "#0D1117",
              }}>
                <div style={{
                  padding: "8px 12px", background: "var(--dark-elevated)",
                  borderBottom: "1px solid var(--dark-border)", fontSize: 11,
                  fontWeight: 700, color: "var(--yellow)", display: "flex", justifyContent: "space-between",
                }}>
                  <span>Dispatched HTML Email Preview</span>
                  <span style={{ color: "var(--gray-light)" }}>To: {successData.sentTo}</span>
                </div>
                <iframe
                  srcDoc={successData.previewHtml}
                  title="Email Preview"
                  style={{ width: "100%", height: 300, border: "none", background: "#0D1117" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
