"use client";

import React from "react";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  className = "",
}: SegmentedControlProps<T>) {
  const isSm = size === "sm";

  return (
    <div
      style={{
        display: fullWidth ? "flex" : "inline-flex",
        background: "var(--color-bg-alt, #E5DED3)",
        border: "1px solid var(--color-sabbia, #D8CBB8)",
        borderRadius: "9999px",
        padding: "4px",
        gap: "4px",
        fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
      }}
      className={`tm-segmented-control ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            style={{
              flex: fullWidth ? 1 : undefined,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              height: isSm ? "32px" : "38px",
              padding: isSm ? "0 14px" : "0 18px",
              borderRadius: "9999px",
              fontSize: isSm ? "12px" : "13.5px",
              fontWeight: isSelected ? 600 : 500,
              background: isSelected ? "var(--color-text, #1E3331)" : "transparent",
              color: isSelected ? "var(--color-avorio, #F2EDE4)" : "var(--color-text-muted, #475446)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
            className={`tm-segment-item ${isSelected ? "selected" : ""}`}
          >
            {opt.icon}
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                style={{
                  fontSize: "10.5px",
                  padding: "1px 6px",
                  borderRadius: "9999px",
                  background: isSelected ? "rgba(16, 16, 16, 0.2)" : "#292929",
                  color: isSelected ? "#101010" : "#F5F5F5",
                  fontWeight: 700,
                }}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
