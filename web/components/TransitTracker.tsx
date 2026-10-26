"use client";

import React, { useState, useEffect } from "react";
import {
  Train,
  Bus,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  RotateCcw,
  Activity,
  MapPin,
  Ticket,
  Sparkles,
  Radio,
} from "lucide-react";

export interface TransitPassOption {
  id: string;
  name: string;
  operator: string;
  operatorCode: string;
  type: "metro" | "bus" | "ferry";
  city: string;
  priceINR: number;
  route: string;
  stations: string[];
  signature: string;
  validity: string;
  howToUse: string;
}

const DEFAULT_PASSES: TransitPassOption[] = [
  {
    id: "dmrc",
    name: "DMRC Delhi Metro Tourist Smart Card (1-Day Unlimited)",
    operator: "Delhi Metro Rail Corporation (DMRC)",
    operatorCode: "DMRC-DEL-SMART-2026",
    type: "metro",
    city: "Delhi",
    priceINR: 150,
    route: "Yellow Line Express · Samaypur Badli to Millennium City Centre",
    stations: ["New Delhi Railway Stn", "Rajiv Chowk (Connaught Place)", "Central Secretariat", "Hauz Khas", "Qutub Minar"],
    signature: "5xR9p2Wa918f...8mN1",
    validity: "Unlimited travel across all DMRC Lines for 24 hours",
    howToUse: "Tap smart card at AFC fare gates on entry and exit.",
  },
  {
    id: "ksrtc",
    name: "KSRTC Mysuru Sarige Daily Smart Pass",
    operator: "Karnataka State Road Transport (KSRTC)",
    operatorCode: "MYS-KSRTC-DAILY-01",
    type: "bus",
    city: "Mysuru",
    priceINR: 120,
    route: "Heritage Circuit · Suburban Bus Stand to Chamundi Hill via Palace",
    stations: ["Suburban Bus Stand", "Mysore Palace North Gate", "Zoo Garden", "Lalitha Mahal", "Chamundi Hill Foothills"],
    signature: "3bY7t8Lm421c...2kP4",
    validity: "Unlimited travel on all city Sarige and AC Volvo city buses",
    howToUse: "Show digital QR or pass ticket to bus conductor upon boarding.",
  },
  {
    id: "mumbai",
    name: "Mumbai Chalo 1-Day Mega Suburban & Metro Tourist Pass",
    operator: "BEST & Maha Mumbai Metro",
    operatorCode: "BOM-CHALO-MEGA-01",
    type: "bus",
    city: "Mumbai",
    priceINR: 100,
    route: "Island City to Suburbs · CSMT to Bandra via Western Line & Metro 3",
    stations: ["CSMT Heritage Terminus", "Churchgate", "Lower Parel", "Dadar Interchange", "Bandra West"],
    signature: "8nK4m9Xq712d...5wQ2",
    validity: "Unlimited suburban rail, Metro Lines 2A/7/3, and BEST AC electric buses",
    howToUse: "Scan QR code at metro gates or display to BEST electric bus conductor.",
  },
  {
    id: "goa",
    name: "Kadamba Goa State Transport Inter-City Pass",
    operator: "Kadamba Transport Corporation (KTCL)",
    operatorCode: "GOA-KTCL-PASS-01",
    type: "bus",
    city: "Goa",
    priceINR: 140,
    route: "Panaji to Margao & Old Goa Heritage Corridor",
    stations: ["Panaji KTC Bus Stand", "Old Goa Basilica", "Ponda Junction", "Margao City Terminus"],
    signature: "2pL6v3Zk119e...9tM7",
    validity: "Unlimited hops on electric EV Kadamba shuttles across Goa",
    howToUse: "Board any electric Kadamba shuttle and show pass token.",
  },
  {
    id: "bangalore",
    name: "Namma Metro 1-Day Unlimited Commuter Card",
    operator: "Bangalore Metro Rail Corporation (BMRCL)",
    operatorCode: "BLR-NAMMA-METRO-01",
    type: "metro",
    city: "Bengaluru",
    priceINR: 180,
    route: "Purple Line · Whitefield to Challaghatta via Majestic Interchange",
    stations: ["Baiyappanahalli", "MG Road / Brigade Rd", "Majestic Interchange", "Vijayanagar", "Kengeri"],
    signature: "9vW1x5Yp384b...4jR8",
    validity: "Unlimited trips across Purple and Green Metro corridors",
    howToUse: "Tap smart token or mobile QR at AFC gate scanners.",
  },
  {
    id: "kochi",
    name: "Kochi Metro Water & Rail Combined 1-Day Pass",
    operator: "Kochi Metro Rail Ltd (KMRL)",
    operatorCode: "COK-WATER-METRO-01",
    type: "ferry",
    city: "Kochi",
    priceINR: 125,
    route: "High Court Water Jetty to Fort Kochi & Aluva Rail Line",
    stations: ["Aluva Metro", "Edapally", "MG Road Kochi", "High Court Water Jetty", "Fort Kochi Jetty"],
    signature: "4jT9z2Wv810a...7kE3",
    validity: "Unlimited access to Kochi Metro trains and AC Electric Water Metro ferries",
    howToUse: "Scan mobile QR code at boat jetties and metro turnstiles.",
  },
];

