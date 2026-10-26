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
        background: "#202020",
        border: "1px dashed #333333",
        borderRadius: "16px",
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
            background: "rgba(255, 212, 81, 0.10)",
            border: "1px solid rgba(255, 212, 81, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFD451",
            fontSize: "24px",
            marginBottom: "16px",
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#F5F5F5",
          margin: "0 0 8px 0",
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: "13.5px",
            color: "#969696",
            maxWidth: "440px",
            lineHeight: 1.5,
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
      bg: "rgba(255, 77, 77, 0.10)",
      border: "rgba(255, 77, 77, 0.28)",
      color: "#FF4D4D",
      icon: <AlertCircle size={18} color="#FF4D4D" />,
    },
    warning: {
      bg: "rgba(255, 176, 32, 0.10)",
      border: "rgba(255, 176, 32, 0.28)",
      color: "#FFB020",
      icon: <AlertTriangle size={18} color="#FFB020" />,
    },
    info: {
      bg: "rgba(59, 130, 246, 0.10)",
      border: "rgba(59, 130, 246, 0.28)",
      color: "#3B82F6",
      icon: <Info size={18} color="#3B82F6" />,
    },
    success: {
      bg: "rgba(0, 217, 149, 0.10)",
      border: "rgba(0, 217, 149, 0.28)",
      color: "#00D995",
      icon: <CheckCircle2 size={18} color="#00D995" />,
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
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}
      className={`tm-alert-box tm-alert-${variant} ${className}`}
      role="alert"
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ marginTop: "2px", flexShrink: 0 }}>{v.icon}</div>
        <div>
          {title && (
            <div style={{ fontSize: "14px", fontWeight: 700, color: v.color, marginBottom: "2px" }}>
              {title}
            </div>
          )}
          <div style={{ fontSize: "13px", color: "#F5F5F5", lineHeight: 1.45 }}>{message}</div>
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
