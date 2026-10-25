"use client";

import { useState, useRef } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { tourismIdl } from "../lib/tourism-idl";
import {
  Map, Users, DollarSign, Receipt, ShieldAlert, BookMarked,
  Search, Menu, X, Globe, Star, CheckCircle, AlertTriangle,
  Info, RefreshCw, Download, Upload, Trash2, Plus, ArrowLeft,
  Loader2, ChevronRight, NavigationIcon, Phone, Shield
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Section =
  | "planner"
  | "agents"
  | "price"
  | "expenses"
  | "scam"
  | "safety"
  | "verification";

type Agent = {
  mintAddress?: string;
  name?: string;
  description?: string;
  active?: boolean;
  services?: Array<{ name: string; endpoint: string }>;
  isTourismRelevant?: boolean;
  relevanceReason?: string;
};

type ItineraryDay = {
  day: number;
  date: string;
  theme: string;
  stops: Array<{
    time: string;
    name: string;
    description: string;
    estimatedCost: string;
    type: string;
  }>;
};

type Itinerary = {
  destination: string;
  duration: string;
  budget: string;
  currency: string;
  summary: string;
  days: ItineraryDay[];
  tips: string[];
  generatedAt: string;
  agentName?: string;
};

type Expense = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  notes?: string;
};

type PriceResult = {
  quotedPrice: number;
  referenceMin: number;
  referenceMax: number;
  currency: string;
  verdict: "fair" | "slightly_high" | "overpriced" | "unknown";
  message: string;
  source: string;
  confidence: string;
};

type SafetyInfo = {
  destination: string;
  advisory: string;
  advisoryLevel: "safe" | "caution" | "warning" | "danger";
  emergencyNumbers: Array<{ type: string; number: string; note?: string }>;
  tips: string[];
  lastChecked: string;
  source: string;
};

type ScamResult = {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  flags: string[];
  advice: string[];
  disclaimer: string;
};

type VerificationRecord = {
  signature: string;
  destination: string;
  hash: string;
  agentAsset: string;
  timestamp: number;
  itinerary?: Itinerary;
};

// ─── Nav items ───────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
  { id: "planner", label: "Travel Planner", icon: <Map size={18} /> },
  { id: "agents", label: "Travel Agents", icon: <Users size={18} /> },
  { id: "price", label: "Fair Price Checker", icon: <DollarSign size={18} /> },
  { id: "expenses", label: "Expense Tracker", icon: <Receipt size={18} /> },
  { id: "scam", label: "Scam Checker", icon: <Shield size={18} /> },
  { id: "safety", label: "Safety & Emergency", icon: <ShieldAlert size={18} /> },
  { id: "verification", label: "Saved Itineraries", icon: <BookMarked size={18} /> },
];

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍽️", Transport: "🚌", Accommodation: "🏨",
  Activities: "🎭", Shopping: "🛍️", Other: "💳",
};

