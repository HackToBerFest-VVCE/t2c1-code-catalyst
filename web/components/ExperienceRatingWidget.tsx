"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";

export interface ExperienceRatingWidgetProps {
  className?: string;
  style?: React.CSSProperties;
  onRate?: (ratingIndex: number, label: string) => void;
  showDismiss?: boolean;
}

export function ExperienceRatingWidget({
  className = "",
  style = {},
  onRate,
  showDismiss = true,
}: ExperienceRatingWidgetProps) {
  // Default selected: 1 (the 2nd face, matching img 4 where the ecstatic/loving face is highlighted in orange)
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (dismissed) return null;

  const ratings = [
    { id: 0, label: "Happy", color: "#4CAF7D" },
    { id: 1, label: "Loved it", color: "#E86034" }, // Orange circle in user img 4
    { id: 2, label: "Neutral", color: "#8E9AA8" },
    { id: 3, label: "Sad", color: "#6C7A89" },
    { id: 4, label: "Angry", color: "#E05555" },
  ];

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    setSubmitted(true);
    if (onRate) onRate(idx, ratings[idx].label);
    try {
      sessionStorage.setItem("touristmatram_experience_rating", String(idx));
    } catch {}
  };

  return (
    <div
      className={`experience-rating-card ${className}`}
      style={{
        background: "#FFFFFF",
        color: "#1E202A",
        borderRadius: 16,
        padding: "16px 20px 14px 20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: 320,
        position: "relative",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        ...style,
      }}
    >
      {showDismiss && (
        <button
          onClick={() => setDismissed(true)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            color: "#8E9AA8",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Dismiss feedback"
        >
          <X size={14} />
        </button>
      )}

      {/* Header: "How Your Experience?" matching img 4 */}
      <div style={{
        fontSize: 16,
        fontWeight: 800,
        color: "#1F2338",
        marginBottom: 12,
        letterSpacing: "-0.2px",
      }}>
        How Your Experience?
      </div>

      {/* 5 Emotion Faces matching img 4 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}>
        {/* Face 0: Happy / Smile */}
        <button
          type="button"
          onClick={() => handleSelect(0)}
          style={getFaceButtonStyle(selectedIndex === 0, ratings[0].color)}
          title="Happy"
          aria-label="Rate Happy"
        >
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={selectedIndex === 0 ? ratings[0].color : "#7D8799"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="14" />
            <circle cx="11.5" cy="13" r="1.5" fill={selectedIndex === 0 ? ratings[0].color : "#7D8799"} stroke="none" />
            <circle cx="20.5" cy="13" r="1.5" fill={selectedIndex === 0 ? ratings[0].color : "#7D8799"} stroke="none" />
            <path d="M10 18 Q16 24 22 18" />
          </svg>
        </button>

        {/* Face 1: Ecstatic / Loved it (Circled in Orange in img 4) */}
        <button
          type="button"
          onClick={() => handleSelect(1)}
          style={getFaceButtonStyle(selectedIndex === 1, "#E86034")}
          title="Loved it"
          aria-label="Rate Loved it"
        >
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={selectedIndex === 1 ? "#E86034" : "#7D8799"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="14" />
            {/* Expressive starry / wide happy eyes */}
            <circle cx="11" cy="13" r="2" fill={selectedIndex === 1 ? "#E86034" : "#7D8799"} stroke="none" />
            <circle cx="21" cy="13" r="2" fill={selectedIndex === 1 ? "#E86034" : "#7D8799"} stroke="none" />
            {/* Open laughing/smiling mouth */}
            <path d="M10 17.5 C10 23, 22 23, 22 17.5 Z" fill={selectedIndex === 1 ? "#E86034" : "#7D8799"} stroke={selectedIndex === 1 ? "#E86034" : "#7D8799"} />
          </svg>
        </button>

        {/* Face 2: Neutral */}
        <button
          type="button"
          onClick={() => handleSelect(2)}
          style={getFaceButtonStyle(selectedIndex === 2, ratings[2].color)}
          title="Neutral"
          aria-label="Rate Neutral"
        >
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={selectedIndex === 2 ? ratings[2].color : "#7D8799"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="14" />
            <circle cx="11.5" cy="13" r="1.5" fill={selectedIndex === 2 ? ratings[2].color : "#7D8799"} stroke="none" />
            <circle cx="20.5" cy="13" r="1.5" fill={selectedIndex === 2 ? ratings[2].color : "#7D8799"} stroke="none" />
            <line x1="11" y1="20" x2="21" y2="20" strokeWidth="2" />
          </svg>
        </button>

        {/* Face 3: Sad / Disappointed */}
        <button
          type="button"
          onClick={() => handleSelect(3)}
          style={getFaceButtonStyle(selectedIndex === 3, ratings[3].color)}
          title="Sad"
          aria-label="Rate Sad"
        >
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={selectedIndex === 3 ? ratings[3].color : "#7D8799"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="14" />
            <circle cx="11.5" cy="13" r="1.5" fill={selectedIndex === 3 ? ratings[3].color : "#7D8799"} stroke="none" />
            <circle cx="20.5" cy="13" r="1.5" fill={selectedIndex === 3 ? ratings[3].color : "#7D8799"} stroke="none" />
            <path d="M11 21 Q16 16.5 21 21" />
          </svg>
        </button>

        {/* Face 4: Angry / Displeased */}
        <button
          type="button"
          onClick={() => handleSelect(4)}
          style={getFaceButtonStyle(selectedIndex === 4, ratings[4].color)}
          title="Angry"
          aria-label="Rate Angry"
        >
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke={selectedIndex === 4 ? ratings[4].color : "#7D8799"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="14" />
            {/* Angry angled eyebrows */}
            <line x1="9.5" y1="10.5" x2="13.5" y2="12" strokeWidth="2" />
            <line x1="22.5" y1="10.5" x2="18.5" y2="12" strokeWidth="2" />
            <circle cx="11.5" cy="14" r="1.5" fill={selectedIndex === 4 ? ratings[4].color : "#7D8799"} stroke="none" />
            <circle cx="20.5" cy="14" r="1.5" fill={selectedIndex === 4 ? ratings[4].color : "#7D8799"} stroke="none" />
            <path d="M11 21.5 Q16 17 21 21.5" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {submitted && (
        <div style={{
          marginTop: 10,
          fontSize: 11.5,
          fontWeight: 700,
          color: selectedIndex === 1 ? "#E86034" : "#2E7D32",
          display: "flex",
          alignItems: "center",
          gap: 4,
          justifyContent: "center",
        }}>
          <Check size={13} />
          <span>Thanks for your feedback!</span>
        </div>
      )}
    </div>
  );
}

function getFaceButtonStyle(isSelected: boolean, highlightColor: string): React.CSSProperties {
  return {
    background: "transparent",
    border: isSelected ? `2.5px solid ${highlightColor}` : "1.5px solid transparent",
    borderRadius: "50%",
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    outline: "none",
    transition: "all 0.18s ease-in-out",
    transform: isSelected ? "scale(1.08)" : "scale(1)",
    boxShadow: isSelected ? `0 0 10px ${highlightColor}44` : "none",
  };
}

export default ExperienceRatingWidget;
