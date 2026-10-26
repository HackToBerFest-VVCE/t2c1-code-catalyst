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
              fontSize: "11px",
              fontWeight: 700,
              color: "#FFD451",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
            className="tm-eyebrow"
          >
            ✦ {eyebrow}
          </div>
        )}
        <h2
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#F5F5F5",
            letterSpacing: "-0.02em",
            margin: "0 0 8px 0",
            lineHeight: 1.25,
          }}
          className="tm-title"
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: "14px",
              color: "#969696",
              margin: 0,
              lineHeight: 1.5,
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
