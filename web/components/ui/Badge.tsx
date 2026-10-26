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
      bg: "rgba(45, 90, 67, 0.08)",
      border: "rgba(45, 90, 67, 0.24)",
      color: "#2D5A43",
      dot: "#2D5A43",
    },
    warning: {
      bg: "rgba(166, 107, 36, 0.08)",
      border: "rgba(166, 107, 36, 0.24)",
      color: "#A66B24",
      dot: "#A66B24",
    },
    error: {
      bg: "rgba(138, 40, 40, 0.08)",
      border: "rgba(138, 40, 40, 0.24)",
      color: "#8A2828",
      dot: "#8A2828",
    },
    info: {
      bg: "rgba(30, 51, 49, 0.07)",
      border: "rgba(30, 51, 49, 0.20)",
      color: "#1E3331",
      dot: "#1E3331",
    },
    gold: {
      bg: "rgba(173, 137, 88, 0.12)",
      border: "rgba(173, 137, 88, 0.32)",
      color: "#AD8958",
      dot: "#AD8958",
    },
    neutral: {
      bg: "#E5DED3",
      border: "#D8CBB8",
      color: "#475446",
      dot: "#475446",
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? "5px" : "6px",
        padding: size === "sm" ? "2px 8px" : "4px 11px",
        fontSize: size === "sm" ? "11px" : "12px",
        fontWeight: 600,
        borderRadius: "9999px",
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        letterSpacing: "0.02em",
        fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
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
