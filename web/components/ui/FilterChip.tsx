"use client";

import React from "react";

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  children,
  active = false,
  count,
  icon,
  className = "",
  style,
  ...props
}) => {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: "36px",
        padding: "0 16px",
        borderRadius: "9999px",
        fontSize: "13px",
        fontWeight: active ? 600 : 500,
        background: active ? "var(--color-cta, #652733)" : "var(--color-bg-card, #FAF7F2)",
        color: active ? "var(--color-avorio, #F2EDE4)" : "var(--color-text-muted, #475446)",
        border: `1px solid ${active ? "var(--color-cta, #652733)" : "var(--color-sabbia, #E2D9CC)"}`,
        cursor: "pointer",
        transition: "all 0.18s ease",
        userSelect: "none",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
        ...style,
      }}
      className={`tm-filter-chip ${active ? "active" : ""} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
      {count !== undefined && (
        <span
          style={{
            fontSize: "11px",
            padding: "1px 6px",
            borderRadius: "9999px",
            background: active ? "rgba(242, 237, 228, 0.25)" : "var(--color-bg-alt, #E5DED3)",
            color: active ? "#F2EDE4" : "var(--color-text, #1E3331)",
            fontWeight: 600,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
