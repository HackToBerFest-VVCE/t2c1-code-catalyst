"use client";

import React, { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "./Button";

// ── 1. Empty State ──
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        background: "var(--color-bg-card, #FAF7F2)",
        border: "1px dashed var(--color-sabbia, #E2D9CC)",
        borderRadius: "14px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
      className={`tm-empty-state ${className}`}
    >
      {icon && (
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(173, 137, 88, 0.12)",
            border: "1px solid rgba(173, 137, 88, 0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-ottone, #AD8958)",
            fontSize: "24px",
            marginBottom: "16px",
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "var(--color-text, #1E3331)",
          fontFamily: "var(--font-mollie, 'Cormorant Garamond', Georgia, serif)",
          margin: "0 0 8px 0",
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted, #475446)",
            fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
            maxWidth: "440px",
            lineHeight: 1.55,
            margin: "0 0 20px 0",
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// ── 2. Error State / Alert Box ──
export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: "error" | "warning" | "info" | "success";
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  variant = "error",
  className = "",
}) => {
  const variantMap = {
    error: {
      bg: "rgba(138, 40, 40, 0.08)",
      border: "rgba(138, 40, 40, 0.24)",
      color: "#8A2828",
      icon: <AlertCircle size={18} color="#8A2828" />,
    },
    warning: {
      bg: "rgba(166, 107, 36, 0.08)",
      border: "rgba(166, 107, 36, 0.24)",
      color: "#A66B24",
      icon: <AlertTriangle size={18} color="#A66B24" />,
    },
    info: {
      bg: "rgba(30, 51, 49, 0.07)",
      border: "rgba(30, 51, 49, 0.20)",
      color: "#1E3331",
      icon: <Info size={18} color="#1E3331" />,
    },
    success: {
      bg: "rgba(45, 90, 67, 0.08)",
      border: "rgba(45, 90, 67, 0.24)",
      color: "#2D5A43",
      icon: <CheckCircle2 size={18} color="#2D5A43" />,
    },
  };

  const v = variantMap[variant];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "14px",
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: "12px",
        padding: "14px 18px",
        fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
      }}
      className={`tm-alert-box tm-alert-${variant} ${className}`}
      role="alert"
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ marginTop: "2px", flexShrink: 0 }}>{v.icon}</div>
        <div>
          {title && (
            <div style={{ fontSize: "14px", fontWeight: 600, color: v.color, marginBottom: "2px" }}>
              {title}
            </div>
          )}
          <div style={{ fontSize: "13.5px", color: "var(--color-text, #1E3331)", lineHeight: 1.45 }}>{message}</div>
        </div>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} style={{ flexShrink: 0 }}>
          Retry
        </Button>
      )}
    </div>
  );
};

// ── 3. Loading State ──
export interface LoadingStateProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading...",
  size = "md",
  className = "",
}) => {
  const iconSizes = { sm: 16, md: 24, lg: 32 };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        gap: "12px",
        color: "#969696",
      }}
      className={`tm-loading-state ${className}`}
    >
      <Loader2 size={iconSizes[size]} color="#FFD451" className="animate-spin" />
      {label && (
        <span style={{ fontSize: "13px", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
          {label}
        </span>
      )}
    </div>
  );
};

// ── 4. Tooltip ──
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            [position === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#181818",
            color: "#F5F5F5",
            border: "1px solid #333333",
            borderRadius: "6px",
            padding: "5px 10px",
            fontSize: "11.5px",
            whiteSpace: "nowrap",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};
