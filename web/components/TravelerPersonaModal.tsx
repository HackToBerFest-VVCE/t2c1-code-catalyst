"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck, Globe, CheckCircle2, AlertTriangle, ExternalLink,
  Camera, FileText, Plane, CreditCard, ArrowRight, ArrowLeft, Search, X, Info
} from "lucide-react";
import {
  COUNTRY_VISA_RULES,
  getCountryVisaRule,
  OFFICIAL_GOV_VISA_URL,
  MANDATORY_FOREIGN_DOCUMENTS,
  type CountryVisaRule
} from "../lib/visa-rules";

interface TravelerPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndian: () => void;
  onConfirmForeign: (country: string, visaRule: CountryVisaRule) => void;
  currentType?: "indian" | "foreign" | null;
  currentCountry?: string;
}

export default function TravelerPersonaModal({
  isOpen,
  onClose,
  onSelectIndian,
  onConfirmForeign,
  currentType,
  currentCountry = "United States",
}: TravelerPersonaModalProps) {
  const [step, setStep] = useState<"persona" | "instructions">("persona");
  const [searchCountry, setSearchCountry] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState<string>(currentCountry);

  const activeVisaRule = useMemo(() => {
    return getCountryVisaRule(selectedCountryName);
  }, [selectedCountryName]);

  const popularCountries = useMemo(() => {
    return Object.values(COUNTRY_VISA_RULES);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchCountry.trim()) return popularCountries;
    const q = searchCountry.toLowerCase().trim();
    return popularCountries.filter(
      c => c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [searchCountry, popularCountries]);

  if (!isOpen) return null;

  return (
    <div className="persona-modal-overlay">
      <div className="persona-modal-container">
        {/* Close Button if user is switching */}
        {onClose && (
          <button className="persona-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        )}

        {/* ══ STEP 1: Two Clean Side-by-Side Cards (Circular Logos, Clean & Concise) ══ */}
        {step === "persona" && (
          <div className="persona-step-wrap">
            {/* Clean Header: Namaskara Welcome */}
            <div className="persona-header">
              <div className="persona-badge">
                <ShieldCheck size={13} color="var(--color-brunello)" />
                <span>🙏 Namaskara · Welcome to YatraSetu</span>
              </div>
              <h2 className="persona-title">Namaskara · Welcome</h2>
              <p className="persona-sub">
                Select your traveler category to customize transit passes, fare cards, and itinerary guidance.
              </p>
            </div>

            {/* ══ TWO CIRCLES SIDE-BY-SIDE (Image 2 - Styled with Luxury Site Palette) ══ */}
            <div className="persona-circle-grid">
              {/* Circle 1: Indian Citizen (Warm Saffron / Ottone / Gold Accent) */}
              <div
                className={`persona-circle-card indian ${currentType === "indian" ? "active" : ""}`}
                onClick={onSelectIndian}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectIndian();
                  }
                }}
                title="Continue as Indian Citizen"
              >
                <div className="persona-circle-icon-inner indian">
                  <span style={{ fontSize: 22, fontWeight: 800, color: "var(--color-notte)", letterSpacing: "0.04em", fontFamily: "var(--font-jost)" }}>
                    IN
                  </span>
                </div>
                <span className="persona-circle-title">Indian Citizen</span>
                <span className="persona-circle-pill green">Domestic</span>
              </div>

              {/* Circle 2: Foreign Traveler (Refined Brunello / Sand Accent) */}
              <div
                className={`persona-circle-card foreign ${currentType === "foreign" ? "active" : ""}`}
                onClick={() => {
                  onConfirmForeign(selectedCountryName, activeVisaRule);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onConfirmForeign(selectedCountryName, activeVisaRule);
                  }
                }}
                title="Continue as Foreign Traveler"
              >
                <div className="persona-circle-icon-inner foreign">
                  <Globe size={28} color="var(--color-brunello)" />
                </div>
                <span className="persona-circle-title">Foreign Traveler</span>
                <span className="persona-circle-pill yellow">International</span>
              </div>
            </div>

            {/* Discreet Visa & Entry Instructions Link */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                type="button"
                className="persona-visa-text-link"
                onClick={() => setStep("instructions")}
                title="View Government photo specifications and eVisa eligibility"
              >
                <Info size={13} />
                <span>Need Foreign Visa or Entry Instructions? View Official Checklist</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2: Instructions for Foreign Visitors (Only shown if requested) ══ */}
        {step === "instructions" && (
          <div className="persona-step-wrap">
            <div className="instructions-back-row">
              <button
                type="button"
                className="instructions-back-btn"
                onClick={() => setStep("persona")}
              >
                <ArrowLeft size={15} />
                <span>Back to Traveler Selection</span>
              </button>
              <div className="instructions-tag">
                <ShieldCheck size={13} color="var(--color-brunello)" />
                <span>Ministry of Tourism & Bureau of Immigration Guidelines</span>
              </div>
            </div>

            <div className="instructions-content">
              {/* Country Selection for Tailored Instructions */}
              <div>
                <label className="instructions-field-label">
                  Select your passport / citizenship country:
                </label>
                <div className="country-search-box">
                  <Search size={15} color="var(--color-oliva)" />
                  <input
                    type="text"
                    placeholder="Search country (e.g. United States, United Kingdom, France, Germany...)"
                    value={searchCountry}
                    onChange={e => setSearchCountry(e.target.value)}
                  />
                  {searchCountry && (
                    <button
                      type="button"
                      onClick={() => setSearchCountry("")}
                      style={{ background: "none", border: "none", color: "var(--color-oliva)", cursor: "pointer" }}
                      aria-label="Clear country search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="country-pill-list">
                  {filteredCountries.slice(0, 10).map(c => {
                    const isSelected = selectedCountryName.toLowerCase() === c.country.toLowerCase();
                    return (
                      <button
                        key={c.code}
                        type="button"
                        className={`country-chip ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedCountryName(c.country)}
                      >
                        <span>{c.flag}</span>
                        <span>{c.country}</span>
                        {isSelected && <CheckCircle2 size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Country-Specific Visa Category Summary */}
              <div className="visa-summary-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{activeVisaRule.flag}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-notte)" }}>
                      {activeVisaRule.country}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-brunello)", fontWeight: 600 }}>
                      {activeVisaRule.categoryLabel}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-oliva)", lineHeight: 1.45, margin: 0 }}>
                  {activeVisaRule.notes}
                </p>
                <div style={{ display: "flex", gap: 20, paddingTop: 4 }}>
                  <div>
                    <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7, display: "block" }}>
                      Validity
                    </span>
                    <strong style={{ fontSize: 13, color: "var(--color-notte)" }}>
                      {activeVisaRule.validitySummary}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7, display: "block" }}>
                      Official Fee
                    </span>
                    <strong style={{ fontSize: 13, color: "var(--color-brunello)" }}>
                      {activeVisaRule.feesSummary}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mandatory White-Background Photo Alert */}
              <div className="photo-spec-box">
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-brunello)", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  <Camera size={15} />
                  <span>Mandatory Photo Standard: Pure White Background (350x350)</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-notte)", opacity: 0.85, lineHeight: 1.45, margin: 0 }}>
                  The Indian visa portal strictly rejects off-white, cream, or colored backgrounds. Must be JPEG (10 KB to 1 MB), minimum 350x350 pixels with neutral expression and open eyes.
                </p>
              </div>

              {/* Key Documents Grid */}
              <div className="docs-grid">
                {MANDATORY_FOREIGN_DOCUMENTS.slice(0, 4).map(doc => (
                  <div key={doc.id} className="doc-pill-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--color-notte)", marginBottom: 4 }}>
                      {doc.id === "passport" && <FileText size={13} color="var(--color-brunello)" />}
                      {doc.id === "photo" && <Camera size={13} color="var(--color-brunello)" />}
                      {doc.id === "tickets" && <Plane size={13} color="var(--color-brunello)" />}
                      {doc.id === "funds" && <CreditCard size={13} color="var(--color-brunello)" />}
                      <span>{doc.title}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: "var(--color-oliva)", lineHeight: 1.35, margin: 0 }}>
                      {doc.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Gov Portal Link & Confirm */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                <a
                  href={OFFICIAL_GOV_VISA_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-official-gov"
                  onClick={() => {
                    onConfirmForeign(activeVisaRule.country, activeVisaRule);
                  }}
                >
                  <ExternalLink size={15} />
                  <span>Apply / Verify on Official Gov Portal (indianvisaonline.gov.in) ↗</span>
                </a>

                <button
                  type="button"
                  className="persona-btn-primary"
                  onClick={() => {
                    onConfirmForeign(activeVisaRule.country, activeVisaRule);
                  }}
                >
                  <span>Continue as Foreign Traveler with {activeVisaRule.country}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
