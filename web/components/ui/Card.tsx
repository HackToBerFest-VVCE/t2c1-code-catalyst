"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "accent";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  className = "",
  style,
  ...props
}) => {
  const paddingStyles: Record<string, string> = {
    none: "0",
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: "var(--color-bg-card, #FAF7F2)",
      border: "1px solid var(--color-sabbia, #E2D9CC)",
      boxShadow: "0 4px 20px -2px rgba(30, 51, 49, 0.05)",
      color: "var(--color-text, #1E3331)",
    },
    elevated: {
      background: "#FFFFFF",
      border: "1px solid var(--color-sabbia, #E2D9CC)",
      boxShadow: "0 8px 30px -4px rgba(30, 51, 49, 0.08)",
      color: "var(--color-text, #1E3331)",
    },
    interactive: {
      background: "var(--color-bg-card, #FAF7F2)",
      border: "1px solid var(--color-sabbia, #E2D9CC)",
      boxShadow: "0 4px 18px -2px rgba(30, 51, 49, 0.05)",
      cursor: "pointer",
      color: "var(--color-text, #1E3331)",
      transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
    },
    accent: {
      background: "var(--color-bg-card, #FAF7F2)",
      border: "1.5px solid var(--color-ottone, #AD8958)",
      boxShadow: "0 6px 24px -2px rgba(173, 137, 88, 0.15)",
      color: "var(--color-text, #1E3331)",
    },
  };

  return (
    <div
      style={{
        borderRadius: "14px",
        padding: paddingStyles[padding],
        fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
        ...variantStyles[variant],
        ...style,
      }}
      className={`tm-card tm-card-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  style,
  ...props
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      marginBottom: "16px",
      ...style,
    }}
    className={`tm-card-header ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  style,
  ...props
}) => (
  <h3
    style={{
      fontSize: "18px",
      fontWeight: 700,
      color: "#F5F5F5",
      margin: 0,
      lineHeight: 1.3,
      ...style,
    }}
    className={`tm-card-title ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  style,
  ...props
}) => (
  <p
    style={{
      fontSize: "13px",
      color: "#969696",
      margin: 0,
      lineHeight: 1.5,
      ...style,
    }}
    className={`tm-card-description ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  style,
  ...props
}) => (
  <div style={{ ...style }} className={`tm-card-content ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  style,
  ...props
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "20px",
      paddingTop: "16px",
      borderTop: "1px solid #333333",
      gap: "12px",
      ...style,
    }}
    className={`tm-card-footer ${className}`}
    {...props}
  >
    {children}
  </div>
);
