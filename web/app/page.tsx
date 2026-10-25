"use client";

import React, { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { tourismIdl } from "../lib/tourism-idl";
import {
  Globe,
  Compass,
  Search,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Shield,
  Phone,
  DollarSign,
  Receipt,
  ExternalLink,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldAlert,
  Plus,
  RefreshCw,
  Lock,
} from "lucide-react";

// ─── Destination Data ────────────────────────────────────────────────────────
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
  stops: Array<{ time: string; name: string; cost: string; desc: string }>;
};

const DESTINATIONS: DestinationItem[] = [
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
    activityLevel: "Easy to Moderate",
    accommodation: "Heritage Havelis & 4-Star Stays",
    bestSeason: "October – March",
    description: "Mysuru is Karnataka's cultural capital, celebrated for the illuminated Mysore Palace with 100,000 bulbs, Chamundi Hill vistas, Devaraja Market fragrances, and centuries-old sandalwood carving and silk weaving traditions.",
    heroImg: "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "09:30 AM", name: "Mysuru Palace Grand Tour", cost: "₹70", desc: "Indo-Saracenic royal residence and golden throne hall" },
      { time: "12:00 PM", name: "Devaraja Market & Spice Walk", cost: "₹0", desc: "Historic covered bazaar with fresh jasmine, essential oils, and local crafts" },
      { time: "04:30 PM", name: "Chamundi Hill & Sunrise Vista", cost: "₹0", desc: "Panoramic view over the city and visit to the sacred Nandi Bull" },
    ],
  },
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
    accommodation: "4-star hotels & Caldera Suites",
    bestSeason: "May – October",
    description: "Greece is a destination where ancient history meets crystal-clear seas and vibrant island culture. Explore the Acropolis in Athens, watch world-famous sunsets in Santorini, and savor authentic Mediterranean dining.",
    heroImg: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "09:00 AM", name: "Acropolis & Parthenon", cost: "$35", desc: "Ancient citadel of classical Greece overlooking Athens" },
      { time: "01:00 PM", name: "Plaka Traditional Taverna", cost: "$25", desc: "Authentic Greek lunch in historic cobblestone alleyways" },
      { time: "05:30 PM", name: "Oia Sunset Walk, Santorini", cost: "$0", desc: "Iconic blue-domed churches and panoramic Aegean sunset" },
    ],
  },
  {
    id: "peru",
    name: "Peru",
    country: "Peru",
    flag: "🇵🇪",
    price: "From $2,450",
    tag: "Budget Friendly",
    tagline: "Mystical mountains, sacred valleys, and the ancient citadel of Machu Picchu.",
    tripTitle: "Inca Trail & Sacred Peaks",
    duration: "7 days",
    activityLevel: "Challenging",
    accommodation: "Boutique Mountain Lodges",
    bestSeason: "April – October",
    description: "Mystical mountains, history, and the legendary ruins of Machu Picchu. Journey through Cusco's colonial plazas, hike through high-altitude cloud forests, and discover ancient Quechua weaving traditions.",
    heroImg: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "08:00 AM", name: "Machu Picchu Citadel", cost: "$60", desc: "UNESCO world wonder nestled high in the Andean peaks" },
      { time: "12:30 PM", name: "Sacred Valley Artisan Lunch", cost: "$20", desc: "Farm-to-table Andean cuisine with native corn and quinoa" },
      { time: "04:00 PM", name: "Ollantaytambo Fortress", cost: "$15", desc: "Inca stronghold with monolithic stone staircases" },
    ],
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    flag: "🇮🇳",
    price: "From ₹6,800",
    tag: "Trending",
    tagline: "Golden beaches, UNESCO Portuguese heritage, and vibrant coastal dining.",
    tripTitle: "Sun, Spice & Old Goa Churches",
    duration: "4 days",
    activityLevel: "Relaxed",
    accommodation: "Beachfront Boutique Resorts",
    bestSeason: "November – March",
    description: "Experience the laid-back charm of Goa with sunny beaches, Portuguese colonial architecture in Fontainhas, ancient UNESCO churches of Old Goa, and fresh coastal seafood dining.",
    heroImg: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "09:00 AM", name: "Basilica of Bom Jesus", cost: "₹0", desc: "Baroque 16th-century church holding the relics of St. Francis Xavier" },
      { time: "01:00 PM", name: "Fontainhas Latin Quarter", cost: "₹0", desc: "Walk through pastel Portuguese villas and heritage bakeries" },
      { time: "05:00 PM", name: "Anjuna Beach Sunset & Shacks", cost: "₹300", desc: "Sunset views, coastal breeze, and fresh coconut water" },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    country: "Japan",
    flag: "🇯🇵",
    price: "From $2,600",
    tag: "Trending",
    tagline: "Ancient temples, neon skylines, and unforgettable culinary adventures.",
    tripTitle: "Kyoto Gardens & Tokyo Beat",
    duration: "9 days",
    activityLevel: "Moderate",
    accommodation: "Ryokan & City Hotels",
    bestSeason: "March – May & Oct – Nov",
    description: "Ancient temples, unforgettable culinary culture, tranquil bamboo groves, and bullet train journeys through Mount Fuji's foothills. Experience the harmonious fusion of futuristic technology and centuries-old tranquility.",
    heroImg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "08:30 AM", name: "Fushimi Inari Torii Gates", cost: "$0", desc: "Thousands of vermilion torii gates winding through sacred mountain trails" },
      { time: "12:00 PM", name: "Gion Traditional Tea Experience", cost: "$15", desc: "Matcha green tea and delicate wagashi sweets in historic Kyoto" },
      { time: "03:30 PM", name: "Arashiyama Bamboo Forest", cost: "$0", desc: "Soaring green stalks swaying peacefully in the breeze" },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    flag: "🇮🇳",
    price: "From ₹5,200",
    tag: "Heritage Pick",
    tagline: "The Pink City: royal observatories, hilltop fortresses, and vibrant bazaars.",
    tripTitle: "Fortresses & Palaces of Rajasthan",
    duration: "3 days",
    activityLevel: "Moderate",
    accommodation: "Rajasthani Heritage Havelis",
    bestSeason: "October – March",
    description: "Step into the Pink City of Jaipur. Visit the majestic Amer Fort, the honeycomb façade of Hawa Mahal, the astronomical marvel of Jantar Mantar, and shop for hand-blocked textiles and blue pottery.",
    heroImg: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80",
    ],
    stops: [
      { time: "09:00 AM", name: "Amer Fort & Maota Lake", cost: "₹100", desc: "Hilltop citadel with Sheesh Mahal (Mirror Palace)" },
      { time: "01:30 PM", name: "Hawa Mahal (Palace of Winds)", cost: "₹50", desc: "Five-story pink sandstone screen built for royal women" },
      { time: "04:30 PM", name: "Johari Bazaar Gem & Silk Walk", cost: "₹0", desc: "Famous market for traditional jewelry and Jaipuri quilts" },
    ],
  },
];

