"use client";

import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, leftIcon, rightIcon, style, disabled, ...props }, ref) => {
    return (
      <div style={{ width: "100%", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "48px",
            background: "var(--color-bg-card, #FAF7F2)",
            border: `1.5px solid ${error ? "#8A2828" : "var(--color-sabbia, #E2D9CC)"}`,
            borderRadius: "10px",
            padding: "0 14px",
            gap: "10px",
            transition: "border-color 0.18s ease, box-shadow 0.18s ease",
            opacity: disabled ? 0.6 : 1,
          }}
          className="tm-input-wrapper"
        >
          {leftIcon && (
            <div style={{ color: "var(--color-text-muted, #475446)", display: "flex", alignItems: "center", flexShrink: 0 }}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              background: "transparent",
              color: "var(--color-text, #1E3331)",
              fontSize: "14px",
              fontFamily: "var(--font-jost, 'Jost', -apple-system, sans-serif)",
              border: "none",
              outline: "none",
              padding: 0,
              ...style,
            }}
            className={`tm-input ${className}`}
            {...props}
          />
          {rightIcon && (
            <div style={{ color: "#969696", display: "flex", alignItems: "center", flexShrink: 0 }}>
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className = "", ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <Input
        ref={ref}
        value={value}
        leftIcon={<Search size={18} color="#FFD451" />}
        rightIcon={
          hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#969696",
                display: "flex",
                alignItems: "center",
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          ) : undefined
        }
        className={`tm-search-input ${className}`}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
