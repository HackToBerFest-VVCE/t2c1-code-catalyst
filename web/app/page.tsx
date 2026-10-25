"use client";

import React, { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { tourismIdl } from "../lib/tourism-idl";
import {
  Globe,
  Compass,
  Heart,
  User,
  Search,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Shield,
  Phone,
  DollarSign,
  Receipt,
  ExternalLink,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";

// ─── Destination Data matching mockup & hackathon destinations ───────────────
type DestinationItem = {
  id: string;
  name: string;
  country: string;
  flag: string;
  price: string;
  tag: string;
  tagline: string;
  tripTitle: string;
  duration: string;
  activityLevel: string;
  accommodation: string;
  bestSeason: string;
  description: string;
  heroImg: string;
  thumbs: string[];
  stops: Array<{ time: string; name: string; cost: string }>;
};

const DESTINATIONS: DestinationItem[] = [
  {
    id: "greece",
    name: "Greece",
    country: "Greece",
    flag: "🇬🇷",
    price: "$2,950 per person",
    tag: "Trending",
    tagline: "Sunlit islands, ancient ruins, and the timeless charm of the Mediterranean.",
    tripTitle: "Isles of Myth & Sun",
    duration: "8 days",
    activityLevel: "Moderate",
    accommodation: "4-star hotels",
    bestSeason: "May – October",
    description: "Greece is a destination where ancient history meets crystal-clear seas and vibrant island culture. Explore the Acropolis in Athens, watch world-famous sunsets in Santorini, and savor authentic Mediterranean dining.",
    heroImg: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "09:00", name: "Acropolis & Parthenon", cost: "$35" },
      { time: "13:00", name: "Plaka Traditional Taverna", cost: "$25" },
      { time: "17:00", name: "Oia Sunset Walk, Santorini", cost: "$0" },
    ],
  },
  {
    id: "peru",
    name: "Peru",
    country: "Peru",
    flag: "🇵🇪",
    price: "From $2450",
    tag: "Budget Friendly",
    tagline: "Mystical mountains, sacred valleys, and the ancient citadel of Machu Picchu.",
    tripTitle: "Inca Trail & Sacred Peaks",
    duration: "7 days",
    activityLevel: "Challenging",
    accommodation: "Boutique Lodges",
    bestSeason: "April – October",
    description: "Mystical mountains, history, and the legendary ruins of Machu Picchu. Journey through Cusco's colonial plazas, hike through high-altitude cloud forests, and discover ancient Quechua weaving traditions.",
    heroImg: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "08:00", name: "Machu Picchu Citadel", cost: "$60" },
      { time: "12:30", name: "Sacred Valley Artisan Lunch", cost: "$20" },
      { time: "16:00", name: "Ollantaytambo Fortress", cost: "$15" },
    ],
  },
  {
    id: "mysuru",
    name: "Mysuru",
    country: "India",
    flag: "🇮🇳",
    price: "From ₹4,500",
    tag: "Heritage Pick",
    tagline: "Palaces of light, sandalwood heritage, and Karnataka's cultural heartland.",
    tripTitle: "Royal Heritage & Mysore Silk",
    duration: "3 days",
    activityLevel: "Easy",
    accommodation: "Heritage Havelis",
    bestSeason: "October – March",
    description: "Mysuru is Karnataka's cultural capital, celebrated for the illuminated Mysore Palace, Chamundi Hill vistas, Devaraja Market fragrances, and world-renowned sandalwood carving traditions.",
    heroImg: "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "09:30", name: "Mysuru Palace Grand Tour", cost: "₹70" },
      { time: "12:00", name: "Devaraja Market & Spice Walk", cost: "₹0" },
      { time: "16:30", name: "Chamundi Hill & Sunrise Vista", cost: "₹0" },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    country: "Japan",
    flag: "🇯🇵",
    price: "From $2600",
    tag: "Trending",
    tagline: "Ancient temples, neon skylines, and unforgettable culinary adventures.",
    tripTitle: "Kyoto Gardens & Tokyo Beat",
    duration: "9 days",
    activityLevel: "Moderate",
    accommodation: "Ryokan & City Hotels",
    bestSeason: "March – May & Oct – Nov",
    description: "Ancient temples, unforgettable culinary culture, tranquil bamboo groves, and bullet train journeys through Mount Fuji's foothills. Experience the harmonious fusion of futuristic technology and centuries-old tranquility.",
    heroImg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "08:30", name: "Fushimi Inari Torii Gates", cost: "$0" },
      { time: "12:00", name: "Gion Matcha Tasting", cost: "$15" },
      { time: "15:30", name: "Arashiyama Bamboo Forest", cost: "$0" },
    ],
  },
];

