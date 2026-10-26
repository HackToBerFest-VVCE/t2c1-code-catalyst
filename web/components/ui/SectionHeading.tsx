"use client";

import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  className = "",
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: align === "center" ? "center" : "flex-end",
        justifyContent: align === "center" ? "center" : "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px",
        textAlign: align,
      }}
      className={`tm-section-heading ${className}`}
    >
      <div style={{ maxWidth: align === "center" ? "680px" : "780px" }}>
        {eyebrow && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--color-ottone, #AD8958)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: "8px",
              fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
            }}
            className="tm-eyebrow"
          >
            {eyebrow}
          </div>
        )}
        <h2
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 600,
            color: "var(--color-text, #1E3331)",
            letterSpacing: "-0.015em",
            margin: "0 0 10px 0",
            lineHeight: 1.15,
            fontFamily: "var(--font-mollie, 'Cormorant Garamond', 'Playfair Display', Georgia, serif)",
          }}
          className="tm-title"
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-text-muted, #475446)",
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
            }}
            className="tm-subtitle"
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {action}
        </div>
      )}
    </div>
  );
};
