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
      background: "rgba(255, 212, 81, 0.12)",
      border: "1px solid rgba(255, 212, 81, 0.28)",
      color: "#FFD451",
    },
    emerald: {
      background: "rgba(0, 217, 149, 0.12)",
      border: "1px solid rgba(0, 217, 149, 0.28)",
      color: "#00D995",
    },
    neutral: {
      background: "#292929",
      border: "1px solid #333333",
      color: "#F5F5F5",
    },
    dark: {
      background: "#1A1A1A",
      border: "1px solid #2B2B2B",
      color: "#969696",
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