// ─── Helper ──────────────────────────────────────────────────────────────────

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Bytes(text: string): Promise<number[]> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest));
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Home() {
  const [section, setSection] = useState<Section>("planner");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();

  // ── Planner state ──
  const [plannerDestination, setPlannerDestination] = useState("Mysuru, India");
  const [plannerDuration, setPlannerDuration] = useState("3");
  const [plannerBudget, setPlannerBudget] = useState("5000");
  const [plannerCurrency, setPlannerCurrency] = useState("INR");
  const [plannerInterests, setPlannerInterests] = useState("heritage, culture, food");
  const [plannerPace, setPlannerPace] = useState("moderate");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState("");

  // ── Agents state ──
  const [agentQuery, setAgentQuery] = useState("Mysuru");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsStatus, setAgentsStatus] = useState("");
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);
  const [verifyingAsset, setVerifyingAsset] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentDiagnostics, setAgentDiagnostics] = useState<string>("");

  // ── Commitment state ──
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitError, setCommitError] = useState("");
  const [savedRecords, setSavedRecords] = useState<VerificationRecord[]>([]);

  // ── Price state ──
  const [priceService, setPriceService] = useState("Auto-rickshaw");
  const [priceDestInput, setPriceDestInput] = useState("Mysuru");
  const [priceQuote, setPriceQuote] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("INR");
  const [priceDetails, setPriceDetails] = useState("Airport to city centre, ~15 km");
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // ── Expenses state ──
  const [tripBudget, setTripBudget] = useState("15000");
  const [expCurrency, setExpCurrency] = useState("INR");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Food");
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptResult, setReceiptResult] = useState<{merchant?: string; amount?: string; date?: string; category?: string} | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  // ── Scam state ──
  const [scamText, setScamText] = useState("");
  const [scamResult, setScamResult] = useState<ScamResult | null>(null);
  const [scamLoading, setScamLoading] = useState(false);

  // ── Safety state ──
  const [safetyDest, setSafetyDest] = useState("Mysuru, India");
  const [safetyInfo, setSafetyInfo] = useState<SafetyInfo | null>(null);
  const [safetyLoading, setSafetyLoading] = useState(false);

  // ── Verification state ──
  const [verifyHash, setVerifyHash] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyResult, setVerifyResult] = useState<string>("");

  // ─────────────────────────────────────────────────────────────────────────
  // Planner functions
  // ─────────────────────────────────────────────────────────────────────────

  async function generateItinerary() {
    setPlannerLoading(true);
    setPlannerError("");
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: plannerDestination,
          duration: plannerDuration,
          budget: plannerBudget,
          currency: plannerCurrency,
          interests: plannerInterests,
          pace: plannerPace,
          agentName: selectedAgent?.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate itinerary");
      setItinerary(data.itinerary);
    } catch (e) {
      setPlannerError(e instanceof Error ? e.message : "Failed to generate itinerary.");
    } finally {
      setPlannerLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Agent functions
  // ─────────────────────────────────────────────────────────────────────────

  async function discoverAgents() {
    setAgentsLoading(true);
    setAgentsStatus("Querying Metaplex Agent Registry on Solana Devnet…");
    setAgentDiagnostics("");
    setAgents([]);
    try {
      const res = await fetch(`/api/agents?query=${encodeURIComponent(agentQuery)}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Discovery unavailable");
      const list: Agent[] = payload.data?.agents ?? [];
      setAgents(list);
      setAgentDiagnostics(payload.diagnostics || "");
      if (payload.fallbackSearch) {
        setAgentsStatus(
          `No agent name matches "${payload.originalQuery}" in the registry. Showing all active registered agents (${list.length} found). Registry agents are not pre-classified by tourism specialty.`
        );
      } else {
        setAgentsStatus(
          `Found ${list.length} registered agent(s). None are pre-classified as tourism specialists in the registry — check their descriptions for relevance.`
        );
      }
    } catch (e) {
      setAgentsStatus(
        e instanceof Error ? e.message : "Agent discovery failed."
      );
    } finally {
      setAgentsLoading(false);
    }
  }

  async function verifyAgent(asset?: string) {
    if (!asset) return;
    setVerifyingAsset(asset);
    try {
      const res = await fetch(`/api/agents/verify?asset=${encodeURIComponent(asset)}`);
      const payload = await res.json();
      if (!res.ok || !payload.registered) {
        setVerifiedAsset(null);
        setAgentsStatus("This asset does not have a readable registered agent identity on Devnet.");
      } else {
        setVerifiedAsset(asset);
        setAgentsStatus(`✓ On-chain identity verified. PDA: ${payload.identityPda}`);
      }
    } finally {
      setVerifyingAsset(null);
    }
  }

  async function commitItinerary() {
    if (!verifiedAsset || !wallet.publicKey || !wallet.sendTransaction) {
      setCommitError("Connect a wallet and verify an agent before committing.");
      return;
    }
    if (!itinerary) {
      setCommitError("Generate an itinerary first.");
      return;
    }
    const programId = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID;
    if (!programId) {
      setCommitError("Program ID not configured. Set NEXT_PUBLIC_TOURISM_PROGRAM_ID.");
      return;
    }
    setCommitLoading(true);
    setCommitError("");
    try {
      const provider = new AnchorProvider(connection, wallet as never, { commitment: "confirmed" });
      const program = new Program({ ...tourismIdl, address: programId } as unknown as Idl, provider);
      const commitment = Keypair.generate();
      const canonical = JSON.stringify({
        destination: itinerary.destination,
        duration: itinerary.duration,
        days: itinerary.days,
      });
      const hashBytes = await sha256Bytes(canonical);
      const hashHex = await sha256Hex(canonical);
      const instruction = await program.methods
        .commitItinerary(
          new PublicKey(verifiedAsset),
          hashBytes,
          itinerary.destination.slice(0, 64)
        )
        .accounts({
          commitment: commitment.publicKey,
          traveler: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      const tx = new Transaction().add(instruction);
      const sig = await wallet.sendTransaction(tx, connection, { signers: [commitment] });
      await connection.confirmTransaction(sig, "confirmed");
      const record: VerificationRecord = {
        signature: sig,
        destination: itinerary.destination,
        hash: hashHex,
        agentAsset: verifiedAsset,
        timestamp: Date.now(),
        itinerary,
      };
      setSavedRecords((prev) => [record, ...prev]);
      setSection("verification");
    } catch (e) {
      setCommitError(e instanceof Error ? e.message : "Commitment transaction failed.");
    } finally {
      setCommitLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Price functions
  // ─────────────────────────────────────────────────────────────────────────

  async function checkPrice() {
    if (!priceQuote) return;
    setPriceLoading(true);
    setPriceResult(null);
    try {
      const res = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: priceService,
          destination: priceDestInput,
          quotedPrice: parseFloat(priceQuote),
          currency: priceCurrency,
          details: priceDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Price check failed");
      setPriceResult(data.result);
    } catch (e) {
      setPriceResult({
        quotedPrice: parseFloat(priceQuote),
        referenceMin: 0,
        referenceMax: 0,
        currency: priceCurrency,
        verdict: "unknown",
        message: e instanceof Error ? e.message : "Price check unavailable.",
        source: "N/A",
        confidence: "low",
      });
    } finally {
      setPriceLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Expense functions
  // ─────────────────────────────────────────────────────────────────────────

  function addExpense() {
    if (!newExpName || !newExpAmount) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      name: newExpName,
      amount: parseFloat(newExpAmount),
      currency: expCurrency,
      category: newExpCategory,
      date: newExpDate,
    };
    setExpenses((prev) => [expense, ...prev]);
    setNewExpName("");
    setNewExpAmount("");
    setReceiptResult(null);
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  async function scanReceipt(file: File) {
    setReceiptLoading(true);
    setReceiptResult(null);
    try {
      const formData = new FormData();
      formData.append("receipt", file);
      const res = await fetch("/api/receipt", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OCR failed");
      setReceiptResult(data.extracted);
      if (data.extracted.merchant) setNewExpName(data.extracted.merchant);
      if (data.extracted.amount) setNewExpAmount(data.extracted.amount.replace(/[^0-9.]/g, ""));
      if (data.extracted.date) setNewExpDate(data.extracted.date);
      if (data.extracted.category) setNewExpCategory(data.extracted.category);
    } catch {
      setReceiptResult({ merchant: "", amount: "OCR unavailable — enter manually.", date: "", category: "" });
    } finally {
      setReceiptLoading(false);
    }
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetNum = parseFloat(tripBudget) || 0;
  const remaining = budgetNum - totalSpent;
  const budgetPct = budgetNum > 0 ? Math.min((totalSpent / budgetNum) * 100, 100) : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Scam functions
  // ─────────────────────────────────────────────────────────────────────────

  async function checkScam() {
    if (!scamText.trim()) return;
    setScamLoading(true);
    setScamResult(null);
    try {
      const res = await fetch("/api/scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scamText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scam check failed");
      setScamResult(data.result);
    } catch {
      setScamResult({
        riskLevel: "unknown" as never,
        riskScore: 0,
        flags: ["Analysis unavailable — please check manually."],
        advice: ["Be cautious with any offer that seems unusually cheap or requires upfront payment."],
        disclaimer: "This is AI-generated risk guidance, not legal advice.",
      });
    } finally {
      setScamLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Safety functions
  // ─────────────────────────────────────────────────────────────────────────

  async function fetchSafety() {
    setSafetyLoading(true);
    setSafetyInfo(null);
    try {
      const res = await fetch(`/api/safety?destination=${encodeURIComponent(safetyDest)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Safety info unavailable");
      setSafetyInfo(data.safety);
    } catch (e) {
      setSafetyInfo({
        destination: safetyDest,
        advisory: e instanceof Error ? e.message : "Unable to retrieve safety information.",
        advisoryLevel: "caution",
        emergencyNumbers: [],
        tips: ["Always carry local emergency contacts.", "Register with your embassy if travelling long-term."],
        lastChecked: new Date().toISOString(),
        source: "Fallback",
      });
    } finally {
      setSafetyLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Verification
  // ─────────────────────────────────────────────────────────────────────────

  async function verifyItinerary() {
    if (!verifyHash || !verifySignature) return;
    const record = savedRecords.find((r) => r.signature === verifySignature);
    if (!record) {
      setVerifyResult("No saved local record for this signature.");
      return;
    }
    if (record.hash === verifyHash) {
      setVerifyResult("✓ Hash matches the saved record. The itinerary has not been altered.");
    } else {
      setVerifyResult("✗ Hash mismatch — the itinerary content differs from what was committed on-chain.");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────────────

  function navigate(id: Section) {
    setSection(id);
    setSidebarOpen(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render sections
  // ─────────────────────────────────────────────────────────────────────────

  function renderPlanner() {
    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">AI-Powered</div>
          <h1 className="page-title">Travel Planner</h1>
          <p className="page-subtitle">
            Generate a day-by-day itinerary with estimated costs. Content is AI-generated — verify opening hours and prices locally.
          </p>
        </div>

        <div className="card">
          <div className="section-title">Trip Details</div>
          <div className="card-grid" style={{ gap: 14 }}>
            <div className="input-group">
              <label className="input-label">Destination</label>
              <div className="input-with-icon">
                <Globe size={16} className="input-icon" />
                <input className="input-field" style={{ paddingLeft: 40 }} value={plannerDestination}
                  onChange={(e) => setPlannerDestination(e.target.value)} placeholder="e.g. Mysuru, India" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Duration (days)</label>
              <input className="input-field" type="number" min="1" max="30" value={plannerDuration}
                onChange={(e) => setPlannerDuration(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Budget</label>
              <input className="input-field" type="number" value={plannerBudget}
                onChange={(e) => setPlannerBudget(e.target.value)} placeholder="5000" />
            </div>
            <div className="input-group">
              <label className="input-label">Currency</label>
              <select className="select-field" value={plannerCurrency} onChange={(e) => setPlannerCurrency(e.target.value)}>
                <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option><option>AUD</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Interests</label>
              <input className="input-field" value={plannerInterests}
                onChange={(e) => setPlannerInterests(e.target.value)} placeholder="heritage, food, adventure…" />
            </div>
            <div className="input-group">
              <label className="input-label">Travel Pace</label>
              <select className="select-field" value={plannerPace} onChange={(e) => setPlannerPace(e.target.value)}>
                <option value="relaxed">Relaxed</option>
                <option value="moderate">Moderate</option>
                <option value="packed">Packed</option>
              </select>
            </div>
          </div>

          {selectedAgent && (
            <div className="status-bar info" style={{ marginTop: 16 }}>
              <Info size={16} />
              <span>Using registered agent: <strong>{selectedAgent.name}</strong> — {selectedAgent.description?.slice(0, 80)}…</span>
            </div>
          )}

          {plannerError && (
            <div className="status-bar error" style={{ marginTop: 16 }}>
              <AlertTriangle size={16} /> {plannerError}
            </div>
          )}

          <div className="row" style={{ marginTop: 20, gap: 10 }}>
            <button className="btn btn-primary" onClick={generateItinerary} disabled={plannerLoading}>
              {plannerLoading ? <><span className="spinner" /> Generating…</> : <><Star size={16} /> Generate Itinerary</>}
            </button>
            {itinerary && (
              <button className="btn btn-secondary" onClick={() => setItinerary(null)}>
                <RefreshCw size={16} /> Clear
              </button>
            )}
          </div>
        </div>

        {itinerary && (
          <div className="col">
            <div className="card">
              <div className="row-between">
                <div>
                  <div className="page-eyebrow">{itinerary.duration} · {itinerary.budget} {itinerary.currency}</div>
                  <div className="section-title" style={{ marginBottom: 4 }}>{itinerary.destination}</div>
                  <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{itinerary.summary}</p>
                </div>
                <div className="tag-list" style={{ alignItems: "flex-start" }}>
                  {plannerInterests.split(",").slice(0, 3).map((t) => (
                    <span key={t} className="tag">{t.trim()}</span>
                  ))}
                </div>
              </div>
              <div className="divider" />
              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setSection("agents"); }}>
                  <Users size={14} /> Find Verified Agent
                </button>
                {verifiedAsset && itinerary && (
                  <button className="btn btn-secondary btn-sm" onClick={commitItinerary} disabled={commitLoading}>
                    {commitLoading ? <><span className="spinner" /> Committing…</> : <><CheckCircle size={14} /> Commit Hash on Devnet</>}
                  </button>
                )}
              </div>
              {commitError && <div className="status-bar error" style={{ marginTop: 12 }}><AlertTriangle size={14} /> {commitError}</div>}
            </div>

            {itinerary.days.map((day) => (
              <div key={day.day} className="day-card">
                <div className="day-card-header">
                  <div>
                    <div className="day-number">Day {day.day}</div>
                    <div className="day-title">{day.theme}</div>
                  </div>
                  <div className="day-date">{day.date}</div>
                </div>
                <div className="day-card-body">
                  {day.stops.map((stop, i) => (
                    <div key={i} className="stop-item">
                      <div className="stop-time">{stop.time}</div>
                      <div className="stop-content">
                        <div className="stop-name">{stop.name}</div>
                        <div className="stop-desc">{stop.description}</div>
                        {stop.estimatedCost && <div className="stop-cost">Est. {stop.estimatedCost} {itinerary.currency}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {itinerary.tips.length > 0 && (
              <div className="card card-sm">
                <div className="section-title" style={{ marginBottom: 10 }}>💡 Travel Tips</div>
                <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                  {itinerary.tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="status-bar warning">
              <AlertTriangle size={16} />
              <span>AI-generated itinerary. Costs are estimates only. Verify opening hours, entry fees, and transport rates locally before travel.</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderAgents() {
    const advisoryLevelColor = (level: string) => {
      if (level === "safe") return "var(--success)";
      if (level === "caution") return "var(--warning)";
      return "var(--error)";
    };
    void advisoryLevelColor;

    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">Solana AI Agent Registry</div>
          <h1 className="page-title">Travel Agents</h1>
          <p className="page-subtitle">
            Discover agents registered on Solana via the Metaplex Agent Registry.
            Registration confirms an on-chain identity only — not tourism expertise or service quality.
          </p>
        </div>

        <div className="card">
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <div className="input-with-icon" style={{ flex: 1 }}>
              <Search size={16} className="input-icon" />
              <input className="input-field" style={{ paddingLeft: 40 }} value={agentQuery}
                onChange={(e) => setAgentQuery(e.target.value)}
                placeholder="Search agents by name…"
                onKeyDown={(e) => e.key === "Enter" && discoverAgents()} />
            </div>
            <button className="btn btn-primary" onClick={discoverAgents} disabled={agentsLoading}>
              {agentsLoading ? <><span className="spinner" /> Searching…</> : <><Search size={16} /> Discover Agents</>}
            </button>
          </div>

          {agentsStatus && (
            <div className="status-bar info" style={{ marginTop: 14 }}>
              <Info size={16} />
              <span>{agentsStatus}</span>
            </div>
          )}

          {agentDiagnostics && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ fontSize: 12, color: "var(--gray)", cursor: "pointer" }}>Registry diagnostics</summary>
              <pre style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {agentDiagnostics}
              </pre>
            </details>
          )}
        </div>

        {agents.length === 0 && !agentsLoading && agentsStatus && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No agents returned</div>
              <div className="empty-state-desc">
                The Metaplex Agent Registry returned no results for this query.
                The Devnet registry is sparse — most registered agents are development/test entries, not tourism services.
              </div>
            </div>
          </div>
        )}

        <div className="card-grid">
          {agents.map((agent) => (
            <div
              key={agent.mintAddress ?? agent.name}
              className={`agent-card ${verifiedAsset === agent.mintAddress ? "verified" : ""}`}
            >
              <div className="agent-card-header">
                <div>
                  <div className="agent-card-name">{agent.name ?? "Unnamed agent"}</div>
                  <div style={{ marginTop: 4 }}>
                    <span className="badge badge-yellow" style={{ fontSize: 10 }}>REGISTRY RESULT</span>
                    {agent.active && <span className="badge badge-green" style={{ marginLeft: 4, fontSize: 10 }}>ACTIVE</span>}
                    {verifiedAsset === agent.mintAddress && (
                      <span className="badge badge-green" style={{ marginLeft: 4, fontSize: 10 }}><CheckCircle size={10} /> VERIFIED</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="agent-card-desc">
                {agent.description ?? "No description provided in registration metadata."}
              </div>

              {agent.mintAddress && (
                <div className="agent-card-meta">
                  Asset: {agent.mintAddress.slice(0, 20)}…{agent.mintAddress.slice(-8)}
                </div>
              )}

              {agent.services && agent.services.length > 0 && (
                <div className="tag-list">
                  {agent.services.slice(0, 3).map((s, i) => (
                    <span key={i} className="tag">{s.name}</span>
                  ))}
                </div>
              )}

              <div className="agent-card-actions">
                {agent.mintAddress && (
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={verifyingAsset === agent.mintAddress}
                    onClick={() => verifyAgent(agent.mintAddress)}
                  >
                    {verifyingAsset === agent.mintAddress
                      ? <><span className="spinner" /> Verifying…</>
                      : verifiedAsset === agent.mintAddress
                        ? <><CheckCircle size={14} /> Verified</>
                        : "Verify Identity"}
                  </button>
                )}
                {verifiedAsset === agent.mintAddress && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => { setSelectedAgent(agent); setSection("planner"); }}
                  >
                    Use Agent <ChevronRight size={14} />
                  </button>
                )}
                {agent.mintAddress && (
                  <a
                    href={`https://explorer.solana.com/address/${agent.mintAddress}?cluster=devnet`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Explorer ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="status-bar warning">
          <AlertTriangle size={16} />
          <span>
            Registry on-chain identity ≠ tourism expertise, safety guarantee, or service quality.
            Most Devnet agents are test/development entries. If no tourism agent exists in the registry,
            the planner works as an off-chain AI fallback — itinerary commitment still uses the registry identity you select.
          </span>
        </div>
      </div>
    );
  }

  function renderPrice() {
    const verdictColor = {
      fair: "var(--success)",
      slightly_high: "var(--warning)",
      overpriced: "var(--error)",
      unknown: "var(--gray)",
    };
    const verdictLabel = {
      fair: "Fair Price ✓",
      slightly_high: "Slightly High",
      overpriced: "Potentially Overpriced",
      unknown: "Cannot Verify",
    };

    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">Tourist Protection</div>
          <h1 className="page-title">Fair Price Checker</h1>
          <p className="page-subtitle">
            Compare a quoted price against reference rates for common tourist services.
            Estimates are reference benchmarks — not live pricing.
          </p>
        </div>

        <div className="card">
          <div className="card-grid" style={{ gap: 14 }}>
            <div className="input-group">
              <label className="input-label">Service Type</label>
              <select className="select-field" value={priceService} onChange={(e) => setPriceService(e.target.value)}>
                <option>Auto-rickshaw</option>
                <option>Taxi / Cab</option>
                <option>Hotel room (budget)</option>
                <option>Hotel room (mid-range)</option>
                <option>Restaurant meal</option>
                <option>Entry ticket</option>
                <option>Tour guide (half-day)</option>
                <option>Tour guide (full-day)</option>
                <option>Bicycle rental</option>
                <option>Bus ticket</option>
                <option>Train ticket</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Destination / City</label>
              <input className="input-field" value={priceDestInput}
                onChange={(e) => setPriceDestInput(e.target.value)} placeholder="e.g. Mysuru" />
            </div>
            <div className="input-group">
              <label className="input-label">Quoted Price</label>
              <input className="input-field" type="number" value={priceQuote}
                onChange={(e) => setPriceQuote(e.target.value)} placeholder="e.g. 500" />
            </div>
            <div className="input-group">
              <label className="input-label">Currency</label>
              <select className="select-field" value={priceCurrency} onChange={(e) => setPriceCurrency(e.target.value)}>
                <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option>
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
              <label className="input-label">Additional Details (optional)</label>
              <input className="input-field" value={priceDetails}
                onChange={(e) => setPriceDetails(e.target.value)}
                placeholder="e.g. Airport to city centre, ~15 km" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={checkPrice} disabled={priceLoading || !priceQuote}>
            {priceLoading ? <><span className="spinner" /> Checking…</> : <><DollarSign size={16} /> Check Price</>}
          </button>
        </div>

        {priceResult && (
          <div className="price-result-card">
            <div className="row-between">
              <div className="section-title">{priceService} · {priceDestInput}</div>
              <span className="badge" style={{
                background: `${verdictColor[priceResult.verdict]}22`,
                color: verdictColor[priceResult.verdict],
                fontSize: 12
              }}>
                {verdictLabel[priceResult.verdict]}
              </span>
            </div>

            <div className="price-comparison">
              <div className="price-item">
                <div className="price-label">Quoted Price</div>
                <div className="price-value quoted">
                  {priceResult.quotedPrice.toLocaleString()} {priceResult.currency}
                </div>
              </div>
              {priceResult.verdict !== "unknown" && (
                <>
                  <div style={{ color: "var(--gray)", fontSize: 24 }}>vs</div>
                  <div className="price-item">
                    <div className="price-label">Reference Range</div>
                    <div className={`price-value ${priceResult.verdict === "fair" ? "fair" : "overprice"}`}>
                      {priceResult.referenceMin.toLocaleString()}–{priceResult.referenceMax.toLocaleString()} {priceResult.currency}
                    </div>
                  </div>
                </>
              )}
            </div>

            {priceResult.verdict !== "unknown" && priceResult.referenceMax > 0 && (
              <div className="price-bar-wrap">
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                  Quoted vs reference max
                </div>
                <div className="price-bar">
                  <div
                    className="price-bar-fill"
                    style={{
                      width: `${Math.min((priceResult.quotedPrice / priceResult.referenceMax) * 100, 100)}%`,
                      background: verdictColor[priceResult.verdict],
                    }}
                  />
                </div>
              </div>
            )}

            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{priceResult.message}</p>

            <div className="row" style={{ marginTop: 12, gap: 16, fontSize: 12, color: "var(--gray)" }}>
              <span>Source: {priceResult.source}</span>
              <span>Confidence: {priceResult.confidence}</span>
            </div>

            <div className="status-bar warning" style={{ marginTop: 16, fontSize: 12 }}>
              <AlertTriangle size={14} />
              Reference prices are estimates based on typical local rates. Actual prices vary by season, negotiation, and availability.
              This tool flags potential overpricing — it does not accuse anyone of fraud.
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderExpenses() {
    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">Budget Management</div>
          <h1 className="page-title">Expense Tracker</h1>
          <p className="page-subtitle">Track your trip spending. Receipts and personal data stay off-chain.</p>
        </div>

        <div className="expense-summary">
          <div className="expense-stat">
            <div className="expense-stat-label">Total Budget</div>
            <div className="expense-stat-value">{parseFloat(tripBudget || "0").toLocaleString()} {expCurrency}</div>
          </div>
          <div className="expense-stat">
            <div className="expense-stat-label">Spent</div>
            <div className={`expense-stat-value ${budgetPct > 90 ? "danger" : budgetPct > 70 ? "warning" : ""}`}>
              {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })} {expCurrency}
            </div>
          </div>
          <div className="expense-stat">
            <div className="expense-stat-label">Remaining</div>
            <div className={`expense-stat-value ${remaining < 0 ? "danger" : remaining < budgetNum * 0.1 ? "warning" : "positive"}`}>
              {remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })} {expCurrency}
            </div>
          </div>
          <div className="expense-stat">
            <div className="expense-stat-label">Expenses</div>
            <div className="expense-stat-value">{expenses.length}</div>
          </div>
        </div>

        <div className="price-bar-wrap card" style={{ padding: "16px 20px" }}>
          <div className="row-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Budget used</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: budgetPct > 90 ? "var(--error)" : "var(--white)" }}>
              {budgetPct.toFixed(1)}%
            </span>
          </div>
          <div className="price-bar">
            <div className="price-bar-fill" style={{
              width: `${budgetPct}%`,
              background: budgetPct > 90 ? "var(--error)" : budgetPct > 70 ? "var(--warning)" : "var(--success)"
            }} />
          </div>
        </div>

        <div className="card">
          <div className="section-title">Add Expense</div>
          <div className="row" style={{ marginBottom: 12 }}>
            <input type="number" value={tripBudget} onChange={(e) => setTripBudget(e.target.value)}
              className="input-field" style={{ maxWidth: 140 }} placeholder="Budget" />
            <select className="select-field" style={{ maxWidth: 100 }} value={expCurrency} onChange={(e) => setExpCurrency(e.target.value)}>
              <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => receiptInputRef.current?.click()}>
              {receiptLoading ? <><span className="spinner" /> Scanning…</> : <><Upload size={14} /> Scan Receipt</>}
            </button>
            <input ref={receiptInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) scanReceipt(e.target.files[0]); }} />
          </div>

          {receiptResult && (
            <div className="status-bar info" style={{ marginBottom: 12, fontSize: 12 }}>
              <Info size={14} />
              OCR extracted: {receiptResult.merchant || "—"} · {receiptResult.amount || "—"} · {receiptResult.date || "—"}
              {receiptResult.amount === "OCR unavailable — enter manually." && " (manual entry required)"}
            </div>
          )}

          <div className="card-grid" style={{ gap: 10 }}>
            <div className="input-group">
              <label className="input-label">Description</label>
              <input className="input-field" value={newExpName} onChange={(e) => setNewExpName(e.target.value)} placeholder="e.g. Lunch at hotel" />
            </div>
            <div className="input-group">
              <label className="input-label">Amount</label>
              <input className="input-field" type="number" value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="select-field" value={newExpCategory} onChange={(e) => setNewExpCategory(e.target.value)}>
                {Object.keys(CATEGORY_ICONS).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Date</label>
              <input className="input-field" type="date" value={newExpDate} onChange={(e) => setNewExpDate(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={addExpense} disabled={!newExpName || !newExpAmount}>
            <Plus size={16} /> Add Expense
          </button>
        </div>

        {Object.keys(byCategory).length > 0 && (
          <div className="card card-sm">
            <div className="section-title" style={{ marginBottom: 10 }}>By Category</div>
            <div className="tag-list">
              {Object.entries(byCategory).map(([cat, amt]) => (
                <span key={cat} className="badge badge-gray" style={{ fontSize: 12 }}>
                  {CATEGORY_ICONS[cat]} {cat}: {amt.toLocaleString(undefined, { maximumFractionDigits: 2 })} {expCurrency}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="expense-list">
          {expenses.length === 0 && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">💳</div>
                <div className="empty-state-title">No expenses yet</div>
                <div className="empty-state-desc">Add an expense above or scan a receipt.</div>
              </div>
            </div>
          )}
          {expenses.map((e) => (
            <div key={e.id} className="expense-item">
              <div className="expense-icon" style={{ background: "rgba(248,208,87,0.12)" }}>
                {CATEGORY_ICONS[e.category] || "💳"}
              </div>
              <div className="expense-item-info">
                <div className="expense-item-name">{e.name}</div>
                <div className="expense-item-meta">{e.category} · {e.date}</div>
              </div>
              <div className="expense-item-amount">
                {e.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {e.currency}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => deleteExpense(e.id)} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderScam() {
    const riskColor = { low: "var(--success)", medium: "var(--warning)", high: "var(--error)" };
    const riskLabel = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">Tourist Safety</div>
          <h1 className="page-title">Scam Checker</h1>
          <p className="page-subtitle">
            Paste a suspicious offer, message, or describe a situation.
            Get AI-powered risk flags and verification steps.
          </p>
        </div>

        <div className="card">
          <div className="input-group">
            <label className="input-label">Describe the offer, message, or situation</label>
            <textarea className="textarea-field" value={scamText}
              onChange={(e) => setScamText(e.target.value)}
              placeholder="e.g. 'A man approached me at the palace gate offering a private tour for ₹8000 and said it was government-authorised…'" />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={checkScam} disabled={scamLoading || !scamText.trim()}>
            {scamLoading ? <><span className="spinner" /> Analysing…</> : <><Shield size={16} /> Analyse Risk</>}
          </button>
        </div>

        {scamResult && (
          <div className="card">
            <div className="row-between" style={{ marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Risk Assessment</div>
              <span className="badge" style={{
                background: `${(riskColor as Record<string,string>)[scamResult.riskLevel]}22`,
                color: (riskColor as Record<string,string>)[scamResult.riskLevel],
              }}>
                {(riskLabel as Record<string,string>)[scamResult.riskLevel] ?? "Unknown"}
              </span>
            </div>

            <div className="risk-meter">
              <div className="row-between" style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                <span>Risk Score</span><span>{scamResult.riskScore}/10</span>
              </div>
              <div className="risk-bar">
                <div
                  className={`risk-fill risk-${scamResult.riskLevel}`}
                  style={{ width: `${scamResult.riskScore * 10}%` }}
                />
              </div>
            </div>

            {scamResult.flags.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>⚠️ Warning Signs Detected</div>
                <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                  {scamResult.flags.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {scamResult.advice.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>✓ Recommended Steps</div>
                <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                  {scamResult.advice.map((a, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="status-bar warning" style={{ marginTop: 16, fontSize: 12 }}>
              <AlertTriangle size={14} /> {scamResult.disclaimer}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderSafety() {
    const advisoryColors: Record<string, string> = {
      safe: "var(--success)", caution: "var(--warning)", warning: "var(--warning)", danger: "var(--error)"
    };
    const advisoryEmoji: Record<string, string> = {
      safe: "✅", caution: "⚠️", warning: "🟠", danger: "🔴"
    };

    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">Stay Safe</div>
          <h1 className="page-title">Safety & Emergency</h1>
          <p className="page-subtitle">
            Destination safety information, emergency contacts, and travel advisories.
            Always verify emergency numbers with local authorities.
          </p>
        </div>

        <div className="card">
          <div className="row" style={{ gap: 10 }}>
            <div className="input-with-icon" style={{ flex: 1 }}>
              <NavigationIcon size={16} className="input-icon" />
              <input className="input-field" style={{ paddingLeft: 40 }} value={safetyDest}
                onChange={(e) => setSafetyDest(e.target.value)}
                placeholder="e.g. Mysuru, India"
                onKeyDown={(e) => e.key === "Enter" && fetchSafety()} />
            </div>
            <button className="btn btn-primary" onClick={fetchSafety} disabled={safetyLoading}>
              {safetyLoading ? <><span className="spinner" /> Loading…</> : <><ShieldAlert size={16} /> Get Safety Info</>}
            </button>
          </div>
        </div>

        {safetyInfo && (
          <div className="col">
            <div className="card">
              <div className="row-between" style={{ marginBottom: 12 }}>
                <div>
                  <div className="section-title" style={{ marginBottom: 4 }}>{safetyInfo.destination}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    Last checked: {new Date(safetyInfo.lastChecked).toLocaleString()} · Source: {safetyInfo.source}
                  </div>
                </div>
                <span className="badge" style={{
                  background: `${advisoryColors[safetyInfo.advisoryLevel]}22`,
                  color: advisoryColors[safetyInfo.advisoryLevel],
                  fontSize: 13,
                  padding: "6px 12px",
                }}>
                  {advisoryEmoji[safetyInfo.advisoryLevel]} {safetyInfo.advisoryLevel.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {safetyInfo.advisory}
              </p>
            </div>

            {safetyInfo.emergencyNumbers.length > 0 && (
              <div>
                <div className="section-title">Emergency Contacts</div>
                <div className="emergency-grid">
                  {safetyInfo.emergencyNumbers.map((en, i) => (
                    <div key={i} className="emergency-card">
                      <div className="emergency-number">
                        <Phone size={16} style={{ display: "inline", marginRight: 6 }} />
                        {en.number}
                      </div>
                      <div className="emergency-type">{en.type}</div>
                      {en.note && <div className="emergency-desc">{en.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {safetyInfo.tips.length > 0 && (
              <div className="card card-sm">
                <div className="section-title" style={{ marginBottom: 10 }}>Safety Tips</div>
                <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {safetyInfo.tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="status-bar warning">
              <AlertTriangle size={16} />
              Emergency numbers shown are based on reference data and may not be current.
              Always confirm with local authorities. Do not rely solely on this app in an emergency.
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderVerification() {
    return (
      <div className="col">
        <div className="page-header">
          <div className="page-eyebrow">On-Chain Records</div>
          <h1 className="page-title">Saved Itineraries</h1>
          <p className="page-subtitle">
            Itinerary hashes committed to Solana Devnet.
            Compare a hash to detect if the plan was altered after commitment.
          </p>
        </div>

        {savedRecords.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No committed records yet</div>
              <div className="empty-state-desc">
                Generate an itinerary, verify an agent identity, then click &quot;Commit Hash on Devnet&quot;
                from the Travel Planner. The transaction signature and hash will appear here.
              </div>
            </div>
            <button className="btn btn-primary" style={{ margin: "16px auto 0", display: "flex" }} onClick={() => setSection("planner")}>
              <ArrowLeft size={16} /> Go to Planner
            </button>
          </div>
        )}

        {savedRecords.map((record) => (
          <div key={record.signature} className="card">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <div>
                <div className="section-title" style={{ marginBottom: 4 }}>{record.destination}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Committed: {new Date(record.timestamp).toLocaleString()}
                </div>
              </div>
              <span className="badge badge-green"><CheckCircle size={12} /> ON-CHAIN</span>
            </div>

            <div className="input-group" style={{ marginBottom: 12 }}>
              <label className="input-label">Itinerary Hash (SHA-256)</label>
              <div className="verification-hash">{record.hash}</div>
            </div>

            <div className="input-group" style={{ marginBottom: 12 }}>
              <label className="input-label">Transaction Signature</label>
              <div className="verification-hash">{record.signature}</div>
            </div>

            <div className="input-group" style={{ marginBottom: 12 }}>
              <label className="input-label">Agent Asset</label>
              <div className="verification-hash">{record.agentAsset}</div>
            </div>

            <div className="row" style={{ gap: 10 }}>
              <a
                href={`https://explorer.solana.com/tx/${record.signature}?cluster=devnet`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                View on Explorer ↗
              </a>
              <button className="btn btn-ghost btn-sm" onClick={() => {
                setVerifyHash(record.hash);
                setVerifySignature(record.signature);
              }}>
                Verify Integrity
              </button>
            </div>
          </div>
        ))}

        <div className="card">
          <div className="section-title">Verify an Itinerary</div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
            Paste the hash and signature of a previously committed itinerary to check if it was altered.
          </p>
          <div className="input-group" style={{ marginBottom: 10 }}>
            <label className="input-label">Hash to verify</label>
            <input className="input-field" value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} placeholder="SHA-256 hex…" style={{ fontFamily: "monospace" }} />
          </div>
          <div className="input-group" style={{ marginBottom: 14 }}>
            <label className="input-label">Transaction Signature</label>
            <input className="input-field" value={verifySignature} onChange={(e) => setVerifySignature(e.target.value)} placeholder="Devnet signature…" style={{ fontFamily: "monospace" }} />
          </div>
          <button className="btn btn-primary" onClick={verifyItinerary} disabled={!verifyHash || !verifySignature}>
            <CheckCircle size={16} /> Verify Integrity
          </button>
          {verifyResult && (
            <div className={`status-bar ${verifyResult.startsWith("✓") ? "success" : "error"}`} style={{ marginTop: 14 }}>
              {verifyResult.startsWith("✓") ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {verifyResult}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // App shell render
  // ─────────────────────────────────────────────────────────────────────────

  const sectionRenderers: Record<Section, () => React.ReactNode> = {
    planner: renderPlanner,
    agents: renderAgents,
    price: renderPrice,
    expenses: renderExpenses,
    scam: renderScam,
    safety: renderSafety,
    verification: renderVerification,
  };

  return (
    <div className="app-layout">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">✈</div>
          <div>
            <div className="sidebar-logo-text">ProofTrip</div>
            <div className="sidebar-logo-sub">Solana Tourism AI</div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${section === item.id ? "active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div style={{ fontSize: 11, color: "var(--gray)", lineHeight: 1.5, padding: "0 12px" }}>
            Program: {process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID
              ? `${process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID.slice(0, 12)}…`
              : "A7yU8i4…VSzN"
            }
            <br />Network: Solana Devnet
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="topbar-search">
            <Search size={16} />
            <input
              placeholder="Find your adventure…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) { setPlannerDestination(val); setAgentQuery(val); setPriceDestInput(val); setSafetyDest(val); setSection("planner"); }
                }
              }}
            />
          </div>

          <div className="topbar-right">
            <div className="topbar-greeting" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {wallet.connected
                ? <><CheckCircle size={14} style={{ color: "var(--success)" }} /> <span style={{ fontFamily: "monospace", fontSize: 12 }}>{wallet.publicKey?.toBase58().slice(0, 8)}…</span></>
                : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>No wallet</span>
              }
            </div>
            <WalletMultiButton />
          </div>
        </header>

        <main className="page-content">
          {sectionRenderers[section]()}
        </main>
      </div>
    </div>
  );
}
