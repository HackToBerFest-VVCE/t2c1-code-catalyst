"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    // Height rules: sm: 36px, md: 44px, lg: 48px
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        height: "36px",
        padding: "0 14px",
        fontSize: "12.5px",
        borderRadius: "10px",
        gap: "6px",
      },
      md: {
        height: "44px",
        padding: "0 20px",
        fontSize: "14px",
        borderRadius: "11px",
        gap: "8px",
      },
      lg: {
        height: "48px",
        padding: "0 24px",
        fontSize: "15px",
        borderRadius: "12px",
        gap: "10px",
      },
    };

    // Variant rules
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: "#FFD451",
        color: "#101010",
        fontWeight: 700,
        border: "1px solid #FFD451",
        boxShadow: "0 2px 8px rgba(255, 212, 81, 0.20)",
      },
      secondary: {
        background: "#202020",
        color: "#F5F5F5",
        fontWeight: 600,
        border: "1px solid #333333",
      },
      tertiary: {
        background: "transparent",
        color: "#969696",
        fontWeight: 500,
        border: "1px solid transparent",
      },
      destructive: {
        background: "rgba(255, 77, 77, 0.12)",
        color: "#FF4D4D",
        fontWeight: 600,
        border: "1px solid rgba(255, 77, 77, 0.30)",
      },
    };

    const baseStyle: React.CSSProperties = {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : "auto",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.55 : 1,
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      letterSpacing: "0.01em",
      transition: "all 0.18s ease-in-out",
      userSelect: "none",
      whiteSpace: "nowrap",
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={baseStyle}
        className={`tm-button tm-button-${variant} tm-button-${size} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
