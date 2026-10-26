"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, error, leftIcon, className = "", style, disabled, ...props }, ref) => {
    return (
      <div style={{ width: "100%", position: "relative" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "48px",
            background: "#292929",
            border: `1.5px solid ${error ? "#FF4D4D" : "#333333"}`,
            borderRadius: "11px",
            padding: "0 38px 0 14px",
            transition: "border-color 0.18s ease",
            opacity: disabled ? 0.6 : 1,
          }}
          className="tm-select-wrapper"
        >
          {leftIcon && (
            <div style={{ color: "#969696", marginRight: "10px", display: "flex", alignItems: "center" }}>
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            disabled={disabled}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              color: "#F5F5F5",
              fontSize: "14px",
              fontFamily: "'DM Sans', -apple-system, sans-serif",
              border: "none",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              ...style,
            }}
            className={`tm-select ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={18}
            style={{
              position: "absolute",
              right: "14px",
              pointerEvents: "none",
              color: "#969696",
            }}
          />
        </div>
        {error && (
          <p style={{ fontSize: "12px", color: "#FF4D4D", marginTop: "4px", paddingLeft: "2px" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