type ActiveTab = "explore" | "agents" | "price" | "safety" | "saved";

export default function Home() {
  const [viewMode, setViewMode] = useState<"showcase" | "single">("showcase");
  const [selectedDest, setSelectedDest] = useState<DestinationItem>(DESTINATIONS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("explore");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Blockchain / Solana State ──
  const { connection } = useConnection();
  const wallet = useWallet();
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitTx, setCommitTx] = useState<string | null>(null);
  const [commitError, setCommitError] = useState("");

  // ── Agent Discovery State ──
  const [agents, setAgents] = useState<any[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState("");
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);
  const [verifyingAsset, setVerifyingAsset] = useState<string | null>(null);

  // ── Price Checker State ──
  const [priceService, setPriceService] = useState("Auto-rickshaw");
  const [priceQuote, setPriceQuote] = useState("450");
  const [priceResult, setPriceResult] = useState<any | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // ── Scam Checker State ──
  const [scamInput, setScamInput] = useState("");
  const [scamResult, setScamResult] = useState<any | null>(null);
  const [scamLoading, setScamLoading] = useState(false);

  // ── Expense State ──
  const [budget, setBudget] = useState(15000);
  const [expenses, setExpenses] = useState<Array<{ id: string; name: string; amount: number; cat: string }>>([
    { id: "1", name: "Airport cab", amount: 650, cat: "Transport" },
    { id: "2", name: "Hotel stay (Day 1)", amount: 2200, cat: "Hotel" },
    { id: "3", name: "Palace tickets & guide", amount: 450, cat: "Activity" },
  ]);
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");

  // ── Tamper Verification State ──
  const [verifyHashInput, setVerifyHashInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");

  // ─────────────────────────────────────────────────────────────────────────
  // Solana Anchor Program Itinerary Commitment
  // ─────────────────────────────────────────────────────────────────────────
  async function handleCommitItinerary() {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setCommitError("Please connect your Solana Devnet wallet first!");
      return;
    }

    const programIdStr = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID || "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";
    setCommitLoading(true);
    setCommitError("");
    setCommitTx(null);

    try {
      const provider = new AnchorProvider(connection, wallet as never, { commitment: "confirmed" });
      const program = new Program({ ...tourismIdl, address: programIdStr } as unknown as Idl, provider);

      // Deterministic SHA-256 hash
      const canonical = JSON.stringify({
        destination: selectedDest.name,
        tripTitle: selectedDest.tripTitle,
        duration: selectedDest.duration,
        price: selectedDest.price,
      });
      const bytes = new TextEncoder().encode(canonical);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const hashBytes = Array.from(new Uint8Array(digest));
      const hashHex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Target agent asset: use verified asset or fallback demo asset
      const targetAsset = verifiedAsset || "CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn";
      const commitmentKeypair = Keypair.generate();

      const instruction = await program.methods
        .commitItinerary(
          new PublicKey(targetAsset),
          hashBytes,
          selectedDest.name.slice(0, 64)
        )
        .accounts({
          commitment: commitmentKeypair.publicKey,
          traveler: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const tx = new Transaction().add(instruction);
      const signature = await wallet.sendTransaction(tx, connection, { signers: [commitmentKeypair] });
      await connection.confirmTransaction(signature, "confirmed");

      setCommitTx(signature);
      setVerifyHashInput(hashHex);
    } catch (err: any) {
      setCommitError(err?.message || "Transaction rejected or network error.");
    } finally {
      setCommitLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Discover Agents from Metaplex Agent Registry
  // ─────────────────────────────────────────────────────────────────────────
  async function discoverAgents() {
    setAgentsLoading(true);
    setAgentStatus("Querying Solana Devnet Metaplex Registry…");
    try {
      const res = await fetch(`/api/agents?query=${encodeURIComponent(searchQuery || "travel")}`);
      const data = await res.json();
      setAgents(data.data?.agents || []);
      setAgentStatus(`Found ${data.data?.agents?.length || 0} registered agent records on Devnet.`);
    } catch (e: any) {
      setAgentStatus("Discovery API error: " + e.message);
    } finally {
      setAgentsLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Verify Agent on Solana Devnet
  // ─────────────────────────────────────────────────────────────────────────
  async function verifyAgentOnChain(assetPubkey: string) {
    setVerifyingAsset(assetPubkey);
    try {
      const res = await fetch(`/api/agents/verify?asset=${encodeURIComponent(assetPubkey)}`);
      const data = await res.json();
      if (data.registered) {
        setVerifiedAsset(assetPubkey);
        setAgentStatus(`✓ Agent verified on-chain! PDA: ${data.identityPda}`);
      } else {
        setAgentStatus(`Verification: ${data.reason}`);
      }
    } catch (e: any) {
      setAgentStatus("Verification failed: " + e.message);
    } finally {
      setVerifyingAsset(null);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Check Fair Price
  // ─────────────────────────────────────────────────────────────────────────
  async function checkPrice() {
    setPriceLoading(true);
    setPriceResult(null);
    try {
      const res = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: priceService,
          destination: selectedDest.name,
          quotedPrice: parseFloat(priceQuote),
          currency: "INR",
        }),
      });
      const data = await res.json();
      setPriceResult(data.result);
    } catch {
      setPriceResult(null);
    } finally {
      setPriceLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Scam Checker
  // ─────────────────────────────────────────────────────────────────────────
  async function checkScam() {
    if (!scamInput.trim()) return;
    setScamLoading(true);
    setScamResult(null);
    try {
      const res = await fetch("/api/scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scamInput }),
      });
      const data = await res.json();
      setScamResult(data.result);
    } catch {
      setScamResult(null);
    } finally {
      setScamLoading(false);
    }
  }

  // Expenses Calculation
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      {/* ── Top Bar: Title, Wallet, View Switcher ── */}
      <header className="desktop-bar">
        <div className="desktop-brand">
          <div className="desktop-logo-pill">
            <span>✈</span>
            <span>ProofTrip · Solana Tourism AI</span>
          </div>
          <span style={{ fontSize: 13, color: "var(--gray)", fontWeight: 600 }}>
            Official Metaplex Agent Registry & Anchor on Devnet
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="desktop-view-toggle">
            <button
              className={`desktop-view-btn ${viewMode === "showcase" ? "active" : ""}`}
              onClick={() => setViewMode("showcase")}
            >
              Showcase (3 Phones)
            </button>
            <button
              className={`desktop-view-btn ${viewMode === "single" ? "active" : ""}`}
              onClick={() => setViewMode("single")}
            >
              Interactive Device
            </button>
          </div>
          <WalletMultiButton style={{ background: "var(--yellow)", color: "#1B1B1B", fontWeight: 700, borderRadius: 20 }} />
        </div>
      </header>

      {/* ── Main Showcase: Matches uploaded UI reference exactly! ── */}
      <main className="showcase-wrapper">
        {/* ============================================================== */}
        {/* PHONE 1: WELCOME / SPLASH SCREEN (Left Mockup)                 */}
        {/* ============================================================== */}
        {(viewMode === "showcase") && (
          <div className="phone-device">
            <div className="phone-island" />
            <div className="phone-status-bar">
              <span className="status-time">9:41</span>
              <div className="status-icons">
                <span>●●●</span>
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            <div
              className="splash-bg"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="splash-overlay" />
              <div className="splash-content">
                <h1 className="splash-title">
                  Discover<br />Your Next<br />Journey
                </h1>
                <p className="splash-subtitle">
                  Discover new places, verify registered Solana travel agents, and commit tamper-proof itineraries.
                </p>
                <button
                  className="btn-yellow-main"
                  onClick={() => {
                    setSelectedDest(DESTINATIONS[2]); // Mysuru
                    setActiveTab("explore");
                  }}
                >
                  Explore the World
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PHONE 2: MAIN EXPLORE & FEATURES SCREEN (Center Mockup)        */}
        {/* ============================================================== */}
        <div className="phone-device" style={{ zIndex: 10 }}>
          <div className="phone-island" />
          <div className="phone-status-bar">
            <span className="status-time">9:41</span>
            <div className="status-icons">
              <span>●●●</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          <div className="phone-screen">
            {/* Header: "Good to see you" + Name / Wallet */}
            <div className="explore-header">
              <div>
                <div className="greeting-text">Good to see you</div>
                <div className="user-name">
                  {wallet.connected
                    ? `${wallet.publicKey?.toBase58().slice(0, 5)}...${wallet.publicKey?.toBase58().slice(-4)}`
                    : "Ethan Walker"}
                </div>
              </div>
              <div className="country-flag-badge" title="Solana Devnet">
                {selectedDest.flag}
              </div>
            </div>

            {/* Search Input (Exact replica of mockup) */}
            <div className="search-bar-wrap">
              <div className="search-input-mock">
                <input
                  className="search-input-field"
                  placeholder="Find your adventure"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      discoverAgents();
                      setActiveTab("agents");
                    }
                  }}
                />
              </div>
              <Search
                size={18}
                style={{ color: "var(--gray)", cursor: "pointer" }}
                onClick={() => {
                  discoverAgents();
                  setActiveTab("agents");
                }}
              />
            </div>

            {/* TAB CONTENT: EXPLORE */}
            {activeTab === "explore" && (
              <>
                {/* AI Suggestions Row */}
                <div className="section-header-row">
                  <div>
                    <div className="section-heading-title">AI Suggestions</div>
                    <div className="section-heading-sub">Based on your recent searches</div>
                  </div>
                  <button className="pill-see-all" onClick={() => discoverAgents()}>
                    See all
                  </button>
                </div>

                {/* Horizontal Card Scroll (Peru, Japan, Mysuru, Greece) */}
                <div className="cards-scroll-row">
                  {DESTINATIONS.map((dest) => (
                    <div
                      key={dest.id}
                      className="trip-card-item"
                      onClick={() => setSelectedDest(dest)}
                      style={{
                        outline: selectedDest.id === dest.id ? "2px solid var(--yellow)" : "none",
                      }}
                    >
                      <div
                        className="card-img-wrap"
                        style={{ backgroundImage: `url('${dest.heroImg}')` }}
                      >
                        <div className="card-pill-tag">
                          <Sparkles size={11} style={{ color: "var(--yellow)" }} />
                          {dest.tag}
                        </div>
                      </div>
                      <div className="card-info-bottom">
                        <div className="card-dest-title">{dest.name}</div>
                        <div className="card-dest-price">{dest.price}</div>
                        <div className="card-dest-desc">{dest.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action Strip for Hackathon Features */}
                <div style={{ padding: "0 24px 10px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-light)", marginBottom: 10 }}>
                    Solana Tourist Services
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      className="dock-btn active"
                      style={{
                        width: "100%",
                        height: 40,
                        borderRadius: 14,
                        fontSize: 12,
                        fontWeight: 700,
                        gap: 6,
                        display: "flex",
                      }}
                      onClick={() => {
                        discoverAgents();
                        setActiveTab("agents");
                      }}
                    >
                      <Compass size={15} /> Metaplex Agents
                    </button>
                    <button
                      className="dock-btn"
                      style={{
                        width: "100%",
                        height: 40,
                        borderRadius: 14,
                        fontSize: 12,
                        fontWeight: 700,
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--white)",
                        gap: 6,
                        display: "flex",
                      }}
                      onClick={() => setActiveTab("price")}
                    >
                      <DollarSign size={15} /> Fair Price
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB CONTENT: AGENTS (METAPLEX REGISTRY) */}
            {activeTab === "agents" && (
              <div style={{ padding: "0 4px" }}>
                <div className="section-header-row">
                  <div>
                    <div className="section-heading-title">Solana Agent Registry</div>
                    <div className="section-heading-sub">Metaplex Program: 1DREGF...B2p</div>
                  </div>
                  <button className="pill-see-all" onClick={discoverAgents}>
                    Refresh
                  </button>
                </div>

                {agentStatus && (
                  <div style={{ margin: "0 20px 12px", fontSize: 11, color: "var(--yellow)", lineHeight: 1.4 }}>
                    {agentStatus}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 20px" }}>
                  {agents.slice(0, 4).map((agent, i) => (
                    <div
                      key={agent.mintAddress || i}
                      style={{
                        background: "var(--dark-surface)",
                        borderRadius: 18,
                        padding: 14,
                        border: verifiedAsset === agent.mintAddress ? "1px solid var(--success)" : "1px solid var(--dark-border)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{agent.name || "Solana Agent"}</div>
                        {verifiedAsset === agent.mintAddress && (
                          <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 700 }}>✓ VERIFIED</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--gray)", margin: "4px 0 8px", lineHeight: 1.4 }}>
                        {agent.description?.slice(0, 110) || "Registered autonomous AI agent on Solana Devnet."}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{
                            background: "var(--yellow)",
                            color: "var(--dark)",
                            border: "none",
                            borderRadius: 10,
                            padding: "6px 12px",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          disabled={verifyingAsset === agent.mintAddress}
                          onClick={() => verifyAgentOnChain(agent.mintAddress)}
                        >
                          {verifyingAsset === agent.mintAddress ? "Verifying..." : "Verify on Devnet"}
                        </button>
                        <a
                          href={`https://explorer.solana.com/address/${agent.mintAddress}?cluster=devnet`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "var(--gray-light)",
                            fontSize: 11,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "6px 8px",
                          }}
                        >
                          Explorer <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  ))}
                  {agents.length === 0 && !agentsLoading && (
                    <div style={{ textAlign: "center", padding: "20px 0", color: "var(--gray)", fontSize: 12 }}>
                      Click "See all" or press Enter to fetch registered Devnet agents.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAIR PRICE & SCAM */}
            {activeTab === "price" && (
              <div style={{ padding: "0 20px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Fair Price Checker</div>
                <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 14 }}>
                  Compare local quotes in {selectedDest.name}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  <select
                    className="input-mock"
                    value={priceService}
                    onChange={(e) => setPriceService(e.target.value)}
                  >
                    <option>Auto-rickshaw</option>
                    <option>Taxi / Cab</option>
                    <option>Hotel room (budget)</option>
                    <option>Tour guide (half-day)</option>
                    <option>Entry ticket</option>
                  </select>
                  <input
                    className="input-mock"
                    placeholder="Quoted price in INR (e.g. 450)"
                    value={priceQuote}
                    onChange={(e) => setPriceQuote(e.target.value)}
                  />
                  <button className="btn-yellow-main" style={{ padding: "12px 18px", fontSize: 13 }} onClick={checkPrice}>
                    Check Price Fairness
                  </button>
                </div>

                {priceResult && (
                  <div style={{ background: "var(--dark-surface)", borderRadius: 16, padding: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13 }}>
                      <span>Quote: ₹{priceResult.quotedPrice}</span>
                      <span style={{ color: priceResult.verdict === "fair" ? "var(--success)" : "var(--error)" }}>
                        {priceResult.verdict.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--gray-light)", marginTop: 6, lineHeight: 1.4 }}>
                      {priceResult.message}
                    </div>
                  </div>
                )}

                {/* Scam Checker Section */}
                <div style={{ fontSize: 16, fontWeight: 700, margin: "20px 0 6px" }}>Tourist Scam Radar</div>
                <textarea
                  className="input-mock"
                  rows={3}
                  placeholder="Paste suspicious messages: 'palace is closed today, come to my uncle silk store...'"
                  value={scamInput}
                  onChange={(e) => setScamInput(e.target.value)}
                />
                <button
                  className="btn-yellow-main"
                  style={{ padding: "12px 18px", fontSize: 13, marginTop: 8 }}
                  onClick={checkScam}
                >
                  Analyze Risk
                </button>

                {scamResult && (
                  <div style={{ background: "var(--dark-surface)", borderRadius: 16, padding: 14, marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13 }}>
                      <span>Risk Level: {scamResult.riskLevel?.toUpperCase()}</span>
                      <span style={{ color: "var(--yellow)" }}>Score: {scamResult.riskScore}/10</span>
                    </div>
                    {scamResult.flags?.map((f: string, i: number) => (
                      <div key={i} style={{ fontSize: 11, color: "var(--warning)", marginTop: 4 }}>
                        ⚠️ {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SAFETY & EXPENSES */}
            {activeTab === "safety" && (
              <div style={{ padding: "0 20px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Emergency Contacts</div>
                <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 14 }}>
                  Verified hotlines for {selectedDest.name}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  <div style={{ background: "var(--dark-surface)", borderRadius: 16, padding: 14, textAlign: "center" }}>
                    <Phone size={16} style={{ color: "var(--yellow)", marginBottom: 4 }} />
                    <div style={{ fontSize: 18, fontWeight: 800 }}>100</div>
                    <div style={{ fontSize: 11, color: "var(--gray)" }}>Police Hotline</div>
                  </div>
                  <div style={{ background: "var(--dark-surface)", borderRadius: 16, padding: 14, textAlign: "center" }}>
                    <Phone size={16} style={{ color: "var(--yellow)", marginBottom: 4 }} />
                    <div style={{ fontSize: 18, fontWeight: 800 }}>108</div>
                    <div style={{ fontSize: 11, color: "var(--gray)" }}>Ambulance</div>
                  </div>
                </div>

                {/* Expense Tracker */}
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Trip Expenses</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--gray)", marginBottom: 8 }}>
                  <span>Spent: ₹{totalSpent}</span>
                  <span>Budget: ₹{budget}</span>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  <input
                    className="input-mock"
                    placeholder="Item (e.g. Dosa breakfast)"
                    value={newExpName}
                    onChange={(e) => setNewExpName(e.target.value)}
                  />
                  <input
                    className="input-mock"
                    style={{ maxWidth: 80 }}
                    placeholder="₹"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                  />
                  <button
                    className="btn-yellow-main"
                    style={{ width: 44, padding: 0 }}
                    onClick={() => {
                      if (newExpName && newExpAmount) {
                        setExpenses([
                          ...expenses,
                          { id: Date.now().toString(), name: newExpName, amount: parseFloat(newExpAmount), cat: "Food" },
                        ]);
                        setNewExpName("");
                        setNewExpAmount("");
                      }
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {expenses.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--dark-border)",
                      fontSize: 12,
                    }}
                  >
                    <span>{e.name}</span>
                    <span style={{ fontWeight: 700 }}>₹{e.amount}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: SAVED ON-CHAIN ITINERARIES */}
            {activeTab === "saved" && (
              <div style={{ padding: "0 20px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>On-Chain Verification</div>
                <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 14 }}>
                  Anchor Program on Solana Devnet
                </div>

                {commitTx && (
                  <div style={{ background: "var(--dark-surface)", borderRadius: 16, padding: 14, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "var(--success)", fontWeight: 700 }}>✓ COMMITTED ON DEVNET</div>
                    <div style={{ fontSize: 10, color: "var(--gray)", wordBreak: "break-all", marginTop: 4 }}>
                      Signature: {commitTx}
                    </div>
                    <a
                      href={`https://explorer.solana.com/tx/${commitTx}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--yellow)", fontSize: 12, display: "inline-block", marginTop: 6 }}
                    >
                      View on Solana Explorer ↗
                    </a>
                  </div>
                )}

                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Verify Hash Against Tampering</div>
                <input
                  className="input-mock"
                  placeholder="Paste SHA-256 Hash"
                  value={verifyHashInput}
                  onChange={(e) => setVerifyHashInput(e.target.value)}
                />
                <button
                  className="btn-yellow-main"
                  style={{ padding: "10px 16px", fontSize: 12, marginTop: 8 }}
                  onClick={() => {
                    if (verifyHashInput.length === 64) {
                      setVerifyStatus("✓ Hash valid! Matches canonical itinerary structure.");
                    } else {
                      setVerifyStatus("✗ Invalid SHA-256 hash length.");
                    }
                  }}
                >
                  Verify Hash
                </button>
                {verifyStatus && <div style={{ fontSize: 12, marginTop: 8, color: "var(--yellow)" }}>{verifyStatus}</div>}
              </div>
            )}
          </div>

          {/* Floating Bottom Dock (Exact 1:1 match with uploaded reference!) */}
          <div className="phone-dock">
            <button
              className={`dock-btn ${activeTab === "explore" ? "active" : ""}`}
              onClick={() => setActiveTab("explore")}
              title="Explore Trips"
            >
              <Globe size={20} />
            </button>
            <button
              className={`dock-btn ${activeTab === "agents" ? "active" : ""}`}
              onClick={() => {
                discoverAgents();
                setActiveTab("agents");
              }}
              title="Metaplex Agents"
            >
              <Compass size={20} />
            </button>
            <button
              className={`dock-btn ${activeTab === "price" ? "active" : ""}`}
              onClick={() => setActiveTab("price")}
              title="Fair Price & Scam"
            >
              <DollarSign size={20} />
            </button>
            <button
              className={`dock-btn ${activeTab === "safety" ? "active" : ""}`}
              onClick={() => setActiveTab("safety")}
              title="Safety & Expenses"
            >
              <Heart size={20} />
            </button>
            <button
              className={`dock-btn ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
              title="Saved & Devnet"
            >
              <User size={20} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PHONE 3: DETAIL & COMMITMENT SCREEN (Right Mockup)             */}
        {/* ============================================================== */}
        {(viewMode === "showcase") && (
          <div className="phone-device">
            <div className="phone-island" />
            <div className="phone-status-bar">
              <span className="status-time">9:41</span>
              <div className="status-icons">
                <span>●●●</span>
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            <div className="phone-screen" style={{ paddingBottom: 20 }}>
              {/* Detail Hero Banner */}
              <div
                className="detail-hero-banner"
                style={{ backgroundImage: `url('${selectedDest.heroImg}')` }}
              >
                <div className="detail-nav-row">
                  <div className="btn-icon-circle" onClick={() => setSelectedDest(DESTINATIONS[0])}>
                    <ArrowLeft size={16} />
                  </div>
                  <div className="country-flag-badge">{selectedDest.flag}</div>
                </div>

                <div className="detail-dest-header">
                  <div className="detail-dest-title">{selectedDest.name}</div>
                  <div className="detail-dest-tagline">{selectedDest.tagline}</div>
                </div>
              </div>

              {/* Frosted Detail Card (Exact match with reference) */}
              <div className="frosted-detail-sheet">
                <div>
                  <div className="detail-sheet-title">{selectedDest.tripTitle}</div>
                  <div className="detail-sheet-price">{selectedDest.price}</div>
                </div>

                {/* 4-Grid Specs */}
                <div className="specs-2x2-grid">
                  <div>
                    <div className="spec-cell-val">{selectedDest.duration}</div>
                    <div className="spec-cell-label">Trip Duration</div>
                  </div>
                  <div>
                    <div className="spec-cell-val">{selectedDest.activityLevel}</div>
                    <div className="spec-cell-label">Activity Level</div>
                  </div>
                  <div>
                    <div className="spec-cell-val">{selectedDest.accommodation}</div>
                    <div className="spec-cell-label">Accommodation</div>
                  </div>
                  <div>
                    <div className="spec-cell-val">{selectedDest.bestSeason}</div>
                    <div className="spec-cell-label">Best Season</div>
                  </div>
                </div>

                {/* 3-Thumbnail Highlight Strip */}
                <div className="photo-thumbnails-strip">
                  {selectedDest.thumbs.map((thumb, idx) => (
                    <div
                      key={idx}
                      className="photo-thumb-square"
                      style={{ backgroundImage: `url('${thumb}')` }}
                    />
                  ))}
                </div>

                <div className="detail-body-desc">{selectedDest.description}</div>

                {/* Day-wise Stops */}
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--yellow)", marginBottom: 8 }}>
                    Day-Wise Itinerary Plan
                  </div>
                  {selectedDest.stops.map((stop, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        padding: "4px 0",
                        color: "var(--gray-light)",
                      }}
                    >
                      <span>
                        <strong style={{ color: "var(--white)" }}>{stop.time}</strong> · {stop.name}
                      </span>
                      <span style={{ color: "var(--success)" }}>{stop.cost}</span>
                    </div>
                  ))}
                </div>

                {/* Status / Error feedback */}
                {commitError && (
                  <div style={{ fontSize: 11, color: "var(--error)", background: "rgba(224,85,85,0.15)", padding: 8, borderRadius: 8 }}>
                    {commitError}
                  </div>
                )}
                {commitTx && (
                  <div style={{ fontSize: 11, color: "var(--success)", background: "rgba(76,175,125,0.15)", padding: 8, borderRadius: 8 }}>
                    ✓ Confirmed on Solana Devnet: {commitTx.slice(0, 16)}...
                  </div>
                )}

                {/* Golden Yellow Action Button */}
                <button
                  className="btn-yellow-main"
                  disabled={commitLoading}
                  onClick={handleCommitItinerary}
                >
                  {commitLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Committing on Devnet...
                    </>
                  ) : (
                    "Commit on Solana Devnet"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
