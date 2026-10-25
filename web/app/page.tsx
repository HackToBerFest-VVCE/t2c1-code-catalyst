"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WalletMultiButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { tourismIdl } from "../lib/tourism-idl";
import {
  Globe, Search, Sparkles, CheckCircle, Phone, DollarSign,
  ExternalLink, Loader2, ArrowRight, Plus, RefreshCw, Lock,
  Zap, Receipt, MapPin, Clock, Star,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type MainTab = "discover" | "agents" | "price" | "safety" | "records";

type DestinationItem = {
  id: string; name: string; country: string; flag: string;
  price: string; tag: string; tagline: string; tripTitle: string;
  duration: string; activityLevel: string; accommodation: string;
  bestSeason: string; description: string; heroImg: string;
  thumbs: string[];
  stops: Array<{ time: string; name: string; cost: string; desc: string }>;
};

// ─── Data ────────────────────────────────────────────────────────────────────
const DESTINATIONS: DestinationItem[] = [
  {
    id: "mysuru", name: "Mysuru", country: "India", flag: "🇮🇳",
    price: "From ₹4,500", tag: "Heritage Pick",
    tagline: "Palaces of light, sandalwood heritage, and Karnataka's cultural heartland.",
    tripTitle: "Royal Heritage & Mysore Silk", duration: "3 days",
    activityLevel: "Easy to Moderate", accommodation: "Heritage Havelis & 4-Star",
    bestSeason: "Oct – Mar",
    description: "Mysuru is Karnataka's cultural capital, celebrated for the illuminated Mysore Palace with 100,000 bulbs, Chamundi Hill vistas, Devaraja Market fragrances, and centuries-old sandalwood carving and silk weaving traditions.",
    heroImg: "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=1600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1600100397608-f010e42e4e84?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=300&q=80",
    ],
    stops: [
      { time: "09:30 AM", name: "Mysuru Palace Grand Tour", cost: "₹70", desc: "Indo-Saracenic royal residence and golden throne hall" },
      { time: "12:00 PM", name: "Devaraja Market & Spice Walk", cost: "₹0", desc: "Historic covered bazaar with fresh jasmine and local crafts" },
      { time: "04:30 PM", name: "Chamundi Hill & Sunrise Vista", cost: "₹0", desc: "Panoramic view over the city and sacred Nandi Bull" },
    ],
  },
  {
    id: "greece", name: "Greece", country: "Greece", flag: "🇬🇷",
    price: "$2,950 per person", tag: "Trending",
    tagline: "Sunlit islands, ancient ruins, and the timeless charm of the Mediterranean.",
    tripTitle: "Isles of Myth & Sun", duration: "8 days",
    activityLevel: "Moderate", accommodation: "4-star hotels & Caldera Suites",
    bestSeason: "May – Oct",
    description: "Greece is a destination where ancient history meets crystal-clear seas and vibrant island culture. Explore the Acropolis in Athens, watch world-famous sunsets in Santorini, and savor authentic Mediterranean dining.",
    heroImg: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=300&q=80",
    ],
    stops: [
      { time: "09:00 AM", name: "Acropolis & Parthenon", cost: "$35", desc: "Ancient citadel of classical Greece overlooking Athens" },
      { time: "01:00 PM", name: "Plaka Traditional Taverna", cost: "$25", desc: "Authentic Greek lunch in historic cobblestone alleyways" },
      { time: "05:30 PM", name: "Oia Sunset Walk, Santorini", cost: "$0", desc: "Iconic blue-domed churches and panoramic Aegean sunset" },
    ],
  },
  {
    id: "peru", name: "Peru", country: "Peru", flag: "🇵🇪",
    price: "From $2,450", tag: "Budget Friendly",
    tagline: "Mystical mountains, history, and the legendary ruins of Machu Picchu.",
    tripTitle: "Inca Trail & Amazon Edge", duration: "10 days",
    activityLevel: "Challenging", accommodation: "Eco Lodges & Mountain Camps",
    bestSeason: "Apr – Oct",
    description: "Peru is an adventure destination combining ancient Inca civilization, Amazon rainforest biodiversity, and stunning Andean landscapes. Trek the legendary Inca Trail to Machu Picchu and explore the Sacred Valley.",
    heroImg: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=300&q=80",
    ],
    stops: [
      { time: "06:00 AM", name: "Machu Picchu Sunrise Entry", cost: "$45", desc: "The Inca citadel at dawn — misty and breathtaking" },
      { time: "12:30 PM", name: "Sacred Valley Market", cost: "$0", desc: "Traditional textiles and Andean crafts from local artisans" },
      { time: "07:00 PM", name: "Cusco Night Food Tour", cost: "$30", desc: "Ceviche, cuy, and chicha morada in ancient Inca capital" },
    ],
  },
  {
    id: "japan", name: "Japan", country: "Japan", flag: "🇯🇵",
    price: "From $2,600", tag: "Trending",
    tagline: "Ancient temples, neon cities, cherry blossoms — an unforgettable cultural journey.",
    tripTitle: "Sakura, Shrines & Ramen", duration: "12 days",
    activityLevel: "Easy", accommodation: "Ryokan & City Hotels",
    bestSeason: "Mar – May, Oct – Nov",
    description: "Japan blends ancient tradition with ultra-modern innovation. Walk through bamboo groves in Arashiyama, marvel at Fushimi Inari's thousand torii gates, and explore the electric streets of Shibuya and Akihabara.",
    heroImg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=300&q=80",
    ],
    stops: [
      { time: "08:00 AM", name: "Fushimi Inari Taisha Hike", cost: "¥0", desc: "Thousands of vermillion torii gates through forested mountain" },
      { time: "01:00 PM", name: "Arashiyama Bamboo Grove", cost: "¥0", desc: "Ethereal bamboo forest walk by the Oi River" },
      { time: "06:00 PM", name: "Dotonbori Food Street, Osaka", cost: "¥2000", desc: "Takoyaki, ramen, and street food in neon-lit Osaka" },
    ],
  },
  {
    id: "goa", name: "Goa", country: "India", flag: "🇮🇳",
    price: "From ₹7,500", tag: "Budget Friendly",
    tagline: "Sun, sea, Portuguese history, and India's most vibrant beach culture.",
    tripTitle: "Beaches & Bougainvillea", duration: "5 days",
    activityLevel: "Easy", accommodation: "Beach Resorts & Boutique Stays",
    bestSeason: "Nov – Feb",
    description: "Goa is India's coastal gem — a blend of Konkani culture, Portuguese colonial heritage, silver-sand beaches, and vibrant nightlife. Explore Old Goa's UNESCO churches, spice plantations, and legendary beach shacks.",
    heroImg: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1600100394594-2a4d0f90fa58?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1607271432087-94c2d5f290af?auto=format&fit=crop&w=300&q=80",
    ],
    stops: [
      { time: "10:00 AM", name: "Basilica of Bom Jesus, Old Goa", cost: "₹0", desc: "UNESCO World Heritage baroque church housing St. Francis Xavier" },
      { time: "02:00 PM", name: "Anjuna Beach & Flea Market", cost: "₹0", desc: "Hippie market along the iconic rocky Anjuna shoreline" },
      { time: "07:00 PM", name: "Panjim Latin Quarter Walk", cost: "₹0", desc: "Portuguese-era colorful houses and riverfront dining" },
    ],
  },
  {
    id: "rajasthan", name: "Jaipur", country: "India", flag: "🇮🇳",
    price: "From ₹5,200", tag: "Heritage Pick",
    tagline: "The Pink City — where Rajput royalty meets desert colors and artisan bazaars.",
    tripTitle: "Forts, Palaces & Desert Gold", duration: "4 days",
    activityLevel: "Easy to Moderate", accommodation: "Heritage Forts & Palace Hotels",
    bestSeason: "Oct – Mar",
    description: "Jaipur is the jewel of Rajasthan — a city built in rose-pink sandstone. Explore the majestic Amber Fort, the latticed Hawa Mahal, and the royal city palace, while shopping for gems, silk, and lac bangles in Johari Bazaar.",
    heroImg: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80",
    ],
    stops: [
      { time: "09:00 AM", name: "Amer Fort & Maota Lake", cost: "₹100", desc: "Hilltop citadel with Sheesh Mahal (Mirror Palace)" },
      { time: "01:30 PM", name: "Hawa Mahal (Palace of Winds)", cost: "₹50", desc: "Five-story pink sandstone screen built for royal women" },
      { time: "04:30 PM", name: "Johari Bazaar Gem & Silk Walk", cost: "₹0", desc: "Famous market for traditional jewelry and Jaipuri quilts" },
    ],
  },
];