interface TransitTrackerProps {
  selectedPassName?: string;
  cityName?: string;
  selectedCurrency?: string;
  onOpenPassModal?: () => void;
}

export default function TransitTracker({
  selectedPassName,
  cityName,
  selectedCurrency = "INR",
  onOpenPassModal,
}: TransitTrackerProps) {
  // Find matching pass or default to first
  const initialPass = DEFAULT_PASSES.find(
    (p) =>
      (selectedPassName && p.name.toLowerCase().includes(selectedPassName.toLowerCase())) ||
      (cityName && p.city.toLowerCase() === cityName.toLowerCase())
  ) || DEFAULT_PASSES[0];

  const [activePass, setActivePass] = useState<TransitPassOption>(initialPass);
  const [currentStep, setCurrentStep] = useState<number>(3); // Default at Step 3 (Active In Transit)
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [liveIstTime, setLiveIstTime] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Update when selectedPassName or cityName props change
  useEffect(() => {
    if (selectedPassName || cityName) {
      const match = DEFAULT_PASSES.find(
        (p) =>
          (selectedPassName && p.name.toLowerCase().includes(selectedPassName.toLowerCase())) ||
          (cityName && p.city.toLowerCase() === cityName.toLowerCase())
      );
      if (match) setActivePass(match);
    }
  }, [selectedPassName, cityName]);

  // Live IST Clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setLiveIstTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopySignature = () => {
    navigator.clipboard.writeText(`https://explorer.solana.com/tx/${activePass.signature}?cluster=devnet`);
    setCopiedSignature(true);
    setTimeout(() => setCopiedSignature(false), 2000);
  };

  const handleAdvanceStep = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setCurrentStep((prev) => (prev >= 4 ? 1 : prev + 1));
      setIsSimulating(false);
    }, 400);
  };

  const handleResetStep = () => {
    setCurrentStep(1);
  };

  // Convert price if foreign currency selected
  const displayPrice =
    selectedCurrency === "INR"
      ? `₹${activePass.priceINR}`
      : `$${(activePass.priceINR / 87).toFixed(2)} ${selectedCurrency}`;

  // Calculate current station indices
  const currentStationIdx = Math.min(
    Math.max(0, currentStep - 1),
    activePass.stations.length - 1
  );
  const currentStation = activePass.stations[currentStationIdx];
  const nextStation =
    currentStationIdx < activePass.stations.length - 1
      ? activePass.stations[currentStationIdx + 1]
      : "Final Terminus Reached";

  return (
    <div className="transit-tracker-wrapper" role="region" aria-label="Live Transit & Transaction Tracker">
      {/* Header Bar with Live Pulsing Radar Beacon */}
      <div className="transit-tracker-header">
        <div className="tracker-header-left">
          <div className="tracker-live-pill">
            <span className="live-radar-dot" />
            <span className="live-radar-text">LIVE IN TRANSIT</span>
          </div>
          <div>
            <h3 className="tracker-title">Transaction &amp; Transit Tracker</h3>
            <p className="tracker-sub">
              Verified state transit pass with cryptographic Solana Devnet tariff locks &amp; real-time checkpoints
            </p>
          </div>
        </div>

        <div className="tracker-header-right">
          <div className="tracker-clock-badge">
            <Clock size={13} />
            <span>{liveIstTime || "Live IST"}</span>
          </div>
          <div className="tracker-operator-code" title="State Transit Gazette Operator Code">
            {activePass.operatorCode}
          </div>
        </div>
      </div>

      {/* Transit Pass Selector Pill Strip */}
      <div className="tracker-pass-selector-strip" aria-label="Available state transit passes">
        <span className="pass-selector-label">Track Pass:</span>
        <div className="pass-selector-pills">
          {DEFAULT_PASSES.map((pass) => {
            const isSelected = activePass.id === pass.id;
            return (
              <button
                key={pass.id}
                type="button"
                className={`tracker-pass-chip ${isSelected ? "active" : ""}`}
                onClick={() => {
                  setActivePass(pass);
                  setCurrentStep(2);
                }}
              >
                {pass.type === "metro" ? <Train size={13} /> : pass.type === "ferry" ? <Compass size={13} /> : <Bus size={13} />}
                <span>{pass.city} · {pass.operator.split(" ")[0]}</span>
                <span className="chip-price">₹{pass.priceINR}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Pass Profile Card */}
      <div className="tracker-active-card">
        <div className="active-card-top">
          <div className="active-card-icon-col">
            {activePass.type === "metro" ? (
              <div className="transit-icon-avatar metro">
                <Train size={24} />
              </div>
            ) : activePass.type === "ferry" ? (
              <div className="transit-icon-avatar ferry">
                <Compass size={24} />
              </div>
            ) : (
              <div className="transit-icon-avatar bus">
                <Bus size={24} />
              </div>
            )}
          </div>

          <div className="active-card-details">
            <div className="active-card-badges">
              <span className="carrier-badge">
                <ShieldCheck size={12} /> {activePass.operator}
              </span>
              <span className="city-badge">{activePass.city}, India</span>
              <span className="fare-badge">Guaranteed Tariff: {displayPrice}</span>
            </div>

            <h4 className="active-pass-name">{activePass.name}</h4>
            <div className="active-pass-route">
              <MapPin size={14} className="route-pin" />
              <span>{activePass.route}</span>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Journey Progress Stepper */}
        <div className="tracker-stepper-box">
          <div className="stepper-track-line">
            <div
              className="stepper-track-fill"
              style={{
                width:
                  currentStep === 1
                    ? "12%"
                    : currentStep === 2
                    ? "40%"
                    : currentStep === 3
                    ? "75%"
                    : "100%",
              }}
            />
          </div>

          <div className="stepper-nodes-row">
            {/* Step 1 */}
            <div
              className={`stepper-node ${currentStep >= 1 ? "completed" : ""} ${currentStep === 1 ? "active" : ""}`}
              onClick={() => setCurrentStep(1)}
              role="button"
              tabIndex={0}
            >
              <div className="node-circle">
                {currentStep > 1 ? <Check size={14} /> : <span>1</span>}
              </div>
              <div className="node-label">Fare Lock</div>
              <div className="node-sub">Solana Devnet</div>
            </div>

            {/* Step 2 */}
            <div
              className={`stepper-node ${currentStep >= 2 ? "completed" : ""} ${currentStep === 2 ? "active" : ""}`}
              onClick={() => setCurrentStep(2)}
              role="button"
              tabIndex={0}
            >
              <div className="node-circle">
                {currentStep > 2 ? <Check size={14} /> : <span>2</span>}
              </div>
              <div className="node-label">Pass Issued</div>
              <div className="node-sub">QR Token Ready</div>
            </div>

            {/* Step 3 */}
            <div
              className={`stepper-node ${currentStep >= 3 ? "completed" : ""} ${currentStep === 3 ? "active" : ""}`}
              onClick={() => setCurrentStep(3)}
              role="button"
              tabIndex={0}
            >
              <div className="node-circle">
                {currentStep > 3 ? <Check size={14} /> : <Radio size={14} className="pulse-icon" />}
              </div>
              <div className="node-label">In Transit</div>
              <div className="node-sub">Live Route Active</div>
            </div>

            {/* Step 4 */}
            <div
              className={`stepper-node ${currentStep >= 4 ? "completed" : ""} ${currentStep === 4 ? "active" : ""}`}
              onClick={() => setCurrentStep(4)}
              role="button"
              tabIndex={0}
            >
              <div className="node-circle">
                {currentStep >= 4 ? <CheckCircle2 size={14} /> : <span>4</span>}
              </div>
              <div className="node-label">Destination</div>
              <div className="node-sub">Verified Checkpoint</div>
            </div>
          </div>
        </div>

        {/* Live Checkpoint & Station Telemetry Card */}
        <div className="tracker-telemetry-panel">
          <div className="telemetry-grid">
            <div className="telemetry-card">
              <span className="telemetry-label">Current Location / Station</span>
              <div className="telemetry-value-row">
                <span className="telemetry-indicator online" />
                <span className="telemetry-value">{currentStation}</span>
              </div>
              <span className="telemetry-hint">Platform / Bay Checkpoint Cleared</span>
            </div>

            <div className="telemetry-card">
              <span className="telemetry-label">Next Transit Stop</span>
              <div className="telemetry-value-row">
                <span className="telemetry-indicator moving" />
                <span className="telemetry-value">{nextStation}</span>
              </div>
              <span className="telemetry-hint">Estimated Arrival: ~4 to 7 mins</span>
            </div>

            <div className="telemetry-card">
              <span className="telemetry-label">Tariff Security &amp; Guarantee</span>
              <div className="telemetry-value-row">
                <span className="telemetry-value success">Zero Surge Locked</span>
              </div>
              <span className="telemetry-hint">100% Official RTA Tariff Gazette</span>
            </div>
          </div>

          {/* Cryptographic Transaction Attestation Bar */}
          <div className="tracker-attestation-bar">
            <div className="attestation-left">
              <ShieldCheck size={16} className="attestation-shield" />
              <div>
                <span className="attestation-title">Solana Devnet Transit Attestation</span>
                <span className="attestation-hash">Tx Signature: {activePass.signature}</span>
              </div>
            </div>

            <div className="attestation-actions">
              <button
                type="button"
                className="btn-tracker-copy"
                onClick={handleCopySignature}
                title="Copy Solana Transaction Link"
              >
                {copiedSignature ? (
                  <>
                    <Check size={13} color="#2D5A43" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Tx Hash</span>
                  </>
                )}
              </button>

              <a
                href={`https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tracker-explorer"
                title="Inspect on Solana Explorer"
              >
                <ExternalLink size={13} />
                <span>Explorer</span>
              </a>
            </div>
          </div>

          {/* Interactive Controls & Simulator Actions */}
          <div className="tracker-controls-row">
            <div className="controls-left">
              <button
                type="button"
                className="btn-advance-checkpoint"
                onClick={handleAdvanceStep}
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <span>Validating Checkpoint...</span>
                ) : (
                  <>
                    <span>Advance Next Checkpoint</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-reset-tracker"
                onClick={handleResetStep}
                title="Reset simulation to Step 1"
              >
                <RotateCcw size={13} />
                <span>Restart Journey</span>
              </button>
            </div>

            <div className="controls-right">
              {onOpenPassModal && (
                <button
                  type="button"
                  className="btn-tracker-view-qr"
                  onClick={onOpenPassModal}
                >
                  <QrCode size={14} />
                  <span>View Digital Pass</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
