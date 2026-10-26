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
        borderRadius: "8px",
        gap: "6px",
      },
      md: {
        height: "44px",
        padding: "0 20px",
        fontSize: "14px",
        borderRadius: "10px",
        gap: "8px",
      },
      lg: {
        height: "48px",
        padding: "0 26px",
        fontSize: "15px",
        borderRadius: "9999px",
        gap: "10px",
      },
    };

    // Variant rules inspired by Q'in Saba luxury palette
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: "var(--color-cta, #652733)",
        color: "var(--color-text-inverse, #F2EDE4)",
        fontWeight: 600,
        border: "1px solid var(--color-cta, #652733)",
        boxShadow: "0 4px 16px -2px rgba(101, 39, 51, 0.25)",
      },
      secondary: {
        background: "var(--color-bg-alt, #E5DED3)",
        color: "var(--color-text, #1E3331)",
        fontWeight: 500,
        border: "1px solid var(--color-sabbia, #D8CBB8)",
        boxShadow: "0 2px 8px -1px rgba(30, 51, 49, 0.05)",
      },
      tertiary: {
        background: "transparent",
        color: "var(--color-text-muted, #475446)",
        fontWeight: 500,
        border: "1px solid transparent",
      },
      destructive: {
        background: "rgba(138, 40, 40, 0.08)",
        color: "#8A2828",
        fontWeight: 600,
        border: "1px solid rgba(138, 40, 40, 0.25)",
      },
    };

    const baseStyle: React.CSSProperties = {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : "auto",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.55 : 1,
      fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
      letterSpacing: "0.02em",
      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
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