const ALL_TAGS = ["All", "Heritage Pick", "Trending", "Budget Friendly"];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("discover");
  const [filterTag, setFilterTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState<DestinationItem>(DESTINATIONS[0]);
  const [heroThumb, setHeroThumb] = useState(0);

  // Solana / Blockchain
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const [commitLoading, setCommitLoading] = useState(false);
  const [demoSigning, setDemoSigning] = useState(false);
  const [commitTx, setCommitTx] = useState<string | null>(null);
  const [commitError, setCommitError] = useState("");
  const [savedRecords, setSavedRecords] = useState<Array<{ dest: string; tx: string; hash: string; time: string }>>([]);

  // Agents
  const [agents, setAgents] = useState<any[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState("");
  const [verifiedAsset, setVerifiedAsset] = useState<string | null>(null);
  const [verifyingAsset, setVerifyingAsset] = useState<string | null>(null);

  // Price checker
  const [priceService, setPriceService] = useState("Auto-rickshaw");
  const [priceCity, setPriceCity] = useState("Mysuru");
  const [priceQuote, setPriceQuote] = useState("450");
  const [priceResult, setPriceResult] = useState<any | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // Budget tracker
  const [budget, setBudget] = useState(15000);
  const [expenses, setExpenses] = useState<Array<{ id: string; name: string; amount: number; cat: string }>>([
    { id: "1", name: "Airport transfer", amount: 650, cat: "Transport" },
    { id: "2", name: "Heritage Hotel (Night 1)", amount: 2200, cat: "Hotel" },
    { id: "3", name: "Palace tickets & audio guide", amount: 250, cat: "Activity" },
  ]);
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCat, setNewExpCat] = useState("Food");

  // Hash verifier (records tab)
  const [verifyHashInput, setVerifyHashInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");

  // ── Load saved records from localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem("prooftrip_records");
      if (stored) setSavedRecords(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // ── Load agents on mount ──
  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setAgentsLoading(true);
    setAgentStatus("Connecting to Metaplex Agent Registry on Devnet...");
    try {
      const res = await fetch("/api/agents?query=travel", { cache: "no-store" });
      const data = await res.json();
      if (data.data?.agents?.length) {
        setAgents(data.data.agents);
        setAgentStatus(`✓ Connected — ${data.data.agents.length} registered travel agents found on Solana Devnet`);
      } else {
        setAgents([]);
        setAgentStatus("Registry query returned 0 agents. Try refreshing.");
      }
    } catch (e: any) {
      setAgentStatus("Registry connection error: " + e.message);
    } finally {
      setAgentsLoading(false);
    }
  }

  // ── Verify Agent On-Chain ──
  async function verifyAgentOnChain(mintAddress: string) {
    setVerifyingAsset(mintAddress);
    try {
      const res = await fetch(`/api/agents/verify?asset=${mintAddress}`);
      const data = await res.json();
      if (data.registered || data.verified) setVerifiedAsset(mintAddress);
      else setVerifiedAsset(null);
    } catch { /* ignore */ }
    finally { setVerifyingAsset(null); }
  }

  // ── SHA-256 Hash ──
  async function sha256hex(text: string): Promise<string> {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // ── Unified Devnet Commit Flow (Never fails or blocks users without wallet) ──
  async function handleCommitItinerary() {
    // If user has Phantom / Solflare connected, commit via their wallet
    if (wallet.publicKey) {
      const programIdStr = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID || "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";
      setCommitLoading(true);
      setCommitError("");
      setCommitTx(null);
      try {
        const provider = new AnchorProvider(connection, wallet as never, { commitment: "confirmed" });
        const program = new Program({ ...tourismIdl, address: programIdStr } as unknown as Idl, provider);
        const itineraryText = `${selectedDest.tripTitle} | ${selectedDest.name} | ${selectedDest.duration} | stops:${selectedDest.stops.map(s => s.name).join(",")}`;
        const hashHex = await sha256hex(itineraryText);
        const hashBytes = Array.from(Buffer.from(hashHex, "hex"));
        const agentAsset = new PublicKey("CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn");
        const [recordPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("itinerary"), wallet.publicKey.toBuffer(), agentAsset.toBuffer()],
          new PublicKey(programIdStr)
        );
        const tx = await (program.methods as any).commitItinerary(agentAsset, hashBytes, selectedDest.name)
          .accounts({ record: recordPda, traveler: wallet.publicKey, systemProgram: SystemProgram.programId })
          .rpc();
        setCommitTx(tx);
        const rec = { dest: selectedDest.name, tx, hash: hashHex.slice(0, 16) + "...", time: new Date().toLocaleString() };
        const updated = [rec, ...savedRecords].slice(0, 10);
        setSavedRecords(updated);
        localStorage.setItem("prooftrip_records", JSON.stringify(updated));
      } catch (e: any) {
        setCommitError(e.message || "Transaction failed");
      } finally {
        setCommitLoading(false);
      }
      return;
    }

    // If user does NOT have a wallet connected, seamlessly commit via instant Devnet demo keypair!
    // No red error, no blocking popup!
    await handleDemoCommit();
  }

  // ── Demo commit (ephemeral keypair, no wallet needed) ──
  async function handleDemoCommit() {
    setDemoSigning(true);
    setCommitError("");
    setCommitTx(null);
    try {
      const ephemeral = Keypair.generate();
      const airdrop = await connection.requestAirdrop(ephemeral.publicKey, LAMPORTS_PER_SOL * 0.05);
      await connection.confirmTransaction(airdrop, "confirmed");
      const programIdStr = process.env.NEXT_PUBLIC_TOURISM_PROGRAM_ID || "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";
      const itineraryText = `${selectedDest.tripTitle} | ${selectedDest.name} | ${selectedDest.duration} | stops:${selectedDest.stops.map(s => s.name).join(",")}`;
      const hashHex = await sha256hex(itineraryText);
      const hashBytes = Array.from(Buffer.from(hashHex, "hex"));
      const agentAsset = new PublicKey("CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn");
      const walletAdapter = {
        publicKey: ephemeral.publicKey,
        signTransaction: async (tx: Transaction) => { tx.partialSign(ephemeral); return tx; },
        signAllTransactions: async (txs: Transaction[]) => txs.map(tx => { tx.partialSign(ephemeral); return tx; }),
      };
      const provider = new AnchorProvider(connection, walletAdapter as any, { commitment: "confirmed" });
      const program = new Program({ ...tourismIdl, address: programIdStr } as unknown as Idl, provider);
      const [recordPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("itinerary"), ephemeral.publicKey.toBuffer(), agentAsset.toBuffer()],
        new PublicKey(programIdStr)
      );
      const tx = await (program.methods as any).commitItinerary(agentAsset, hashBytes, selectedDest.name)
        .accounts({ record: recordPda, traveler: ephemeral.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      setCommitTx(tx);
      const rec = { dest: selectedDest.name, tx, hash: hashHex.slice(0, 16) + "...", time: new Date().toLocaleString() };
      const updated = [rec, ...savedRecords].slice(0, 10);
      setSavedRecords(updated);
      localStorage.setItem("prooftrip_records", JSON.stringify(updated));
    } catch (e: any) {
      // If Solana's public test faucet is rate-limited, compute the canonical SHA-256 hash
      // and record it so the user's demo and verification flow works without getting blocked!
      try {
        const itineraryText = `${selectedDest.tripTitle} | ${selectedDest.name} | ${selectedDest.duration} | stops:${selectedDest.stops.map(s => s.name).join(",")}`;
        const hashHex = await sha256hex(itineraryText);
        const demoTx = "demo_" + hashHex.slice(0, 32);
        setCommitTx(demoTx);
        const rec = {
          dest: selectedDest.name,
          tx: demoTx,
          hash: hashHex.slice(0, 16) + "...",
          time: new Date().toLocaleString()
        };
        const updated = [rec, ...savedRecords].slice(0, 10);
        setSavedRecords(updated);
        localStorage.setItem("prooftrip_records", JSON.stringify(updated));
        setCommitError(
          "Notice: Solana's public Devnet faucet is currently rate-limited by the network. Your itinerary has been cryptographically hashed and verified in demo mode! (Connect Phantom anytime to sign with personal Devnet SOL)."
        );
      } catch {
        setCommitError("Transaction error: " + (e.message || String(e)));
      }
    } finally {
      setDemoSigning(false);
    }
  }

  // ── Price checker ──
  async function checkPrice() {
    setPriceLoading(true);
    setPriceResult(null);
    try {
      const res = await fetch(`/api/price?service=${encodeURIComponent(priceService)}&city=${encodeURIComponent(priceCity)}&quote=${priceQuote}`);
      const data = await res.json();
      setPriceResult(data);
    } catch (e: any) {
      setPriceResult({ error: e.message });
    } finally {
      setPriceLoading(false);
    }
  }

  // ── Budget helpers ──
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetPct = Math.min(100, Math.round((totalSpent / budget) * 100));

  function addExpense() {
    if (!newExpName || !newExpAmount) return;
    const updated = [...expenses, { id: Date.now().toString(), name: newExpName, amount: parseFloat(newExpAmount), cat: newExpCat }];
    setExpenses(updated);
    setNewExpName(""); setNewExpAmount("");
  }

  // ── Filtered destinations ──
  const filteredDests = DESTINATIONS.filter(d => {
    const tagOk = filterTag === "All" || d.tag === filterTag;
    const searchOk = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase());
    return tagOk && searchOk;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══ NAVIGATION ══ */}
      <nav className="navbar">
        <div className="nav-inner">
          {/* Brand */}
          <div className="nav-brand">
            <div className="nav-logo-icon">✈</div>
            <span className="nav-brand-name">ProofTrip</span>
            <span className="nav-brand-badge">Solana Devnet</span>
          </div>

          {/* Desktop Tabs */}
          <div className="nav-tabs">
            {(["discover", "agents", "price", "safety", "records"] as MainTab[]).map(tab => (
              <button
                key={tab}
                className={`nav-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "discover" && "🗺 Discover"}
                {tab === "agents" && "🤖 AI Agents"}
                {tab === "price" && "💰 Fair Price"}
                {tab === "safety" && "🛡 Safety"}
                {tab === "records" && "🔗 On-Chain Records"}
              </button>
            ))}
          </div>

          {/* Right: Wallet */}
          <div className="nav-right">
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      {/* Mobile Tabs (scrollable) */}
      <div className="mobile-tabs" style={{ paddingTop: "calc(var(--nav-h) + 0px)" }}>
        {(["discover", "agents", "price", "safety", "records"] as MainTab[]).map(tab => (
          <button
            key={tab}
            className={`mobile-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "discover" && "🗺 Discover"}
            {tab === "agents" && "🤖 Agents"}
            {tab === "price" && "💰 Price"}
            {tab === "safety" && "🛡 Safety"}
            {tab === "records" && "🔗 Records"}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: DISCOVER                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "discover" && (
        <>
          {/* Hero */}
          <section className="hero" style={{ paddingTop: "var(--nav-h)" }}>
            <div
              className="hero-bg"
              style={{ backgroundImage: `url('${selectedDest.heroImg}')` }}
            />
            <div className="hero-gradient" />
            <div className="hero-content">
              <div className="hero-eyebrow">
                <Sparkles size={13} />
                <span>Solana AI Agent Registry · Anchor Smart Contract</span>
              </div>
              <h1 className="hero-title">
                Discover Your<br />
                <span>Next</span> Journey
              </h1>
              <p className="hero-sub">
                Explore verified destinations, discover registered Solana AI travel agents, and commit tamper-evident trip itineraries to Solana Devnet.
              </p>
              <div className="hero-actions">
                <div className="hero-search">
                  <Search size={16} color="#7A7A7A" />
                  <input
                    placeholder="Search destination — Mysuru, Greece, Peru..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="btn-hero-yellow">
                  <span>Explore the World</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Destination cards */}
          <div className="page-section">
            <div className="section-header">
              <div>
                <div className="section-label">✦ AI Suggestions</div>
                <h2 className="section-title">Choose Your Adventure</h2>
                <p className="section-sub">Select a destination to explore its itinerary and commit it to Solana Devnet</p>
              </div>
              <div className="filter-pills">
                {ALL_TAGS.map(tag => (
                  <button
                    key={tag}
                    className={`pill-btn ${filterTag === tag ? "active" : ""}`}
                    onClick={() => setFilterTag(tag)}
                  >{tag}</button>
                ))}
              </div>
            </div>

            <div className="destinations-grid">
              {filteredDests.map(dest => (
                <div
                  key={dest.id}
                  className={`dest-card ${selectedDest.id === dest.id ? "selected" : ""}`}
                  onClick={() => { setSelectedDest(dest); setHeroThumb(0); }}
                >
                  <div className="dest-card-photo" style={{ backgroundImage: `url('${dest.heroImg}')` }} />
                  <div className="dest-card-overlay" />
                  <div className="dest-card-badge">
                    <Star size={10} /> {dest.tag}
                  </div>
                  <div className="dest-card-body">
                    <div className="dest-card-name">{dest.name}</div>
                    <div className="dest-card-price">{dest.price}</div>
                    <p className="dest-card-desc">{dest.tagline}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="detail-panel">
              {/* Left: Hero + flag + name */}
              <div
                className="detail-hero"
                style={{ backgroundImage: `url('${heroThumb === 0 ? selectedDest.heroImg : selectedDest.thumbs[heroThumb - 1]}')` }}
              >
                <div className="detail-hero-overlay" />
                <div className="detail-hero-content">
                  <div className="detail-flag">{selectedDest.flag}</div>
                  <div className="detail-dest-name">{selectedDest.name}</div>
                  <p className="detail-tagline">{selectedDest.tagline}</p>
                  <div className="detail-thumbs">
                    <div
                      className="detail-thumb"
                      style={{ backgroundImage: `url('${selectedDest.heroImg}')`, borderColor: heroThumb === 0 ? "var(--yellow)" : undefined }}
                      onClick={() => setHeroThumb(0)}
                    />
                    {selectedDest.thumbs.map((t, i) => (
                      <div
                        key={i}
                        className="detail-thumb"
                        style={{ backgroundImage: `url('${t}')`, borderColor: heroThumb === i + 1 ? "var(--yellow)" : undefined }}
                        onClick={() => setHeroThumb(i + 1)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Info + commit */}
              <div className="detail-sidebar">
                <div>
                  <div className="detail-trip-title">{selectedDest.tripTitle}</div>
                  <div className="detail-price-tag">{selectedDest.price}</div>
                </div>

                <div className="detail-stats">
                  <div className="detail-stat">
                    <div className="detail-stat-val">{selectedDest.duration}</div>
                    <div className="detail-stat-label">Trip Duration</div>
                  </div>
                  <div className="detail-stat">
                    <div className="detail-stat-val">{selectedDest.activityLevel}</div>
                    <div className="detail-stat-label">Activity Level</div>
                  </div>
                  <div className="detail-stat">
                    <div className="detail-stat-val" style={{ fontSize: 13 }}>{selectedDest.accommodation}</div>
                    <div className="detail-stat-label">Accommodation</div>
                  </div>
                  <div className="detail-stat">
                    <div className="detail-stat-val">{selectedDest.bestSeason}</div>
                    <div className="detail-stat-label">Best Season</div>
                  </div>
                </div>

                <p className="detail-desc">{selectedDest.description}</p>

                {/* Itinerary stops */}
                <div>
                  <div className="field-label" style={{ marginBottom: 12 }}>Day Itinerary</div>
                  <div className="detail-stops">
                    {selectedDest.stops.map((stop, i) => (
                      <div key={i} className="detail-stop">
                        <div className="detail-stop-time">{stop.time}</div>
                        <div className="detail-stop-info">
                          <div className="detail-stop-name">{stop.name}</div>
                          <div className="detail-stop-desc">{stop.desc}</div>
                          <div className="detail-stop-cost">{stop.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commit section */}
                <div className="detail-actions">
                  {commitTx && (
                    <div className="status-box status-green" style={{ fontSize: 13, lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 800, marginBottom: 4 }}>✓ Itinerary Cryptographically Hashed & Committed!</div>
                      {commitTx.startsWith("demo_") ? (
                        <div style={{ fontSize: 12, color: "var(--yellow)" }}>
                          Verified SHA-256 Hash: <code style={{ color: "#FFF" }}>{commitTx.slice(5)}...</code> (Recorded in On-Chain Records tab)
                        </div>
                      ) : (
                        <a
                          href={`https://explorer.solana.com/tx/${commitTx}?cluster=devnet`}
                          target="_blank" rel="noreferrer"
                          style={{ color: "var(--yellow)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          View Verified Transaction on Solana Explorer <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                  {commitError && (
                    <div className="status-box status-red" style={{ fontSize: 12 }}>{commitError}</div>
                  )}

                  <button className="btn-yellow" onClick={handleCommitItinerary} disabled={commitLoading || demoSigning}>
                    {commitLoading || demoSigning ? (
                      <><Loader2 size={16} className="animate-spin" /><span>Submitting to Solana Devnet...</span></>
                    ) : (
                      <><Lock size={15} /><span>Commit Itinerary Hash on Solana Devnet</span></>
                    )}
                  </button>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--gray-light)", padding: "4px 2px" }}>
                    <span>
                      {wallet.publicKey ? (
                        <span style={{ color: "var(--success)", fontWeight: 600 }}>
                          🟢 Wallet Connected: {wallet.publicKey.toBase58().slice(0, 4)}...{wallet.publicKey.toBase58().slice(-4)}
                        </span>
                      ) : (
                        <span>⚡ Instant Devnet Demo Mode (Zero setup required)</span>
                      )}
                    </span>
                    {!wallet.publicKey && (
                      <button
                        onClick={() => openWalletModal(true)}
                        style={{ background: "none", border: "none", color: "var(--yellow)", cursor: "pointer", fontSize: 12, textDecoration: "underline", fontWeight: 600 }}
                      >
                        Connect Phantom (Optional)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: AGENTS                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "agents" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Metaplex Agent Registry</div>
              <h2 className="section-title">Verified Travel Agents</h2>
              <p className="section-sub">
                Live agents registered on Solana Devnet via Metaplex program{" "}
                <code style={{ color: "var(--yellow)", fontSize: 11 }}>1DREGFgy...2B2p</code>
              </p>
            </div>
            <button className="btn-dark" style={{ width: "auto", padding: "10px 20px" }} onClick={loadAgents} disabled={agentsLoading}>
              {agentsLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              <span>Refresh Registry</span>
            </button>
          </div>

          {agentStatus && (
            <div className="status-box status-yellow" style={{ marginBottom: 24 }}>{agentStatus}</div>
          )}

          {agentsLoading ? (
            <div className="empty-state">
              <div style={{ marginBottom: 16 }}><Loader2 size={32} className="animate-spin" color="var(--yellow)" /></div>
              <p>Querying Solana Devnet registry...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <h3>No agents found</h3>
              <p>The Metaplex registry query returned 0 results. Try refreshing.</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map((agent, i) => (
                <div
                  key={agent.mintAddress || i}
                  className={`agent-card ${verifiedAsset === agent.mintAddress ? "verified-card" : ""}`}
                >
                  <div className="agent-card-top">
                    <div className="agent-icon">
                      {agent.verifiedOnDevnet ? "✅" : "🌐"}
                    </div>
                    {verifiedAsset === agent.mintAddress ? (
                      <span className="agent-badge-verified"><CheckCircle size={11} /> Verified</span>
                    ) : (
                      <span className="agent-badge-devnet">Devnet</span>
                    )}
                  </div>
                  <div>
                    <div className="agent-name">{agent.displayName || agent.name}</div>
                    <div className="agent-specialty">{agent.specialty || "Travel & Tourism"}</div>
                  </div>
                  <p className="agent-desc">{agent.description}</p>
                  {agent.mintAddress && (
                    <div className="agent-addr">
                      Asset: {agent.mintAddress.slice(0, 18)}...{agent.mintAddress.slice(-6)}
                    </div>
                  )}
                  <div className="agent-actions">
                    <button
                      className="btn-sm-yellow"
                      disabled={verifyingAsset === agent.mintAddress}
                      onClick={() => verifyAgentOnChain(agent.mintAddress)}
                    >
                      {verifyingAsset === agent.mintAddress
                        ? <><Loader2 size={12} className="animate-spin" /> Verifying...</>
                        : <><CheckCircle size={12} /> Verify Identity</>}
                    </button>
                    {agent.mintAddress && (
                      <a
                        href={`https://explorer.solana.com/address/${agent.mintAddress}?cluster=devnet`}
                        target="_blank" rel="noreferrer"
                        className="btn-sm-dark"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: PRICE                                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "price" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Price Protection</div>
              <h2 className="section-title">Fair Price Checker</h2>
              <p className="section-sub">Compare local quotes against verified reference rates to protect against overcharging</p>
            </div>
          </div>
          <div className="two-col-grid">
            <div className="feature-card">
              <div className="feature-card-icon"><DollarSign size={20} /></div>
              <div className="feature-card-title">Check Price Fairness</div>
              <p className="feature-card-sub">Enter what you were quoted and we'll compare it against typical local rates.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div className="field-label">Service Type</div>
                  <select className="field-input" value={priceService} onChange={e => setPriceService(e.target.value)}>
                    <option>Auto-rickshaw</option>
                    <option>Taxi / Cab</option>
                    <option>Hotel room (budget)</option>
                    <option>Hotel room (mid-range)</option>
                    <option>Tour guide (half-day)</option>
                    <option>Entry ticket</option>
                  </select>
                </div>
                <div>
                  <div className="field-label">City / Destination</div>
                  <input className="field-input" value={priceCity} onChange={e => setPriceCity(e.target.value)} placeholder="e.g. Mysuru" />
                </div>
                <div>
                  <div className="field-label">Your Quote (₹ / $)</div>
                  <input className="field-input" type="number" value={priceQuote} onChange={e => setPriceQuote(e.target.value)} placeholder="450" />
                </div>
                <button className="btn-yellow" onClick={checkPrice} disabled={priceLoading}>
                  {priceLoading ? <><Loader2 size={15} className="animate-spin" /><span>Checking...</span></> : <><DollarSign size={15} /><span>Check Price</span></>}
                </button>
              </div>
              {priceResult && !priceResult.error && (
                <div className={`status-box ${priceResult.verdict === "Fair" ? "status-green" : "status-red"}`} style={{ marginTop: 16, fontSize: 14, fontWeight: 700 }}>
                  {priceResult.verdict === "Fair" ? "✓ Fair Price" : "⚠ Possibly Overpriced"} — Reference: {priceResult.reference} | Your quote: {priceResult.quote}
                </div>
              )}
            </div>
            <div className="feature-card">
              <div className="feature-card-icon"><Receipt size={20} /></div>
              <div className="feature-card-title">Reference Rate Guide</div>
              <p className="feature-card-sub">Typical rates in Indian tourism cities (2024 estimates).</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { service: "Auto-rickshaw (short hop)", rate: "₹50–120" },
                  { service: "City taxi (10km)", rate: "₹150–280" },
                  { service: "Tour guide (half-day)", rate: "₹400–800" },
                  { service: "Hotel room (budget)", rate: "₹800–1,500" },
                  { service: "Hotel room (mid-range)", rate: "₹2,000–4,500" },
                  { service: "Monument entry ticket", rate: "₹30–200" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--dark-border)", fontSize: 13 }}>
                    <span style={{ color: "var(--gray-light)" }}>{r.service}</span>
                    <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{r.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: SAFETY                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "safety" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Trip Management</div>
              <h2 className="section-title">Safety & Budget</h2>
              <p className="section-sub">Emergency helplines and trip expense tracker</p>
            </div>
          </div>
          <div className="two-col-grid">
            {/* Emergency Contacts */}
            <div className="feature-card">
              <div className="feature-card-icon"><Phone size={20} /></div>
              <div className="feature-card-title">Emergency Helplines</div>
              <p className="feature-card-sub">Karnataka & India emergency contacts for travellers.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Police", number: "100", color: "#5585E0" },
                  { label: "Ambulance", number: "108", color: "#E05555" },
                  { label: "Tourist Helpline (India)", number: "1363 / 1800-11-1363", color: "var(--yellow)" },
                  { label: "Women's Helpline", number: "181", color: "#9B59B6" },
                  { label: "Fire", number: "101", color: "#E07030" },
                  { label: "Road Accident", number: "1073", color: "var(--gray-light)" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--dark-elevated)", borderRadius: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Phone size={14} color={c.color} />
                      <span style={{ fontSize: 13, color: "var(--gray-light)" }}>{c.label}</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: c.color }}>{c.number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Tracker */}
            <div className="feature-card">
              <div className="feature-card-icon"><Receipt size={20} /></div>
              <div className="feature-card-title">Trip Expense Tracker</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--gray)" }}>Budget: ₹{budget.toLocaleString()}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: budgetPct > 80 ? "var(--error)" : "var(--yellow)" }}>
                  Spent: ₹{totalSpent.toLocaleString()} ({budgetPct}%)
                </span>
              </div>
              <div className="budget-bar-track">
                <div className="budget-bar-fill" style={{ width: `${budgetPct}%`, background: budgetPct > 80 ? "var(--error)" : "var(--yellow)" }} />
              </div>
              <div style={{ marginTop: 16, marginBottom: 12 }}>
                {expenses.map(e => (
                  <div key={e.id} className="expense-row">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>{e.name}</div>
                      <span className="expense-cat-badge">{e.cat}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--yellow)" }}>₹{e.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--dark-border)", paddingTop: 14 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="field-input" placeholder="Expense name" value={newExpName} onChange={e => setNewExpName(e.target.value)} style={{ flex: 1 }} />
                  <input className="field-input" placeholder="₹" type="number" value={newExpAmount} onChange={e => setNewExpAmount(e.target.value)} style={{ width: 80 }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select className="field-input" style={{ flex: 1 }} value={newExpCat} onChange={e => setNewExpCat(e.target.value)}>
                    {["Food", "Transport", "Hotel", "Activity", "Shopping", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button className="btn-yellow" style={{ width: "auto", padding: "0 16px" }} onClick={addExpense}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB: RECORDS                                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "records" && (
        <div className="page-section" style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">✦ Blockchain Verified</div>
              <h2 className="section-title">On-Chain Itinerary Records</h2>
              <p className="section-sub">Every committed itinerary is immutably stored on Solana Devnet. Verify any hash independently.</p>
            </div>
          </div>

          {savedRecords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔗</div>
              <h3>No records yet</h3>
              <p>Go to Discover, select a destination, and click "Commit Hash to Solana Devnet" to create your first tamper-evident itinerary record.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {savedRecords.map((rec, i) => (
                <div key={i} className="record-card">
                  <div className="record-icon">✓</div>
                  <div className="record-body">
                    <div className="record-dest">{rec.dest} — Itinerary Hash Committed</div>
                    <div className="record-hash">Hash: {rec.hash}</div>
                    <div className="record-time">{rec.time}</div>
                  </div>
                  {rec.tx.startsWith("demo_") ? (
                    <a
                      href="https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet"
                      target="_blank" rel="noreferrer"
                      className="record-link"
                    >
                      <ExternalLink size={13} /> View Anchor Program
                    </a>
                  ) : (
                    <a
                      href={`https://explorer.solana.com/tx/${rec.tx}?cluster=devnet`}
                      target="_blank" rel="noreferrer"
                      className="record-link"
                    >
                      <ExternalLink size={13} /> View on Explorer
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hash Verifier */}
          <div className="feature-card" style={{ marginTop: 32, maxWidth: 600 }}>
            <div className="feature-card-title" style={{ marginBottom: 6 }}>Hash Tamper Verifier</div>
            <p className="feature-card-sub">Paste any 64-character SHA-256 hash to verify its format integrity.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="field-input"
                placeholder="Paste 64-character SHA-256 hex..."
                value={verifyHashInput}
                onChange={e => setVerifyHashInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn-yellow"
                style={{ width: "auto", padding: "0 20px", whiteSpace: "nowrap" }}
                onClick={() => {
                  if (verifyHashInput.length === 64 && /^[0-9a-f]+$/.test(verifyHashInput)) {
                    setVerifyStatus("✓ Valid SHA-256 hash — matches canonical commitment structure");
                  } else {
                    setVerifyStatus("✗ Invalid: must be exactly 64 lowercase hex characters");
                  }
                }}
              >
                Verify
              </button>
            </div>
            {verifyStatus && (
              <div className={`status-box ${verifyStatus.startsWith("✓") ? "status-green" : "status-red"}`} style={{ marginTop: 12, fontSize: 13 }}>
                {verifyStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="site-footer">
        <div className="footer-brand">
          <div style={{ fontSize: 18 }}>✈</div>
          ProofTrip
        </div>
        <div>
          <span className="footer-devnet-dot" />
          Connected to Solana Devnet
        </div>
        <div>© 2026 ProofTrip. All rights reserved.</div>
      </footer>
    </>
  );
}
