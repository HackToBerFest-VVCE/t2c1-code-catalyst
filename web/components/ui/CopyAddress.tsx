"use client";

import React, { useState, useCallback } from "react";
import { Copy, Check, AlertCircle, ExternalLink } from "lucide-react";

export interface CopyAddressProps {
  /** The full, raw technical identifier (e.g. PDA, mint address, transaction hash) */
  value: string;
  /** Human-readable label for accessibility (e.g. "Identity PDA", "Program ID", "Transaction Signature") */
  label?: string;
  /** Number of starting characters to show (default: 4 or 6 depending on length) */
  startChars?: number;
  /** Number of ending characters to show (default: 4) */
  endChars?: number;
  /** Length threshold below which the value is displayed in full (default: 16) */
  maxLength?: number;
  /** Color theme for monospace text: "gold" | "emerald" | "muted" | "white" */
  colorTheme?: "gold" | "emerald" | "muted" | "white";
  /** Optional link to open on Solana Explorer */
  explorerUrl?: string;
  /** Whether to show a compact single-pill design (default: false) */
  compact?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

/**
 * Shortens a technical address or hash for display without losing original data.
 * Examples:
 * - 1xEXUh3Ygpo8xzWyTyFzih249FihsbDNC1G4SE4FeBP -> 1xEXUh...FeBP
 * - A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN -> A7yU8i...VSzN
 * - 0x71C...82F
 */
export function formatShortAddress(
  address: string,
  start: number = 6,
  end: number = 4,
  maxLen: number = 16
): string {
  if (!address || typeof address !== "string") return "";
  if (address.length <= maxLen) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export const CopyAddress: React.FC<CopyAddressProps> = ({
  value,
  label = "identifier",
  startChars = 6,
  endChars = 4,
  maxLength = 16,
  colorTheme = "gold",
  explorerUrl,
  compact = false,
  className = "",
  style,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);

  const displayString = formatShortAddress(value, startChars, endChars, maxLength);

  const handleCopy = useCallback(
    async (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!value) return;

      let success = false;
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          success = true;
        } else if (typeof document !== "undefined") {
          // Fallback execution for non-secure contexts or legacy browsers
          const textArea = document.createElement("textarea");
          textArea.value = value;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          success = document.execCommand("copy");
          textArea.remove();
        }
      } catch (err) {
        console.warn("Clipboard access rejected or unavailable:", err);
        success = false;
      }

      if (success) {
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopyError(true);
        setTimeout(() => setCopyError(false), 3000);
      }
    },
    [value]
  );

  const colorMap = {
    gold: "var(--color-ottone, #AD8958)",
    emerald: "var(--color-oliva, #2D5A43)",
    muted: "var(--color-text-muted, #475446)",
    white: "var(--color-text, #1E3331)",
  };

  const textColor = colorMap[colorTheme] || colorMap.gold;

  return (
    <span
      className={`copy-address-wrapper ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 4 : 6,
        maxWidth: "100%",
        verticalAlign: "middle",
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleCopy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCopy(e);
          }
        }}
        aria-label={
          copied
            ? `Copied ${label} to clipboard`
            : copyError
            ? `Failed to copy ${label}. Click to retry`
            : `Copy full ${label}: ${value}`
        }
        title={`Click to copy full ${label} (${value})`}
        className={`copy-address-btn ${copied ? "is-copied" : ""} ${copyError ? "is-error" : ""}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: copied
            ? "rgba(45, 90, 67, 0.10)"
            : copyError
            ? "rgba(138, 40, 40, 0.10)"
            : "var(--color-bg-card, #FAF7F2)",
          border: copied
            ? "1px solid rgba(45, 90, 67, 0.35)"
            : copyError
            ? "1px solid rgba(138, 40, 40, 0.35)"
            : "1px solid var(--color-sabbia, #E2D9CC)",
          borderRadius: 6,
          padding: compact ? "2px 6px" : "3px 8px",
          color: copied ? "var(--color-oliva, #2D5A43)" : textColor,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: compact ? 11 : 11.5,
          cursor: "pointer",
          transition: "all 0.15s ease",
          maxWidth: "100%",
          userSelect: "none",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.2,
          }}
        >
          {copied ? "Address Copied!" : copyError ? "Copy Failed" : displayString}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: copied ? 1 : 0.75,
          }}
        >
          {copied ? (
            <Check size={12} color="var(--color-oliva, #2D5A43)" />
          ) : copyError ? (
            <AlertCircle size={12} color="#8A2828" />
          ) : (
            <Copy size={11} color={textColor} />
          )}
        </span>
      </button>

      {/* Optional Explorer Link Icon beside copyable value */}
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`View ${label} on Solana Explorer`}
          title={`View full ${label} on Solana Explorer`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3px 5px",
            borderRadius: 5,
            background: "var(--color-bg-alt, #E5DED3)",
            border: "1px solid var(--color-sabbia, #D8CBB8)",
            color: "var(--color-text-muted, #475446)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="copy-address-explorer-link"
        >
          <ExternalLink size={10} />
        </a>
      )}

      {/* Screen-reader announcement region */}
      <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {copied ? `Full ${label} copied to clipboard: ${value}` : ""}
      </span>
    </span>
  );
};

export default CopyAddress;
