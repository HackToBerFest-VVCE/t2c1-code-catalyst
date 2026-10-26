"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, AlertCircle, Info } from "lucide-react";

export interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "gold" | "neutral";
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  showDot = false,
  className = "",
  style,
}) => {
  const variantStyles: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    success: {
      bg: "rgba(0, 217, 149, 0.12)",
      border: "rgba(0, 217, 149, 0.30)",
      color: "#00D995",
      dot: "#00D995",
    },
    warning: {
      bg: "rgba(255, 176, 32, 0.12)",
      border: "rgba(255, 176, 32, 0.30)",
      color: "#FFB020",
      dot: "#FFB020",
    },
    error: {
      bg: "rgba(255, 77, 77, 0.12)",
      border: "rgba(255, 77, 77, 0.30)",
      color: "#FF4D4D",
      dot: "#FF4D4D",
    },
    info: {
      bg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.30)",
      color: "#3B82F6",
      dot: "#3B82F6",
    },
    gold: {
      bg: "rgba(255, 212, 81, 0.10)",
      border: "rgba(255, 212, 81, 0.30)",
      color: "#FFD451",
      dot: "#FFD451",
    },
    neutral: {
      bg: "#262626",
      border: "#333333",
      color: "#969696",
      dot: "#969696",
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? "5px" : "6px",
        padding: size === "sm" ? "3px 8px" : "4px 11px",
        fontSize: size === "sm" ? "11px" : "12px",
        fontWeight: 700,
        borderRadius: "9999px",
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        letterSpacing: "0.02em",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        lineHeight: 1.2,
        ...style,
      }}
      className={`tm-badge tm-badge-${variant} ${className}`}
    >
      {showDot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: current.dot,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
};

export interface VerificationIndicatorProps {
  label?: string;
  pda?: string;
  trustScore?: number;
  variant?: "solana" | "shield";
  className?: string;
}

export const VerificationIndicator: React.FC<VerificationIndicatorProps> = ({
  label = "Devnet Verified",
  pda,
  trustScore,
  variant = "solana",
  className = "",
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(0, 217, 149, 0.08)",
        border: "1px solid rgba(0, 217, 149, 0.28)",
        borderRadius: "20px",
        padding: "5px 12px",
        fontSize: "12px",
        color: "#F5F5F5",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}
      className={`tm-verification-indicator ${className}`}
    >
      {variant === "solana" ? (
        <CheckCircle2 size={14} color="#00D995" />
      ) : (
        <ShieldCheck size={14} color="#00D995" />
      )}
      <span style={{ fontWeight: 700, color: "#00D995" }}>{label}</span>
      {trustScore !== undefined && (
        <span style={{ color: "#FFD451", fontWeight: 700 }}>
          · {trustScore}% Trust
        </span>
      )}
      {pda && (
        <code
          style={{
            color: "#969696",
            fontFamily: "monospace",
            fontSize: "11px",
            background: "rgba(0,0,0,0.3)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {pda.slice(0, 6)}...{pda.slice(-4)}
        </code>
      )}
    </div>
  );
};
