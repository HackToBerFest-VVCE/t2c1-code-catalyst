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
      background: "#202020",
      border: "1px solid #333333",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
    },
    elevated: {
      background: "#262626",
      border: "1px solid #3A3A3A",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.45)",
    },
    interactive: {
      background: "#202020",
      border: "1px solid #333333",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
      cursor: "pointer",
      transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
    },
    accent: {
      background: "#202020",
      border: "1.5px solid rgba(255, 212, 81, 0.45)",
      boxShadow: "0 4px 24px rgba(255, 212, 81, 0.12)",
    },
  };

  return (
    <div
      style={{
        borderRadius: "16px", // 14–16px rule
        padding: paddingStyles[padding],
        fontFamily: "'DM Sans', -apple-system, sans-serif",
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
