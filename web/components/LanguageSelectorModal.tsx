"use client";

import React from "react";
import { Globe, Check, X, Sparkles } from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  type LanguageInfo,
} from "../lib/i18n";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onSelectLang: (code: LanguageCode) => void;
}

export default function LanguageSelectorModal({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
}: LanguageSelectorModalProps) {
  if (!isOpen) return null;

  const indianLangs = SUPPORTED_LANGUAGES.filter(l => l.category === "indian");
  const internationalLangs = SUPPORTED_LANGUAGES.filter(l => l.category === "international");

  return (
    <div className="persona-modal-overlay" onClick={onClose}>
      <div
        className="persona-modal-container lang-modal-box"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 680 }}
      >
        <button className="persona-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="persona-badge">
            <Globe size={14} color="var(--yellow)" />
            <span>Multi-Lingual Tourist Interface</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#FFF", margin: "6px 0" }}>
            Select Your Preferred Language / भाषा चुनें
          </h2>
          <p style={{ fontSize: 13, color: "var(--gray-light)", margin: 0 }}>
            Choose from official Indian regional languages or major international languages.
          </p>
        </div>

        {/* Indian Languages Section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--yellow)", letterSpacing: 0.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🇮🇳</span>
            <span>Indian Regional Languages · भारतीय भाषाएं</span>
          </div>
          <div className="lang-grid">
            {indianLangs.map(l => {
              const isSelected = currentLang === l.code;
              return (
                <button
                  key={l.code}
                  className={`lang-option-pill ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    onSelectLang(l.code);
                    onClose();
                  }}
                >
                  <span style={{ fontSize: 18 }}>{l.flag}</span>
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? "#0C0E12" : "#FFF" }}>
                      {l.nativeName}
                    </div>
                    <div style={{ fontSize: 10, color: isSelected ? "#333" : "var(--gray-light)" }}>
                      {l.name}
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="#0C0E12" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* International Languages Section */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--success)", letterSpacing: 0.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Globe size={15} color="var(--success)" />
            <span>International Tourist Languages · 1363 Helpline Supported</span>
          </div>
          <div className="lang-grid">
            {internationalLangs.map(l => {
              const isSelected = currentLang === l.code;
              return (
                <button
                  key={l.code}
                  className={`lang-option-pill ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    onSelectLang(l.code);
                    onClose();
                  }}
                >
                  <span style={{ fontSize: 18 }}>{l.flag}</span>
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? "#0C0E12" : "#FFF" }}>
                      {l.nativeName}
                    </div>
                    <div style={{ fontSize: 10, color: isSelected ? "#333" : "var(--gray-light)" }}>
                      {l.name}
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="#0C0E12" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