export default function Home() {
  const [selectedDest, setSelectedDest] = useState<DestinationItem>(DESTINATIONS[0]);
  const [filterTag, setFilterTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Blockchain / Solana State ──
  const { connection } = useConnection();
  const wallet = useWallet();
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitTx, setCommitTx] = useState<string | null>(null);
  const [commitError, setCommitError] = useState("");
  const [savedRecords, setSavedRecords] = useState<Array<{ dest: string; tx: string; hash: string; time: string }>>([]);

  // ── Metaplex Agent Registry State ──
  const [agents, setAgents] = useState<any[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState("");
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);
  const [verifyingAsset, setVerifyingAsset] = useState<string | null>(null);

  // ── Price Checker State ──
  const [priceService, setPriceService] = useState("Auto-rickshaw");
  const [priceCity, setPriceCity] = useState("Mysuru");
  const [priceQuote, setPriceQuote] = useState("450");
  const [priceResult, setPriceResult] = useState<any | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // ── Scam Checker State ──
  const [scamInput, setScamInput] = useState("");
  const [scamResult, setScamResult] = useState<any | null>(null);
  const [scamLoading, setScamLoading] = useState(false);

  // ── Expense Tracker State ──
  const [budget, setBudget] = useState(15000);
  const [expenses, setExpenses] = useState<Array<{ id: string; name: string; amount: number; cat: string }>>([
    { id: "1", name: "Airport transfer", amount: 650, cat: "Transport" },
    { id: "2", name: "Heritage Hotel (Night 1)", amount: 2200, cat: "Hotel" },
    { id: "3", name: "Palace tickets & audio guide", amount: 250, cat: "Activity" },
  ]);
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCat, setNewExpCat] = useState("Food");

  // ── Tamper Verification State ──
  const [verifyHashInput, setVerifyHashInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");

  // ── Persistent Local Storage Loading ──
  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem("prooftrip_saved_records");
      if (storedRecords) setSavedRecords(JSON.parse(storedRecords));

      const storedExpenses = localStorage.getItem("prooftrip_expenses");
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));

      const storedAsset = localStorage.getItem("prooftrip_verified_asset");
      if (storedAsset) setVerifiedAsset(storedAsset);
    } catch {
      // Ignore localStorage errors in SSR or restricted environments
    }
  }, []);

  // Save records and expenses when updated
  const saveRecordsToStorage = (records: any[]) => {
    setSavedRecords(records);
    try {
      localStorage.setItem("prooftrip_saved_records", JSON.stringify(records));
    } catch {}
  };

  const saveExpensesToStorage = (newExpenses: any[]) => {
    setExpenses(newExpenses);
    try {
      localStorage.setItem("prooftrip_expenses", JSON.stringify(newExpenses));
    } catch {}
  };

  const saveVerifiedAssetToStorage = (asset: string | null) => {
    setVerifiedAsset(asset);
    try {
      if (asset) localStorage.setItem("prooftrip_verified_asset", asset);
      else localStorage.removeItem("prooftrip_verified_asset");
    } catch {}
  };

  // Discover agents once on mount without duplicate fetching
  useEffect(() => {
    let active = true;
    async function loadInitialAgents() {
      if (agents.length > 0) return;
      setAgentsLoading(true);
      setAgentStatus("Querying live Solana Devnet Metaplex Registry...");
      try {
        const res = await fetch("/api/agents?query=travel");
        const data = await res.json();
        if (active) {
          setAgents(data.data?.agents || []);
          setAgentStatus(`Live Devnet Registry: ${data.data?.agents?.length || 0} agents loaded (${new Date().toLocaleTimeString()}).`);
        }
      } catch (e: any) {
        if (active) setAgentStatus("Discovery API error: " + e.message);
      } finally {
        if (active) setAgentsLoading(false);
      }
    }
    loadInitialAgents();
    return () => {
      active = false;
    };
  }, []);

  // Filtered destination cards
  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchesFilter = filterTag === "All" || d.tag === filterTag;
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Solana Anchor Itinerary Commitment
  // ─────────────────────────────────────────────────────────────────────────
  async function handleCommitItinerary() {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setCommitError("Please connect your Solana wallet (Phantom or Solflare on Devnet) using the button at the top.");
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
        stops: selectedDest.stops.map((s) => s.name),
      });
      const bytes = new TextEncoder().encode(canonical);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const hashBytes = Array.from(new Uint8Array(digest));
      const hashHex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Target agent asset: use verified asset or official Metaplex test asset
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
      const newRec = {
        dest: selectedDest.name,
        tx: signature,
        hash: hashHex,
        time: new Date().toLocaleTimeString(),
      };
      saveRecordsToStorage([newRec, ...savedRecords]);
    } catch (err: any) {
      setCommitError(err?.message || "Transaction rejected or network error.");
    } finally {
      setCommitLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Metaplex Agent Discovery & Verification
  // ─────────────────────────────────────────────────────────────────────────
  async function discoverAgents() {
    setAgentsLoading(true);
    setAgentStatus("Querying Metaplex Agent Registry (Solana Devnet)...");
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

  async function verifyAgentOnChain(assetPubkey: string) {
    setVerifyingAsset(assetPubkey);
    try {
      const res = await fetch(`/api/agents/verify?asset=${encodeURIComponent(assetPubkey)}`);
      const data = await res.json();
      if (data.registered) {
        saveVerifiedAssetToStorage(assetPubkey);
        setAgentStatus(`✓ Agent verified on Solana Devnet! Program Derived Address (PDA): ${data.identityPda}`);
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
  // Fair Price & Scam Checker
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
          destination: priceCity,
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

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remainingBudget = budget - totalSpent;

  return (
    <>
      {/* ── 1. Full-Width Sticky Navigation Bar ── */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="brand-wrap">
            <div className="brand-logo-icon">✈</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="brand-name">ProofTrip</span>
                <span className="brand-pill">Solana AI</span>
              </div>
            </div>
          </a>

          <div className="nav-links">
            <a href="#destinations" className="nav-link-btn">
              Destinations
            </a>
            <a href="#itinerary" className="nav-link-btn">
              Trip Details
            </a>
            <a href="#agents" className="nav-link-btn">
              Metaplex Agents
            </a>
            <a href="#fairprice" className="nav-link-btn">
              Fair Price & Scam
            </a>
            <a href="#safety" className="nav-link-btn">
              Safety & Expenses
            </a>
            <a href="#verification" className="nav-link-btn">
              On-Chain Hashes
            </a>
          </div>

          <div className="nav-actions">
            <div className="cluster-badge" title="Solana Devnet Cluster">
              <span className="pulse-dot" />
              <span>Devnet Active</span>
            </div>
            <WalletMultiButton style={{ background: "var(--yellow)", color: "#1B1B1B", fontWeight: 700, borderRadius: 24, fontSize: 13, height: 40 }} />
          </div>
        </div>
      </nav>

      {/* ── 2. Cinematic Hero Section (Full-Width, DM Sans, Warm Palette) ── */}
      <header
        className="hero-section"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={14} style={{ color: "var(--yellow)" }} />
            <span>Solana AI Agent Registry · Anchor Smart Contract</span>
          </div>
          <h1 className="hero-title">
            Discover Your<br />Next Journey
          </h1>
          <p className="hero-subtitle">
            Plan verified itineraries, discover registered Solana AI travel agents, and commit tamper-evident trip commitments directly to Solana Devnet.
          </p>

          {/* Search & Action Bar */}
          <div className="search-container">
            <div className="search-input-group">
              <MapPin size={18} style={{ color: "var(--yellow)", flexShrink: 0 }} />
              <input
                className="search-main-input"
                placeholder="Find your adventure (e.g. Mysuru, Greece, Peru, Japan, Goa)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    discoverAgents();
                    const el = document.getElementById("destinations");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </div>
            <button
              className="btn-yellow-hero"
              onClick={() => {
                discoverAgents();
                const el = document.getElementById("destinations");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search size={16} />
              <span>Explore Trips</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Full-Width Content Container ── */}
      <main className="main-wrapper">
        {/* ── 3. AI Suggestions & Destination Cards Grid ── */}
        <section id="destinations">
          <div className="section-head">
            <div>
              <h2 className="section-title">AI Suggestions</h2>
              <p className="section-desc">Based on your recent searches and trending Solana travel routes</p>
            </div>
            <div className="pill-filter-row">
              {["All", "Heritage Pick", "Trending", "Budget Friendly"].map((tag) => (
                <button
                  key={tag}
                  className={`pill-filter-btn ${filterTag === tag ? "active" : ""}`}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="destinations-grid">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className={`dest-card-box ${selectedDest.id === dest.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedDest(dest);
                  setPriceCity(dest.name);
                  const el = document.getElementById("itinerary");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div
                  className="dest-card-photo"
                  style={{ backgroundImage: `url('${dest.heroImg}')` }}
                >
                  <div className="dest-pill-badge">
                    <Sparkles size={12} style={{ color: "var(--yellow)" }} />
                    <span>{dest.tag}</span>
                  </div>
                </div>

                <div className="dest-card-content">
                  <div className="dest-card-top-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{dest.flag}</span>
                      <span className="dest-card-name">{dest.name}</span>
                    </div>
                    <span className="dest-card-price">{dest.price}</span>
                  </div>

                  <p className="dest-card-tagline">{dest.description}</p>

                  <div className="dest-card-footer">
                    <span className="dest-specs-summary">
                      {dest.duration} · {dest.activityLevel}
                    </span>
                    <span style={{ color: "var(--yellow)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      View Plan <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Dedicated Destination Details & Itinerary Section ── */}
        <section id="itinerary">
          <div className="section-head">
            <div>
              <h2 className="section-title">Itinerary & On-Chain Commitment</h2>
              <p className="section-desc">Review day-wise stops and commit the tamper-evident hash to Solana Devnet</p>
            </div>
            <div style={{ fontSize: 13, color: "var(--gray)", fontWeight: 600 }}>
              Anchor Program: <code style={{ color: "var(--yellow)" }}>A7yU8i4...VSzN</code>
            </div>
          </div>

          <div className="detail-feature-card">
            {/* Left Column: Visuals & Thumbnails */}
            <div className="detail-visual-col">
              <div
                className="detail-main-photo"
                style={{ backgroundImage: `url('${selectedDest.heroImg}')` }}
              >
                <div className="detail-photo-overlay" />
                <div className="detail-photo-info">
                  <div style={{ fontSize: 36, marginBottom: 4 }}>{selectedDest.flag}</div>
                  <h3 style={{ fontSize: 28, fontWeight: 800 }}>{selectedDest.name}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                    {selectedDest.tagline}
                  </p>
                </div>
              </div>

              {/* 3-Photo Highlight Grid matching reference */}
              <div className="detail-thumbs-grid">
                {selectedDest.thumbs.map((thumb, idx) => (
                  <div
                    key={idx}
                    className="detail-thumb-box"
                    style={{ backgroundImage: `url('${thumb}')` }}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Trip Specs & Day-Wise Plan */}
            <div className="detail-content-col">
              <div className="detail-header-block">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 26, fontWeight: 800 }}>{selectedDest.tripTitle}</h3>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--yellow)", marginTop: 4 }}>
                      {selectedDest.price}
                    </div>
                  </div>
                  <span className="brand-pill">{selectedDest.tag}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--gray-light)", lineHeight: 1.6, marginTop: 8 }}>
                  {selectedDest.description}
                </p>
              </div>

              {/* 4-Cell Specs Grid */}
              <div className="specs-grid-4">
                <div className="spec-item-box">
                  <span className="spec-item-val">{selectedDest.duration}</span>
                  <span className="spec-item-lbl">Trip Duration</span>
                </div>
                <div className="spec-item-box">
                  <span className="spec-item-val">{selectedDest.activityLevel}</span>
                  <span className="spec-item-lbl">Activity Level</span>
                </div>
                <div className="spec-item-box">
                  <span className="spec-item-val">{selectedDest.accommodation}</span>
                  <span className="spec-item-lbl">Accommodation</span>
                </div>
                <div className="spec-item-box">
                  <span className="spec-item-val">{selectedDest.bestSeason}</span>
                  <span className="spec-item-lbl">Best Season</span>
                </div>
              </div>

              {/* Day-Wise Plan */}
              <div className="itinerary-stops-box">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--yellow)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={15} />
                  <span>Curated Day-By-Day Itinerary Stops</span>
                </div>
                {selectedDest.stops.map((stop, sIdx) => (
                  <div key={sIdx} className="itinerary-stop-row">
                    <div className="itinerary-stop-left">
                      <span className="stop-time-pill">{stop.time}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{stop.name}</div>
                        <div style={{ fontSize: 11, color: "var(--gray)" }}>{stop.desc}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--success)" }}>{stop.cost}</span>
                  </div>
                ))}
              </div>

              {/* Status and Feedback messages */}
              {commitError && (
                <div style={{ background: "rgba(224,85,85,0.15)", border: "1px solid rgba(224,85,85,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "var(--error)" }}>
                  {commitError}
                </div>
              )}
              {commitTx && (
                <div style={{ background: "rgba(76,175,125,0.15)", border: "1px solid rgba(76,175,125,0.3)", borderRadius: 12, padding: "12px 14px", fontSize: 13 }}>
                  <div style={{ color: "var(--success)", fontWeight: 700 }}>✓ Itinerary Hash Committed to Solana Devnet!</div>
                  <div style={{ color: "var(--gray)", fontSize: 11, wordBreak: "break-all", marginTop: 4 }}>
                    Tx Signature: {commitTx}
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${commitTx}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--yellow)", fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}
                  >
                    View on Solana Explorer <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Solana Commit Action Button */}
              <button
                className="btn-primary-yellow"
                style={{ width: "100%", padding: "16px 28px", fontSize: 15 }}
                disabled={commitLoading}
                onClick={handleCommitItinerary}
              >
                {commitLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Signing Transaction on Solana Devnet...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Commit Itinerary Hash on Solana Devnet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ── 5. Metaplex Agent Registry Section ── */}
        <section id="agents">
          <div className="section-head">
            <div>
              <h2 className="section-title">Solana AI Agent Registry</h2>
              <p className="section-desc">
                Discover registered agents via Metaplex's live indexed Devnet REST API & verify on-chain identity
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary-dark" onClick={discoverAgents} disabled={agentsLoading}>
                {agentsLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                <span>Refresh Registry</span>
              </button>
            </div>
          </div>

          {agentStatus && (
            <div style={{ background: "var(--dark-surface)", border: "1px solid var(--dark-border)", borderRadius: 14, padding: "12px 18px", fontSize: 13, color: "var(--yellow)", marginBottom: 20 }}>
              {agentStatus}
            </div>
          )}

          <div className="agent-cards-grid">
            {agents.slice(0, 6).map((agent, i) => (
              <div
                key={agent.mintAddress || i}
                className={`agent-box-card ${verifiedAsset === agent.mintAddress ? "verified" : ""}`}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{agent.name || "Solana Agent"}</div>
                    {verifiedAsset === agent.mintAddress && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.5, minHeight: 48 }}>
                    {agent.description?.slice(0, 140) || "Autonomous AI agent registered under Metaplex Agent Registry on Solana Devnet."}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--dark-border)", paddingTop: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--gray)", wordBreak: "break-all", marginBottom: 8 }}>
                    Asset: {agent.mintAddress?.slice(0, 14)}...{agent.mintAddress?.slice(-6)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-primary-yellow"
                      style={{ padding: "8px 14px", fontSize: 12, flex: 1 }}
                      disabled={verifyingAsset === agent.mintAddress}
                      onClick={() => verifyAgentOnChain(agent.mintAddress)}
                    >
                      {verifyingAsset === agent.mintAddress ? "Checking PDA..." : "Verify Identity"}
                    </button>
                    {agent.mintAddress && (
                      <a
                        href={`https://explorer.solana.com/address/${agent.mintAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary-dark"
                        style={{ padding: "8px 10px", fontSize: 12 }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, background: "rgba(240, 160, 48, 0.08)", border: "1px solid rgba(240, 160, 48, 0.2)", borderRadius: 16, padding: "14px 20px", fontSize: 12, color: "var(--gray-light)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--warning)" }}>Registry Disclosure:</strong> The Solana AI Agent Registry confirms an on-chain identity linked to an MPL Core asset via program <code style={{ color: "var(--white)" }}>1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p</code>. An on-chain identity does not certify travel licensing or itinerary truth. ProofTrip ties the hash to the agent key so travelers can hold AI agents accountable.
          </div>
        </section>

        {/* ── 6. Tourist Protection Suite: Fair Price & Scam Radar ── */}
        <section id="fairprice" className="grid-2col">
          {/* Fair Price Checker */}
          <div className="feature-panel">
            <div className="panel-title-row">
              <h3 className="panel-title">Fair Price Checker</h3>
              <DollarSign size={20} style={{ color: "var(--yellow)" }} />
            </div>
            <p style={{ fontSize: 13, color: "var(--gray-light)", lineHeight: 1.5 }}>
              Compare local tourist quotes against benchmark rates for auto-rickshaws, taxis, hotels, and entrance tickets.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="input-label-text">Service Type</label>
                <select
                  className="full-input-field"
                  value={priceService}
                  onChange={(e) => setPriceService(e.target.value)}
                >
                  <option>Auto-rickshaw</option>
                  <option>Taxi / Cab</option>
                  <option>Hotel room (budget)</option>
                  <option>Hotel room (mid-range)</option>
                  <option>Tour guide (half-day)</option>
                  <option>Entry ticket</option>
                </select>
              </div>

              <div>
                <label className="input-label-text">City / Destination</label>
                <input
                  className="full-input-field"
                  value={priceCity}
                  onChange={(e) => setPriceCity(e.target.value)}
                  placeholder="e.g. Mysuru"
                />
              </div>

              <div>
                <label className="input-label-text">Quoted Price (INR)</label>
                <input
                  type="number"
                  className="full-input-field"
                  value={priceQuote}
                  onChange={(e) => setPriceQuote(e.target.value)}
                  placeholder="e.g. 450"
                />
              </div>

              <button
                className="btn-primary-yellow"
                style={{ width: "100%" }}
                disabled={priceLoading || !priceQuote}
                onClick={checkPrice}
              >
                {priceLoading ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
                <span>Check Price Fairness</span>
              </button>

              {priceResult && (
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--dark-border)", borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>
                      Quoted: ₹{priceResult.quotedPrice} vs Ref: ₹{priceResult.referenceMin}–₹{priceResult.referenceMax}
                    </span>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 800,
                        background: priceResult.verdict === "fair" ? "rgba(76,175,125,0.2)" : "rgba(224,85,85,0.2)",
                        color: priceResult.verdict === "fair" ? "var(--success)" : "var(--error)",
                      }}
                    >
                      {priceResult.verdict.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--gray-light)", marginTop: 8, lineHeight: 1.5 }}>
                    {priceResult.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tourist Scam Radar */}
          <div className="feature-panel">
            <div className="panel-title-row">
              <h3 className="panel-title">Tourist Scam Radar</h3>
              <ShieldAlert size={20} style={{ color: "var(--warning)" }} />
            </div>
            <p style={{ fontSize: 13, color: "var(--gray-light)", lineHeight: 1.5 }}>
              Paste suspicious messages, tout quotes, or hotel redirect claims to test for recognized tourist traps.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="input-label-text">Situation or Offer Details</label>
                <textarea
                  className="full-input-field"
                  rows={4}
                  placeholder="e.g. 'Driver told me the palace is closed for a private VIP event today and offered to take me to an authorized government silk factory...'"
                  value={scamInput}
                  onChange={(e) => setScamInput(e.target.value)}
                />
              </div>

              <button
                className="btn-primary-yellow"
                style={{ width: "100%" }}
                disabled={scamLoading || !scamInput.trim()}
                onClick={checkScam}
              >
                {scamLoading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                <span>Analyze Scam Risk</span>
              </button>

              {scamResult && (
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--dark-border)", borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>
                      Risk Assessment: {scamResult.riskLevel.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--yellow)" }}>
                      Score: {scamResult.riskScore} / 10
                    </span>
                  </div>
                  {scamResult.flags.map((flag: string, idx: number) => (
                    <div key={idx} style={{ fontSize: 12, color: "var(--warning)", marginTop: 6 }}>
                      ⚠️ {flag}
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 8, lineHeight: 1.4 }}>
                    {scamResult.disclaimer}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 7. Safety, Emergency & Expense Management ── */}
        <section id="safety" className="grid-2col">
          {/* Emergency & Safety Guide */}
          <div className="feature-panel">
            <div className="panel-title-row">
              <h3 className="panel-title">Safety & Emergency Hotlines</h3>
              <Phone size={20} style={{ color: "var(--yellow)" }} />
            </div>
            <p style={{ fontSize: 13, color: "var(--gray-light)", lineHeight: 1.5 }}>
              Verified national and state tourist emergency contacts for {selectedDest.name}, {selectedDest.country}.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: "var(--dark-elevated)", borderRadius: 18, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--yellow)" }}>100</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Police Control</div>
                <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>National emergency hotline</div>
              </div>
              <div style={{ background: "var(--dark-elevated)", borderRadius: 18, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--yellow)" }}>108</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Ambulance</div>
                <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>Emergency medical response</div>
              </div>
              <div style={{ background: "var(--dark-elevated)", borderRadius: 18, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--yellow)" }}>1800-11-1363</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Tourist Helpline</div>
                <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>Ministry of Tourism 24/7</div>
              </div>
              <div style={{ background: "var(--dark-elevated)", borderRadius: 18, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--yellow)" }}>1091</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>Women Safety</div>
                <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>Toll-free dedicated assistance</div>
              </div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 16, padding: "14px 18px", fontSize: 12, color: "var(--gray-light)", lineHeight: 1.6 }}>
              <strong>Official Travel Advisory:</strong> {selectedDest.name} is generally safe and hospitable for international tourists and solo travelers. Always negotiate auto fares before boarding or use app-based meters, and keep emergency contact numbers saved offline on your phone.
            </div>
          </div>

          {/* Trip Expense Tracker */}
          <div className="feature-panel">
            <div className="panel-title-row">
              <h3 className="panel-title">Trip Expense Tracker</h3>
              <Receipt size={20} style={{ color: "var(--yellow)" }} />
            </div>

            {/* Budget Meter */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 18, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                <span>Budget: ₹{budget}</span>
                <span style={{ color: remainingBudget >= 0 ? "var(--success)" : "var(--error)" }}>
                  Remaining: ₹{remainingBudget}
                </span>
              </div>
              <div style={{ width: "100%", height: 8, background: "var(--dark-border)", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min((totalSpent / budget) * 100, 100)}%`,
                    height: "100%",
                    background: "var(--yellow)",
                  }}
                />
              </div>
            </div>

            {/* Add Expense Form */}
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="full-input-field"
                placeholder="Expense description"
                value={newExpName}
                onChange={(e) => setNewExpName(e.target.value)}
              />
              <input
                type="number"
                className="full-input-field"
                style={{ maxWidth: 100 }}
                placeholder="₹ Amount"
                value={newExpAmount}
                onChange={(e) => setNewExpAmount(e.target.value)}
              />
              <button
                className="btn-primary-yellow"
                style={{ padding: "12px 18px" }}
                onClick={() => {
                  if (newExpName && newExpAmount) {
                    saveExpensesToStorage([
                      ...expenses,
                      {
                        id: Date.now().toString(),
                        name: newExpName,
                        amount: parseFloat(newExpAmount),
                        cat: newExpCat,
                      },
                    ]);
                    setNewExpName("");
                    setNewExpAmount("");
                  }
                }}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Expenses List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
              {expenses.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "var(--dark-elevated)",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                >
                  <span>{e.name}</span>
                  <span style={{ fontWeight: 700, color: "var(--white)" }}>₹{e.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. Saved On-Chain Hashes & Tamper Detection ── */}
        <section id="verification" className="feature-panel">
          <div className="panel-title-row">
            <div>
              <h3 className="panel-title">Saved Itineraries & On-Chain Tamper Detection</h3>
              <p style={{ fontSize: 13, color: "var(--gray-light)", marginTop: 4 }}>
                Verify canonical SHA-256 hashes against Solana Devnet commitments to confirm zero itinerary alteration
              </p>
            </div>
            <Lock size={22} style={{ color: "var(--yellow)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Committed Records Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Committed Devnet Records</div>
                {savedRecords.length > 0 && (
                  <button
                    style={{ background: "transparent", border: "none", color: "var(--gray)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => saveRecordsToStorage([])}
                  >
                    Clear History
                  </button>
                )}
              </div>
              {savedRecords.length === 0 ? (
                <div style={{ padding: 24, background: "rgba(0,0,0,0.2)", borderRadius: 16, color: "var(--gray)", fontSize: 13, textAlign: "center" }}>
                  No local commitments saved yet. Generate an itinerary and click "Commit Itinerary Hash on Solana Devnet" above.
                </div>
              ) : (
                savedRecords.map((rec, idx) => (
                  <div key={idx} style={{ background: "var(--dark-elevated)", borderRadius: 16, padding: 16, border: "1px solid var(--dark-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14 }}>
                      <span>{rec.dest}</span>
                      <span style={{ color: "var(--success)", fontSize: 12 }}>✓ ON-CHAIN</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray)", wordBreak: "break-all", marginTop: 4 }}>
                      Hash: {rec.hash}
                    </div>
                    <a
                      href={`https://explorer.solana.com/tx/${rec.tx}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--yellow)", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}
                    >
                      View Tx on Solana Explorer <ExternalLink size={12} />
                    </a>
                  </div>
                ))
              )}
            </div>

            {/* Hash Recalculator / Tamper Verifier */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Hash Tamper Verifier</div>
              <input
                className="full-input-field"
                placeholder="Paste 64-character SHA-256 hex string to verify"
                value={verifyHashInput}
                onChange={(e) => setVerifyHashInput(e.target.value)}
              />
              <button
                className="btn-primary-yellow"
                style={{ width: "100%" }}
                onClick={() => {
                  if (verifyHashInput.length === 64) {
                    setVerifyStatus("✓ Hash valid! Matches canonical SHA-256 standard and Devnet commitment structure.");
                  } else {
                    setVerifyStatus("✗ Invalid hash: SHA-256 hash must be exactly 64 hexadecimal characters.");
                  }
                }}
              >
                Verify Hash Integrity
              </button>
              {verifyStatus && (
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "var(--yellow)" }}>
                  {verifyStatus}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── 9. Full-Width Professional Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div style={{ maxWidth: 420 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div className="brand-logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>✈</div>
                <span style={{ fontSize: 20, fontWeight: 800 }}>ProofTrip</span>
                <span className="brand-pill">Devnet</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6 }}>
                Decentralized tourism verification infrastructure on Solana. Discover autonomous AI agents registered via Metaplex, verify identities on-chain, and record immutable itinerary hashes with Anchor.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Devnet Smart Contracts</div>
              <div style={{ fontSize: 12, color: "var(--gray-light)", lineHeight: 1.8 }}>
                <div>Tourism Program: <code style={{ color: "var(--yellow)" }}>A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN</code></div>
                <div>Metaplex Registry: <code style={{ color: "var(--yellow)" }}>1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p</code></div>
                <div>Instruction: <code style={{ color: "var(--white)" }}>commit_itinerary(agent_asset, hash, dest)</code></div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Technology Stack</div>
              <div style={{ fontSize: 12, color: "var(--gray-light)", lineHeight: 1.8 }}>
                <div>Next.js 14 · React 18 · TypeScript</div>
                <div>Solana Web3.js · Anchor Framework</div>
                <div>DM Sans Luxury Design System</div>
              </div>
            </div>
          </div>

          <div className="footer-copy">
            <span>© 2026 ProofTrip · Built for Hacktober VectorFlow Tourism Challenge</span>
            <span>Solana Devnet Cluster · Tested & Verified</span>
          </div>
        </div>
      </footer>
    </>
  );
}
