"use client";

import React from "react";

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "gold" | "emerald" | "neutral" | "dark";
  size?: "md" | "lg";
  rounded?: "md" | "lg" | "full";
}

export const IconBox: React.FC<IconBoxProps> = ({
  children,
  variant = "gold",
  size = "md",
  rounded = "lg",
  className = "",
  style,
  ...props
}) => {
  // Container size: 40–44px (md is 42px, lg is 48px)
  const boxDimension = size === "md" ? "42px" : "48px";

  const borderRadiusStyles: Record<string, string> = {
    md: "10px",
    lg: "12px",
    full: "9999px",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    gold: {
      background: "rgba(173, 137, 88, 0.12)",
      border: "1px solid rgba(173, 137, 88, 0.30)",
      color: "var(--color-ottone, #AD8958)",
    },
    emerald: {
      background: "rgba(45, 90, 67, 0.10)",
      border: "1px solid rgba(45, 90, 67, 0.28)",
      color: "var(--color-oliva, #2D5A43)",
    },
    neutral: {
      background: "var(--color-bg-alt, #E5DED3)",
      border: "1px solid var(--color-sabbia, #D8CBB8)",
      color: "var(--color-text, #1E3331)",
    },
    dark: {
      background: "var(--color-text, #1E3331)",
      border: "1px solid var(--color-text, #1E3331)",
      color: "var(--color-avorio, #F2EDE4)",
    },
  };

  return (
    <div
      style={{
        width: boxDimension,
        height: boxDimension,
        minWidth: boxDimension,
        minHeight: boxDimension,
        borderRadius: borderRadiusStyles[rounded],
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...variantStyles[variant],
        ...style,
      }}
      className={`tm-icon-box tm-icon-box-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
