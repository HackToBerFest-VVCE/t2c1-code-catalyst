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
          color: "#969696",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "'DM Sans', -apple-system, sans-serif",
          ...style,
        }}
        className={`tm-form-label ${className}`}
        {...props}
      >
        {children}
        {required && <span style={{ color: "#FF4D4D", marginLeft: "4px" }}>*</span>}
      </label>
      {helperText && (
        <span style={{ display: "block", fontSize: "11.5px", color: "#666666", marginTop: "2px" }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
