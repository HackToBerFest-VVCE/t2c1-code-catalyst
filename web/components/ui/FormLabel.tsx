"use client";

import React from "react";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  helperText?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  helperText,
  className = "",
  style,
  ...props
}) => {
  return (
    <div style={{ marginBottom: "6px" }}>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--color-text-muted, #475446)",
          textTransform: "uppercase",
          letterSpacing: "0.10em",
          fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
          ...style,
        }}
        className={`tm-form-label ${className}`}
        {...props}
      >
        {children}
        {required && <span style={{ color: "#8A2828", marginLeft: "4px" }}>*</span>}
      </label>
      {helperText && (
        <span style={{ display: "block", fontSize: "11.5px", color: "var(--color-text-muted, #475446)", opacity: 0.8, marginTop: "2px" }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
