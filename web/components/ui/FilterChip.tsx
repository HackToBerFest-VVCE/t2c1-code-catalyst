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
        padding: "0 14px",
        borderRadius: "9999px",
        fontSize: "13px",
        fontWeight: active ? 700 : 500,
        background: active ? "#FFD451" : "#202020",
        color: active ? "#101010" : "#969696",
        border: `1px solid ${active ? "#FFD451" : "#333333"}`,
        cursor: "pointer",
        transition: "all 0.18s ease",
        userSelect: "none",
        whiteSpace: "nowrap",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
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
            background: active ? "rgba(16, 16, 16, 0.18)" : "#292929",
            color: active ? "#101010" : "#F5F5F5",
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
