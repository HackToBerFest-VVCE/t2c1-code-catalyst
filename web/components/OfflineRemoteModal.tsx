"use client";

import React, { useState } from "react";
import { Download, Printer, WifiOff, X, CheckCircle, Eye, PhoneCall, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import {
  ItineraryPlan,
  downloadOfflinePassFile,
  printOfflinePass,
  generateOfflinePassHTML,
} from "@/lib/offline-pass-generator";

interface OfflineRemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ItineraryPlan | null;
  cityName: string;
  travelerType: "indian" | "foreign";
  foreignCountry?: string;
  certificateId?: string;
}

export function OfflineRemoteModal({
  isOpen,
  onClose,
  plan,
  cityName,
  travelerType,
  foreignCountry,
  certificateId,
}: OfflineRemoteModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen || !plan) return null;

  const handleDownload = () => {
    downloadOfflinePassFile(plan, {
      travelerType,
      foreignCountry,
    });
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  const handlePrint = () => {
    printOfflinePass(plan, {
      travelerType,
      foreignCountry,
    });
  };

  const previewHtml = generateOfflinePassHTML(plan, {
    travelerType,
    foreignCountry,
  });

  return (
    <div className="persona-modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="persona-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 620, position: "relative" }}
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

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(31, 111, 235, 0.15)", border: "1px solid rgba(31, 111, 235, 0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <WifiOff size={22} color="#58A6FF" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#58A6FF", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
              Remote Area Travel Pass
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#FFF" }}>
              Download &amp; Go (Zero Internet Required)
            </h3>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "var(--gray-light)", lineHeight: 1.5, marginBottom: 18 }}>
          Traveling to high passes, valleys, or remote corners of <strong style={{ color: "#FFF" }}>{cityName}</strong> where cell towers drop? Download your complete offline travel kit with emergency helplines, tickets, schedule, and anti-scam rate cards.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10, marginBottom: 20,
        }}>
          <div style={{
            background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
            borderRadius: 10, padding: "10px 12px", fontSize: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7EE787", fontWeight: 700, marginBottom: 3 }}>
              <ShieldCheck size={14} /> 100% Offline
            </div>
            <div style={{ color: "var(--gray-light)", fontSize: 11.5 }}>
              Zero external files. Opens on airplane mode on any smartphone.
            </div>
          </div>

          <div style={{
            background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
            borderRadius: 10, padding: "10px 12px", fontSize: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#FF7B72", fontWeight: 700, marginBottom: 3 }}>
              <PhoneCall size={14} /> 24/7 SOS Directory
            </div>
            <div style={{ color: "var(--gray-light)", fontSize: 11.5 }}>
              Instant toll-free tourist helplines (1363, 112, 108) pre-loaded.
            </div>
          </div>

          <div style={{
            background: "var(--dark-elevated)", border: "1px solid var(--dark-border)",
            borderRadius: 10, padding: "10px 12px", fontSize: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--yellow)", fontWeight: 700, marginBottom: 3 }}>
              <MapPin size={14} /> Fair Price Guide
            </div>
            <div style={{ color: "var(--gray-light)", fontSize: 11.5 }}>
              Standard auto/taxi rates so touts cannot overcharge you offline.
            </div>
          </div>
        </div>

        {/* Emergency Recap */}
        <div style={{
          background: "rgba(218, 54, 51, 0.1)", border: "1px solid rgba(218, 54, 51, 0.3)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#FF7B72", fontWeight: 700, marginRight: 6 }}>
              <PhoneCall size={14} color="#FF7B72" /> Emergency SOS:
            </span>
            <span style={{ color: "#FFF" }}>Tourist Helpline: <strong>1363</strong> · Police/Disaster: <strong>112</strong></span>
          </div>
          <span style={{ color: "#7EE787", fontSize: 11, fontWeight: 700 }}>Works Without Data</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-hero-yellow"
            style={{ flex: 1.5, padding: "14px 18px", justifyContent: "center", fontSize: 13.5 }}
          >
            {downloaded ? (
              <>
                <CheckCircle size={16} color="#000" />
                <span>Downloaded! Check Downloads</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download Offline Pass (.html)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-dark"
            style={{ flex: 1, padding: "14px 18px", justifyContent: "center", fontSize: 13 }}
          >
            <Printer size={15} />
            <span>Print / PDF</span>
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: "none", border: "none", color: "var(--yellow)",
              cursor: "pointer", fontSize: 12, textDecoration: "underline",
              display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600,
            }}
          >
            <Eye size={13} />
            <span>{showPreview ? "Hide Document Preview" : "Preview Offline Pass Document"}</span>
          </button>

          <span style={{ fontSize: 11, color: "var(--gray-light)" }}>
            Saved to local browser cache
          </span>
        </div>

        {/* Preview Frame */}
        {showPreview && (
          <div style={{
            marginTop: 16, border: "1px solid var(--dark-border)",
            borderRadius: 10, overflow: "hidden", maxHeight: 340, overflowY: "auto",
            background: "#0D1117",
          }}>
            <div style={{
              padding: "8px 12px", background: "var(--dark-elevated)",
              borderBottom: "1px solid var(--dark-border)", fontSize: 11,
              fontWeight: 700, color: "var(--yellow)",
            }}>
              Self-Contained Offline HTML Document Preview
            </div>
            <iframe
              srcDoc={previewHtml}
              title="Offline Pass Preview"
              style={{ width: "100%", height: 300, border: "none", background: "#0D1117" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
