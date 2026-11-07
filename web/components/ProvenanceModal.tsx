"use client";

import React from "react";
import { ShieldCheck, Lock, Award, CheckCircle2, X, ExternalLink, Code } from "lucide-react";
import { GENESIS_PROVENANCE, verifyProvenance } from "../lib/provenance";

interface ProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvenanceModal({ isOpen, onClose }: ProvenanceModalProps) {
  if (!isOpen) return null;

  const verification = verifyProvenance();

  return (
    <div
      className="provenance-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 25, 23, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "16px",
      }}
    >
      <div
        className="provenance-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAF7F2",
          color: "#1E3331",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px -8px rgba(0, 0, 0, 0.45), 0 0 0 1.5px #E2D9CC",
          border: "1.5px solid #E2D9CC",
          overflow: "hidden",
          fontFamily: "var(--font-jost), sans-serif",
          animation: "fadeUpModal 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px 24px",
            borderBottom: "1px solid #E2D9CC",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(101, 39, 51, 0.1)",
                border: "1.5px solid rgba(101, 39, 51, 0.25)",
                color: "#652733",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={22} color="#652733" />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#1E3331",
                  letterSpacing: "-0.01em",
                }}
              >
                Certificate of Provenance &amp; Authorship
              </h3>
              <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                Tamper-evident Genesis Attribution Guard
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6B7280",
              cursor: "pointer",
              padding: 6,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status Badge */}
          <div
            style={{
              background: "rgba(45, 90, 67, 0.08)",
              border: "1px solid rgba(45, 90, 67, 0.25)",
              borderRadius: 12,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "0.82rem",
              color: "#2D5A43",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={18} color="#2D5A43" />
            <span>
              Genesis Hash Verified · Authentic Original Build by {verification.authorStamp}
            </span>
          </div>

          {/* Details Table */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2D9CC",
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: "0.82rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3EDE4", paddingBottom: 8 }}>
              <span style={{ color: "#6B7280", fontWeight: 500 }}>Team:</span>
              <span style={{ color: "#1E3331", fontWeight: 700 }}>{GENESIS_PROVENANCE.teamName}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3EDE4", paddingBottom: 8 }}>
              <span style={{ color: "#6B7280", fontWeight: 500 }}>Original Creators:</span>
              <span style={{ color: "#652733", fontWeight: 700 }}>
                {GENESIS_PROVENANCE.leadCreators.join(" & ")}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3EDE4", paddingBottom: 8 }}>
              <span style={{ color: "#6B7280", fontWeight: 500 }}>Event &amp; Institution:</span>
              <span style={{ color: "#1E3331", fontWeight: 600 }}>
                {GENESIS_PROVENANCE.event} · {GENESIS_PROVENANCE.institution}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3EDE4", paddingBottom: 8 }}>
              <span style={{ color: "#6B7280", fontWeight: 500 }}>Track:</span>
              <span style={{ color: "#1E3331", fontWeight: 600 }}>{GENESIS_PROVENANCE.track}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3EDE4", paddingBottom: 8 }}>
              <span style={{ color: "#6B7280", fontWeight: 500 }}>Genesis Fingerprint:</span>
              <code style={{ fontSize: "0.75rem", color: "#AD8958", background: "rgba(173, 137, 88, 0.1)", padding: "1px 6px", borderRadius: 4 }}>
                {GENESIS_PROVENANCE.genesisHash.slice(0, 20)}...
              </code>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6B7280", fontWeight: 500 }}>Attestation:</span>
              <span style={{ fontSize: "0.75rem", color: "#2D5A43", fontWeight: 700 }}>
                Solana Devnet Certified
              </span>
            </div>
          </div>

          {/* Legal / Plagiarism Notice */}
          <div
            style={{
              background: "#F5F1EB",
              border: "1px dashed #D4C7B8",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: "0.76rem",
              lineHeight: 1.5,
              color: "#5E6963",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#652733", marginBottom: 4 }}>
              <Lock size={12} color="#652733" />
              <span>Anti-Plagiarism Protection Notice</span>
            </div>
            This codebase contains cryptographic digital watermarking. Any uncredited clone or unauthorized submission by another team violates the <strong>HackToBerFest 2026 Honor Code</strong> and will be flagged as an uncredited fork.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 24px 16px 24px",
            borderTop: "1px solid #E2D9CC",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
            Press Esc or click anywhere outside to dismiss
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 16px",
              background: "#652733",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 9999,
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
