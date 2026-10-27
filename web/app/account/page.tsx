"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Sparkles,
  UserPlus,
  Plus,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Copy,
  Layers,
  Compass,
  Wallet,
  Lock,
  Tag,
  CheckCircle2,
  Calendar,
  Sparkle,
  BadgeCheck,
  FileText,
  Bot,
  RefreshCw,
  Star,
  MessageSquare,
  Download,
  WifiOff,
  Printer,
} from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../../lib/i18n";
import { OfflineRemoteModal } from "../../components/OfflineRemoteModal";
import { AgentFeedbackModal } from "../../components/AgentFeedbackModal";
import {
  getAgentReviews,
  getTopAgentReview,
  normalizeAgentKey,
  type AgentReview,
} from "../../lib/agent-reviews";
import {
  downloadOfflinePassFile,
  printOfflinePass,
  type ItineraryPlan,
  type ItineraryDay,
} from "../../lib/offline-pass-generator";

// Client-only dynamic import of WalletMultiButton to prevent Next.js SSR hydration mismatches
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <button className="wallet-adapter-button" style={{ opacity: 0.8 }}>
        Loading Wallet...
      </button>
    ),
  }
);

export interface AccountProfile {
  name: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  country: string;
  timeZone: string;
  welcomeMessage: string;
  avatarUrl: string;
}

export interface TravelAgreementRecord {
  id: string;
  dest: string;
  cityName: string;
  heroImg?: string;
  agentName: string;
  agentRole: string;
  agentPda: string;
  agentTrustScore: number;
  agentRating?: number;
  agentAvatar?: string;
  priceLocked: string;
  transitPass: string;
  tx: string;
  hash: string;
  date: string;
  time: string;
  status: string;
  plan?: ItineraryPlan;
}

function buildPlanFromAgreement(
  agreement: TravelAgreementRecord,
  travelerCountry: string = "India"
): ItineraryPlan {
  if (agreement.plan && agreement.plan.days && agreement.plan.days.length > 0) {
    return {
      ...agreement.plan,
      certificateId: agreement.tx || agreement.plan.certificateId,
      transitPass: agreement.transitPass || agreement.plan.transitPass,
      country: travelerCountry,
    };
  }

  const rawNum = parseInt(agreement.priceLocked.replace(/[^0-9]/g, ""), 10);
  const totalBudget = isNaN(rawNum) || rawNum === 0 ? 14250 : rawNum;
  const attractionsCost = Math.round(totalBudget * 0.35);
  const transitCost = Math.round(totalBudget * 0.15);
  const diningStayCost = totalBudget - attractionsCost - transitCost;

  const cityName = agreement.cityName || "India Destination";
  const numDays = agreement.dest.includes("5D")
    ? 5
    : agreement.dest.includes("3D")
    ? 3
    : 3;

  const days: ItineraryDay[] = [
    {
      dayNumber: 1,
      theme: `${cityName} Heritage Foundations & Royal Architecture`,
      stops: [
        {
          time: "08:30 AM",
          name: agreement.dest.replace(/\s*\(\d+D\)/i, ""),
          category: "Monument & Heritage Site",
          duration: "2.5 hours",
          tip: `Official admission verified under ${agreement.agentName}. Present certificate ${agreement.tx} for expedited entry.`,
          costDisplay: "Included in Pass (₹450 value)",
          transitHop: agreement.transitPass,
        },
        {
          time: "01:00 PM",
          name: `Authentic ${cityName} Traditional Dining`,
          category: "Certified Culinary",
          duration: "1.5 hours",
          tip: "Fixed-price fair tariff certified dining. No unexpected service markups.",
          costDisplay: "₹450 - ₹750 per person",
        },
        {
          time: "03:30 PM",
          name: `Historic Artisan Bazaar & Cultural Promenade`,
          category: "Artisans & Handicrafts",
          duration: "2 hours",
          tip: "Govt-recognized cooperative stalls with fixed standard pricing.",
          costDisplay: "Free Entry",
          transitHop: `${agreement.transitPass} connection`,
        },
      ],
    },
    {
      dayNumber: 2,
      theme: `${cityName} Sacred Shrines & Sunset Panoramic Overlooks`,
      stops: [
        {
          time: "09:00 AM",
          name: `${cityName} Sacred Shrines & Temple Precincts`,
          category: "Cultural Heritage",
          duration: "2 hours",
          tip: "Early morning darshan with queue assistance. Modest attire requested.",
          costDisplay: "Special Darshan Pass Included",
          transitHop: agreement.transitPass,
        },
        {
          time: "02:00 PM",
          name: `${cityName} Regional Museum & Royal Gardens`,
          category: "Botanical & Royal History",
          duration: "2.5 hours",
          tip: "Protected green corridor with tranquil shaded walking trails.",
          costDisplay: "₹150 (Included)",
        },
        {
          time: "05:30 PM",
          name: `${cityName} Panoramic Sunset Viewpoint`,
          category: "Scenic Nature",
          duration: "1.5 hours",
          tip: "Optimal viewpoint for photography as golden hour illuminates the valley.",
          costDisplay: "Open Scenic Area",
        },
      ],
    },
    {
      dayNumber: 3,
      theme: `${cityName} Living Traditions, Craft Villages & Departure Prep`,
      stops: [
        {
          time: "09:30 AM",
          name: `Regional Heritage Craft Workshop`,
          category: "Living Traditions",
          duration: "2 hours",
          tip: "Direct engagement with master artisans with anti-commission seal.",
          costDisplay: "Workshop Entry Included",
          transitHop: agreement.transitPass,
        },
        {
          time: "01:30 PM",
          name: "Farewell Thali & Certified Spice Merchants",
          category: "Culinary & Souvenirs",
          duration: "2 hours",
          tip: "Certified pure spices sealed with municipal quality mark.",
          costDisplay: "₹600 - ₹900",
        },
      ],
    },
  ];

  return {
    city: cityName,
    numDays,
    totalBudget,
    currency: "INR",
    totalBudgetSOL: ((totalBudget / 15000) * 0.95).toFixed(2),
    crowd: "balanced",
    pace: "explorer",
    days,
    costs: {
      attractions: attractionsCost,
      transit: transitCost,
      diningStay: diningStayCost,
    },
    transitPass: agreement.transitPass,
    operatorCode: "YATRASETU-GOV-SOLANA",
    certificateId: agreement.tx,
    country: travelerCountry,
  };
}

const DEFAULT_PROFILE: AccountProfile = {
  name: "Can Saas",
  language: "English",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  country: "Indonesia",
  timeZone: "Eastern - US & Canada (UTC-05:00)",
  welcomeMessage:
    "Welcome to my scheduling page. Please follow the instruction to add an event calendar",
  avatarUrl: "",
};

const COUNTRIES = [
  "Indonesia",
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Canada",
  "Singapore",
  "United Arab Emirates",
  "Switzerland",
  "Italy",
  "Spain",
];

const TIMEZONES = [
  { label: "Eastern - US & Canada (UTC-05:00)", offset: -5 },
  { label: "IST - India Standard Time (UTC+05:30)", offset: 5.5 },
  { label: "WIB - Western Indonesia (UTC+07:00)", offset: 7 },
  { label: "GMT - London / UK (UTC+00:00)", offset: 0 },
  { label: "CET - Central Europe (UTC+01:00)", offset: 1 },
  { label: "PST - Pacific Time (UTC-08:00)", offset: -8 },
  { label: "SGT - Singapore / Malaysia (UTC+08:00)", offset: 8 },
  { label: "JST - Japan Standard Time (UTC+09:00)", offset: 9 },
];


export interface ConciergeAgentMeta {
  id: string;
  name: string;
  shortName: string;
  role: string;
  specialty: string;
  mintAddress: string;
  identityPda: string;
  trustScore: number;
  sealStatus: string;
  tripsVerified: number;
  rating: number;
  status: string;
  lastUsedItinerary: string;
}

const REAL_CONCIERGE_AGENTS: ConciergeAgentMeta[] = [
  {
    id: "touristmitra",
    name: "Touristमित्र Heritage & Travel Concierge",
    shortName: "Touristमित्र",
    role: "All-India Municipal Fair Tariff & Verified Protection",
    specialty: "Comprehensive 24/7 Helpline, Sovereign Seal & Fraud Guarantee",
    mintAddress: "CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn",
    identityPda: "1xEXUh3Ygpo8xzWyTyFzih249FihsbDNC1G4SE4FeBP",
    trustScore: 99.8,
    sealStatus: "SEAL Tier-1 Verified",
    tripsVerified: 1420,
    rating: 9.8,
    status: "Primary Identity",
    lastUsedItinerary: "Golden Triangle & Heritage Trail",
  },
  {
    id: "vikram",
    name: "Vikram - Fair Pricing & Tariff Auditor",
    shortName: "Vikram",
    role: "Tariff Auditor & Anti-Scam Verification Agent",
    specialty: "Municipal Auto Fare Benchmarks, Guide Fee Auditing & Overcharge Alerts",
    mintAddress: "CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn",
    identityPda: "1xEXUh3Ygpo8xzWyTyFzih249FihsbDNC1G4SE4FeBP",
    trustScore: 99.2,
    sealStatus: "SEAL Tier-1 Verified",
    tripsVerified: 1105,
    rating: 9.5,
    status: "Active Auditor",
    lastUsedItinerary: "Hampi UNESCO Ruins & Tungabhadra",
  },
  {
    id: "arjun",
    name: "Arjun - Cultural Heritage & Temple Guide",
    shortName: "Arjun",
    role: "Cultural Heritage & Sacred Temple Guide",
    specialty: "Heritage Itineraries, Temple Architecture & Price Protection",
    mintAddress: "AJ7XTKj5VJHXo87qQogjckmSz3upbLX9MVzK5fy9TgX",
    identityPda: "73fpiE4YdPRMpfb86rcuBoZ33KDkVtyFmU6nVQpKGP2A",
    trustScore: 98.6,
    sealStatus: "SEAL Tier-1 Verified",
    tripsVerified: 1240,
    rating: 9.1,
    status: "Recently Used",
    lastUsedItinerary: "Mysore Cultural Heritage & Palaces",
  },
  {
    id: "sendero",
    name: "Sendero - Smart Transit & Route Optimizer",
    shortName: "Sendero",
    role: "Autonomous Booking & Multi-Modal Transit",
    specialty: "Premier Stays, Flights, Hotel Stays & Ground Transit",
    mintAddress: "5KXXM4PnaKHHbjgKshQgGNhV66srYbnEnqB5L2tY3hGn",
    identityPda: "HA93hVGrCaZVEPTNcPjsquys99ibBCoqYUkSnSTDaQwJ",
    trustScore: 98.0,
    sealStatus: "SEAL Tier-1 Verified",
    tripsVerified: 980,
    rating: 8.9,
    status: "Verified On-Chain",
    lastUsedItinerary: "Bengaluru - Coorg Coffee Trail",
  },
  {
    id: "ananya",
    name: "Ananya - Local Cuisine & Artisan Scout",
    shortName: "Ananya",
    role: "Artisan Scout & Heritage Culinary Concierge",
    specialty: "Traditional Weaver Workshops, GI-Tagged Handicrafts & Regional Thalis",
    mintAddress: "AJ7XTKj5VJHXo87qQogjckmSz3upbLX9MVzK5fy9TgX",
    identityPda: "73fpiE4YdPRMpfb86rcuBoZ33KDkVtyFmU6nVQpKGP2A",
    trustScore: 97.4,
    sealStatus: "SEAL Tier-2 Verified",
    tripsVerified: 840,
    rating: 8.5,
    status: "Verified Concierge",
    lastUsedItinerary: "Jaipur Pink City & Amber Fort",
  },
  {
    id: "priya",
    name: "Priya - Transport & Safety Specialist",
    shortName: "Priya",
    role: "Transit Logistics & Tourist Safety Specialist",
    specialty: "KSRTC / DMRC Passes, Safe Route Mapping & Night Transit",
    mintAddress: "HA93hVGrCaZVEPTNcPjsquys99ibBCoqYUkSnSTDaQwJ",
    identityPda: "HA93hVGrCaZVEPTNcPjsquys99ibBCoqYUkSnSTDaQwJ",
    trustScore: 96.5,
    sealStatus: "SEAL Tier-2 Verified",
    tripsVerified: 750,
    rating: 7.9,
    status: "Verified On-Chain",
    lastUsedItinerary: "Kochi Fort & Backwaters",
  },
];

function getAgentRating(agentName?: string): number {
  if (!agentName) return 9.8;
  const s = agentName.toLowerCase();
  if (s.includes("tourist") || s.includes("mitra")) return 9.8;
  if (s.includes("vikram") || s.includes("pricing") || s.includes("tariff")) return 9.5;
  if (s.includes("arjun") || s.includes("heritage") || s.includes("temple")) return 9.1;
  if (s.includes("sendero") || s.includes("transit") || s.includes("corporate")) return 8.9;
  if (s.includes("ananya") || s.includes("cuisine") || s.includes("artisan")) return 8.5;
  if (s.includes("priya") || s.includes("safety")) return 7.9;
  return 9.5;
}

const PREVIOUS_AGENTS: ConciergeAgentMeta[] = REAL_CONCIERGE_AGENTS;

const INITIAL_SAMPLE_AGREEMENT: TravelAgreementRecord = {
  id: "AGREE-INIT-1",
  dest: "Mysore Cultural Heritage & Palaces (3D)",
  cityName: "Mysore",
  agentName: "Arjun - Cultural Heritage & Temple Guide",
  agentRole: "Heritage Itineraries & Price Protection",
  agentPda: "1xEXUh3Ygpo8xzWyTyFzih249FihsbDNC1G4SE4FeBP",
  agentTrustScore: 98.6,
  agentRating: 9.1,
  priceLocked: "₹14,250",
  transitPass: "KSRTC Heritage Daily Pass",
  tx: "CERT-9A82-F41C",
  hash: "9a82f41cb8291f0034a78c187d95392ea814",
  date: "27 Oct 2026",
  time: "07:30 AM",
  status: "Certified & Price Locked",
};

export default function AccountPage() {
  const [profile, setProfile] = useState<AccountProfile>(DEFAULT_PROFILE);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedProgramId, setCopiedProgramId] = useState(false);
  const [savedAgreements, setSavedAgreements] = useState<TravelAgreementRecord[]>([]);
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);
  const [downloadedAgreementId, setDownloadedAgreementId] = useState<string | null>(null);
  const [offlineModalData, setOfflineModalData] = useState<{
    plan: ItineraryPlan;
    cityName: string;
    certId?: string;
  } | null>(null);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Concierge Feedback & Reviews Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackModalData, setFeedbackModalData] = useState<{
    agentName: string;
    agentRating: number;
    agentTrustScore: number;
    agentRole: string;
    itineraryTitle: string;
  }>({
    agentName: "Touristमित्र Heritage & Travel Concierge",
    agentRating: 9.8,
    agentTrustScore: 99.8,
    agentRole: "All-India Municipal Fair Tariff & Verified Protection",
    itineraryTitle: "Curated Cultural Itinerary",
  });

  const handleOpenFeedbackModal = (
    agentName: string,
    rating?: number,
    trustScore?: number,
    role?: string,
    tripTitle?: string
  ) => {
    setFeedbackModalData({
      agentName: agentName || "Touristमित्र Heritage & Travel Concierge",
      agentRating: rating || getAgentRating(agentName),
      agentTrustScore: trustScore || 99.2,
      agentRole: role || "Autonomous Travel Concierge",
      itineraryTitle: tripTitle || "Curated Cultural Itinerary",
    });
    setIsFeedbackModalOpen(true);
  };
  const [activeAgentId, setActiveAgentId] = useState<string>("touristmitra");
  const [agentsList, setAgentsList] = useState<ConciergeAgentMeta[]>(REAL_CONCIERGE_AGENTS);
  const [refreshingAgents, setRefreshingAgents] = useState(false);
  const [refreshAgentsNotice, setRefreshAgentsNotice] = useState<string | null>(null);

  const handleRefreshAgents = async () => {
    setRefreshingAgents(true);
    setRefreshAgentsNotice(null);
    try {
      const res = await fetch("/api/agents?query=travel");
      if (res.ok) {
        const data = await res.json();
        const rawList = data?.data?.agents || [];
        if (rawList.length > 0) {
          const mapped: ConciergeAgentMeta[] = rawList.map((a: any, idx: number) => {
            const short = a.displayName ? a.displayName.split(" ")[0] : a.name.slice(0, 10);
            const stableId = normalizeAgentKey(a.displayName || a.name);
            return {
              id: stableId,
              name: a.displayName || a.name,
              shortName: short,
              role: a.specialty || "Verified Concierge",
              specialty: a.description || a.specialty,
              mintAddress: a.mintAddress || "CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn",
              identityPda: a.identityPda || "1xEXUh3Ygpo8xzWyTyFzih249FihsbDNC1G4SE4FeBP",
              trustScore: a.reputation?.trustScore ?? 99.0,
              sealStatus: a.reputation?.sealStatus || "SEAL Tier-1 Verified",
              tripsVerified: a.reputation?.totalTripsVerified || 1000,
              rating: a.reputation?.rating ?? getAgentRating(a.displayName || a.name),
              status: "Live Devnet Registry",
              lastUsedItinerary: "Solana Registry Synced",
            };
          });
          setAgentsList(mapped);
          setRefreshAgentsNotice("Real AI agents synchronized from Solana Devnet Registry!");
        }
      }
    } catch (err) {
      console.warn("Failed to refresh agents", err);
    } finally {
      setTimeout(() => {
        setRefreshingAgents(false);
        setTimeout(() => setRefreshAgentsNotice(null), 3500);
      }, 600);
    }
  };

  useEffect(() => {
    try {
      const savedAgent = localStorage.getItem("yatrasetu_selected_agent");
      if (savedAgent) {
        const parsed = JSON.parse(savedAgent);
        if (parsed.name) {
          const match = agentsList.find(
            (a) => a.name === parsed.name || a.shortName === parsed.displayName || a.name === parsed.displayName
          );
          if (match) setActiveAgentId(match.id);
        }
      }
    } catch {}
  }, [agentsList]);

  const handleSetActiveAgent = (agent: ConciergeAgentMeta) => {
    setActiveAgentId(agent.id);
    try {
      localStorage.setItem(
        "yatrasetu_selected_agent",
        JSON.stringify({
          name: agent.name,
          displayName: agent.name,
          specialty: agent.specialty,
          mintAddress: agent.mintAddress,
          identityPda: agent.identityPda,
          reputation: {
            trustScore: agent.trustScore,
            totalTripsVerified: agent.tripsVerified,
            rating: agent.rating,
            sealStatus: agent.sealStatus,
          },
        })
      );
      setSaveStatus(`Active concierge assigned to ${agent.shortName}!`);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch {}
  };

  // Load profile and agreements from localStorage on mount
  useEffect(() => {
    const wasDeleted = typeof window !== "undefined" && localStorage.getItem("yatrasetu_account_deleted") === "true";

    try {
      const savedProfile = localStorage.getItem("yatrasetu_account_profile");
      if (savedProfile) {
        setProfile((prev) => ({ ...prev, ...JSON.parse(savedProfile) }));
      } else if (wasDeleted) {
        setProfile({
          name: "",
          language: "English",
          dateFormat: "DD/MM/YYYY",
          timeFormat: "24h",
          country: "India",
          timeZone: "IST - India Standard Time (UTC+05:30)",
          welcomeMessage: "",
          avatarUrl: "",
        });
      }
    } catch {
      // fallback
    }

    try {
      const savedAgr = localStorage.getItem("yatrasetu_travel_agreements");

      // If user explicitly deleted their account or cleared all agreements, preserve empty state
      if (wasDeleted || savedAgr === "[]") {
        setSavedAgreements([]);
        return;
      }

      if (savedAgr) {
        const parsed = JSON.parse(savedAgr);
        if (Array.isArray(parsed)) {
          setSavedAgreements(parsed);
          return;
        }
      }

      // Initial first visit default agreement
      setSavedAgreements([INITIAL_SAMPLE_AGREEMENT]);
    } catch {
      setSavedAgreements([]);
    }
  }, []);

  // Update real-time clock based on selected time format and time zone
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const tzObj = TIMEZONES.find((t) => t.label === profile.timeZone) || TIMEZONES[0];
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetDate = new Date(utcMs + tzObj.offset * 3600000);

      const hours = targetDate.getHours();
      const minutes = String(targetDate.getMinutes()).padStart(2, "0");
      const seconds = String(targetDate.getSeconds()).padStart(2, "0");

      if (profile.timeFormat === "12h") {
        const ampm = hours >= 12 ? "PM" : "AM";
        const h12 = hours % 12 || 12;
        setCurrentTimeStr(`${h12}:${minutes}:${seconds} ${ampm}`);
      } else {
        const h24 = String(hours).padStart(2, "0");
        setCurrentTimeStr(`${h24}:${minutes}:${seconds}`);
      }
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [profile.timeZone, profile.timeFormat]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("yatrasetu_account_profile", JSON.stringify(profile));
      localStorage.removeItem("yatrasetu_account_deleted");
      setSaveStatus("Changes saved successfully!");
      setTimeout(() => setSaveStatus(""), 3500);
    } catch {
      setSaveStatus("Error saving profile to storage.");
      setTimeout(() => setSaveStatus(""), 3500);
    }
  };

  const handleCancel = () => {
    try {
      const wasDeleted = localStorage.getItem("yatrasetu_account_deleted") === "true";
      const saved = localStorage.getItem("yatrasetu_account_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
        setSaveStatus("Form reset to saved values.");
      } else if (wasDeleted) {
        setProfile({
          name: "",
          language: "English",
          dateFormat: "DD/MM/YYYY",
          timeFormat: "24h",
          country: "India",
          timeZone: "IST - India Standard Time (UTC+05:30)",
          welcomeMessage: "",
          avatarUrl: "",
        });
        setSaveStatus("Form cleared.");
      } else {
        setProfile(DEFAULT_PROFILE);
        setSaveStatus("Reset to default profile.");
      }
      setTimeout(() => setSaveStatus(""), 2500);
    } catch {
      setProfile(DEFAULT_PROFILE);
    }
  };

  const handleDeleteAccount = () => {
    try {
      // 1. Wipe all local storage keys related to account, agreements, active agents, and reviews
      localStorage.removeItem("yatrasetu_account_profile");
      localStorage.setItem("yatrasetu_travel_agreements", JSON.stringify([]));
      localStorage.removeItem("yatrasetu_selected_agent");
      localStorage.removeItem("yatrasetu_agent_user_reviews");
      localStorage.removeItem("prooftrip_records");
      localStorage.removeItem("touristmatram_traveler_type");
      localStorage.removeItem("touristmatram_foreign_country");
      localStorage.setItem("yatrasetu_account_deleted", "true");

      // 2. Reset all in-memory component states so the screen immediately reflects the deletion
      setProfile({
        name: "",
        language: "English",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        country: "India",
        timeZone: "IST - India Standard Time (UTC+05:30)",
        welcomeMessage: "",
        avatarUrl: "",
      });
      setSavedAgreements([]);
      setActiveAgentId("touristmitra");
      setAgentsList(REAL_CONCIERGE_AGENTS);
      setRefreshAgentsNotice(null);
      setShowDeleteModal(false);

      // 3. User confirmation notification
      setSaveStatus("✓ Account deleted. All agreements and preferences have been cleared.");
      setTimeout(() => setSaveStatus(""), 4000);
    } catch (e) {
      console.warn("Delete account error:", e);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteAgreement = (id: string) => {
    setSavedAgreements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem("yatrasetu_travel_agreements", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSaveStatus("Travel agreement removed.");
    setTimeout(() => setSaveStatus(""), 2500);
  };

  const handleDownloadOfflineAgreement = (agreement: TravelAgreementRecord) => {
    try {
      const plan = buildPlanFromAgreement(agreement, profile.country);
      printOfflinePass(plan, {
        travelerType: profile.country.toLowerCase() === "india" ? "indian" : "foreign",
        foreignCountry: profile.country.toLowerCase() !== "india" ? profile.country : undefined,
        generatedDate: `${agreement.date} · ${agreement.time}`,
      });
      setDownloadedAgreementId(agreement.id);
      setSaveStatus(`Downloading PDF Pass for ${agreement.cityName || agreement.dest}...`);
      setTimeout(() => {
        setDownloadedAgreementId(null);
        setSaveStatus("");
      }, 3500);
    } catch (err) {
      console.error("PDF download failed:", err);
      setSaveStatus("Failed to generate PDF pass. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleOpenOfflineModal = (agreement: TravelAgreementRecord) => {
    const plan = buildPlanFromAgreement(agreement, profile.country);
    setOfflineModalData({
      plan,
      cityName: agreement.cityName || agreement.dest,
      certId: agreement.tx,
    });
    setIsOfflineModalOpen(true);
  };

  const handleDownloadAllOffline = () => {
    if (savedAgreements.length === 0) {
      setSaveStatus("No travel agreements to download. Explore destinations to create one!");
      setTimeout(() => setSaveStatus(""), 3500);
      return;
    }
    try {
      const firstAgreement = savedAgreements[0];
      const plan = buildPlanFromAgreement(firstAgreement, profile.country);
      printOfflinePass(plan, {
        travelerType: profile.country.toLowerCase() === "india" ? "indian" : "foreign",
        foreignCountry: profile.country.toLowerCase() !== "india" ? profile.country : undefined,
        generatedDate: `${firstAgreement.date} · ${firstAgreement.time}`,
      });
      setSaveStatus(`Downloading PDF travel pass for ${firstAgreement.cityName || firstAgreement.dest}...`);
      setTimeout(() => setSaveStatus(""), 4000);
    } catch (err) {
      console.error("Download offline PDF failed:", err);
    }
  };

  const copyCertId = (tx: string) => {
    navigator.clipboard.writeText(tx);
    setCopiedCertId(tx);
    setTimeout(() => setCopiedCertId(null), 2000);
  };

  const copyProgramId = () => {
    navigator.clipboard.writeText("A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN");
    setCopiedProgramId(true);
    setTimeout(() => setCopiedProgramId(false), 2000);
  };

  return (
    <div className="account-page-root">
      {/* ── Top Architectural Navigation ── */}
      <header className="navbar" role="banner">
        <div className="nav-container">
          <div className="nav-editorial-left">
            <Link href="/" className="nav-editorial-brand" aria-label="YatraSetu Home">
              <span className="brand-word-en">Yatra</span>
              <span className="brand-word-hi">Setu</span>
            </Link>
          </div>

          <div className="nav-editorial-right">
            <Link href="/" className="nav-editorial-link">
              <ArrowLeft size={13} style={{ marginRight: 4 }} />
              RETURN TO SITE
            </Link>
            <div className="nav-editorial-link active">ACCOUNT DETAILS</div>
          </div>
        </div>

        {/* Signature Architectural Curved Bottom Edge (3D Sculpted Arch) */}
        <div className="nav-curve-wrapper" aria-hidden="true">
          <svg
            className="nav-curve-svg"
            viewBox="0 0 1440 32"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 3D Convex Volume Gradient Shading */}
              <linearGradient id="navCurve3DFillAcc" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(242, 237, 228, 0.98)" />
                <stop offset="55%" stopColor="rgba(238, 231, 220, 0.98)" />
                <stop offset="85%" stopColor="rgba(228, 218, 204, 0.98)" />
                <stop offset="100%" stopColor="rgba(216, 203, 186, 0.98)" />
              </linearGradient>

              {/* 3D Beveled Rim Stroke Gradient */}
              <linearGradient id="navCurve3DRimAcc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(173, 137, 88, 0.30)" />
                <stop offset="25%" stopColor="rgba(101, 39, 51, 0.45)" />
                <stop offset="50%" stopColor="rgba(101, 39, 51, 0.75)" />
                <stop offset="75%" stopColor="rgba(101, 39, 51, 0.45)" />
                <stop offset="100%" stopColor="rgba(173, 137, 88, 0.30)" />
              </linearGradient>

              {/* Subtle Contact Blur Filter for 3D Ambient Crevice */}
              <filter id="navCurveContactBlurAcc" x="-10%" y="-20%" width="120%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Main 3D Volumetric Fill with Cylindrical Falloff */}
            <path
              d="M0 0 L1440 0 L1440 1.5 C1060 29.5 380 29.5 0 1.5 Z"
              fill="url(#navCurve3DFillAcc)"
            />

            {/* 3D Ambient Contact Shadow right beneath the rim */}
            <path
              d="M0 3 C380 31 1060 31 1440 3"
              stroke="rgba(30, 51, 49, 0.28)"
              strokeWidth="3.5"
              fill="none"
              filter="url(#navCurveContactBlurAcc)"
              opacity="0.65"
            />

            {/* Deep Architectural Underside Crevice Line */}
            <path
              d="M0 2.2 C380 30.2 1060 30.2 1440 2.2"
              stroke="rgba(101, 39, 51, 0.35)"
              strokeWidth="1.8"
              fill="none"
            />

            {/* Core 3D Beveled Rim Lip */}
            <path
              d="M0 1.2 C380 29.2 1060 29.2 1440 1.2"
              stroke="url(#navCurve3DRimAcc)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Top Specular Edge Highlight catching illumination */}
            <path
              d="M0 0.5 C380 28.5 1060 28.5 1440 0.5"
              stroke="rgba(255, 255, 255, 0.88)"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="account-main-content">
        {/* Header Bar matching Reference Image 3 */}
        <div className="account-details-header scroll-reveal">
          <div className="account-details-title-row">
            <h1 className="account-details-title">Account Details</h1>
          </div>

          {/* Action buttons on the right side of header (matching Image 3) */}
          <div className="account-header-actions">
            <button
              type="button"
              className="account-btn-look-around"
              onClick={() => setShowTourModal(true)}
            >
              <Sparkles size={16} className="sparkle-icon-pink" />
              <span>Take a look around</span>
            </button>

            <button
              type="button"
              className="account-btn-invite"
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus size={15} />
              <span>Invite user</span>
            </button>

            <Link href="/" className="account-btn-create">
              <Plus size={16} />
              <span>Create</span>
            </Link>

            <div className="account-brand-mark" title="YatraSetu Travel Attestation">
              <span className="brand-mark-text">YS</span>
            </div>
          </div>
        </div>

        {/* ── 2-Column Responsive Dashboard Layout ── */}
        <div className="account-dashboard-columns">
          {/* Column 1: Account Profile Form (matching Reference Image 3) */}
          <div className="account-column-profile scroll-reveal-left">
            <div className="account-card-frame">
              {/* Avatar Upload / Remove Row */}
              <div className="account-avatar-section">
                <div className="avatar-preview-wrapper">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt="Account Avatar"
                      className="avatar-image-circle"
                    />
                  ) : (
                    <div className="avatar-placeholder-circle">
                      <span className="avatar-initials">
                        {profile.name
                          ? profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : "YS"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="avatar-actions-col">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="account-btn-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Upload</span>
                  </button>

                  <button
                    type="button"
                    className="account-btn-remove"
                    onClick={handleRemoveAvatar}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Form Grid matching Reference Image 3 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="account-form-grid"
              >
                {/* Row 1: Name and Language */}
                <div className="account-field-group">
                  <label className="account-field-label" htmlFor="account-name">
                    Name
                  </label>
                  <input
                    id="account-name"
                    name="name"
                    type="text"
                    className="account-field-input"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="Can Saas"
                  />
                </div>

                <div className="account-field-group">
                  <label className="account-field-label" htmlFor="account-language">
                    Language
                  </label>
                  <div className="account-select-wrapper">
                    <select
                      id="account-language"
                      name="language"
                      className="account-field-select"
                      value={profile.language}
                      onChange={handleInputChange}
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.name}>
                          {l.name} ({l.nativeName})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>

                {/* Row 2: Date Format, Time Format, and Country */}
                <div className="account-field-group-row">
                  <div className="account-field-subgroup">
                    <label className="account-field-label" htmlFor="account-date-format">
                      Date Format
                    </label>
                    <div className="account-select-wrapper">
                      <select
                        id="account-date-format"
                        name="dateFormat"
                        className="account-field-select"
                        value={profile.dateFormat}
                        onChange={handleInputChange}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                      <ChevronDown size={14} className="select-chevron" />
                    </div>
                  </div>

                  <div className="account-field-subgroup">
                    <label className="account-field-label" htmlFor="account-time-format">
                      Time Format
                    </label>
                    <div className="account-select-wrapper">
                      <select
                        id="account-time-format"
                        name="timeFormat"
                        className="account-field-select"
                        value={profile.timeFormat}
                        onChange={handleInputChange}
                      >
                        <option value="24h">24h</option>
                        <option value="12h">12h</option>
                      </select>
                      <ChevronDown size={14} className="select-chevron" />
                    </div>
                  </div>
                </div>

                <div className="account-field-group">
                  <label className="account-field-label" htmlFor="account-country">
                    Country
                  </label>
                  <div className="account-select-wrapper">
                    <select
                      id="account-country"
                      name="country"
                      className="account-field-select"
                      value={profile.country}
                      onChange={handleInputChange}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>

                {/* Row 3: Time Zone with Live Current Time & Welcome Message */}
                <div className="account-field-group">
                  <div className="field-label-with-time">
                    <label className="account-field-label" htmlFor="account-time-zone">
                      Time Zone
                    </label>
                    <span className="live-current-time-text">
                      Current Time: {currentTimeStr || "22:37"}
                    </span>
                  </div>
                  <div className="account-select-wrapper">
                    <select
                      id="account-time-zone"
                      name="timeZone"
                      className="account-field-select"
                      value={profile.timeZone}
                      onChange={handleInputChange}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.label} value={tz.label}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>

                <div className="account-field-group">
                  <label className="account-field-label" htmlFor="account-welcome-msg">
                    Welcome Message
                  </label>
                  <textarea
                    id="account-welcome-msg"
                    name="welcomeMessage"
                    rows={2}
                    className="account-field-textarea"
                    value={profile.welcomeMessage}
                    onChange={handleInputChange}
                    placeholder="Welcome to my scheduling page. Please follow the instruction to add an event calendar"
                  />
                </div>

                {/* Notification / Toast Message */}
                {saveStatus && (
                  <div className="account-toast-msg" role="status" aria-live="polite">
                    <Check size={14} />
                    <span>{saveStatus}</span>
                  </div>
                )}

                {/* Bottom Button Row matching Reference Image 3 */}
                <div className="account-form-bottom-row">
                  <div className="bottom-left-actions">
                    <button
                      type="submit"
                      className="account-btn-save-change"
                    >
                      Save Change
                    </button>
                    <button
                      type="button"
                      className="account-btn-cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="bottom-right-actions">
                    <button
                      type="button"
                      className="account-btn-delete-account"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Column 2: Certified Travel Agreements & Assigned Agents (SEPARATE COLUMN) */}
          <div className="account-column-agreements scroll-reveal-right">
            <div className="account-agreements-card">
              <div className="agreements-card-header">
                <div className="agreements-title-wrap">
                  <div className="agreements-lock-badge">
                    <Lock size={17} color="var(--color-ottone, #AD8958)" />
                  </div>
                  <div>
                    <h2 className="agreements-column-title">Travel Agreements &amp; Assigned Agents</h2>
                    <p className="agreements-column-sub">
                      Certified travel agreements authenticated by Solana AI Concierges with tamper-proof price protection.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {savedAgreements.length > 0 && (
                    <button
                      type="button"
                      className="btn-save-all-offline"
                      onClick={handleDownloadAllOffline}
                      title="Download PDF travel passes for certified agreements"
                    >
                      <Download size={13} />
                      <span>Download All in PDF</span>
                    </button>
                  )}
                  <span className="agreements-active-badge">
                    {savedAgreements.length} Certified
                  </span>
                </div>
              </div>

              {savedAgreements.length === 0 ? (
                <div className="agreements-empty-state">
                  <ShieldCheck size={38} color="var(--color-ottone, #AD8958)" style={{ margin: "0 auto 12px auto" }} />
                  <h4 style={{ fontFamily: "var(--font-mollie)", fontSize: "1.15rem", margin: "0 0 6px 0" }}>No Travel Agreements Locked</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-oliva)", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                    Select any destination on YatraSetu to authenticate an itinerary with verified local concierges and lock guaranteed fair prices.
                  </p>
                  <Link
                    href="/"
                    className="account-btn-save-change"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      textDecoration: "none",
                      padding: "8px 20px",
                      fontSize: "0.86rem",
                    }}
                  >
                    <Compass size={14} />
                    <span>Explore Destinations</span>
                  </Link>
                </div>
              ) : (
                <div className="agreements-list stagger-children">
                  {savedAgreements.map((agreement) => (
                    <div key={agreement.id} className="agreement-record-card">
                      {/* Top Header of Record */}
                      <div className="agreement-card-top">
                        <div className="agreement-dest-badge-col">
                          <span className="agreement-city-pill">{agreement.cityName || "India Destination"}</span>
                          <h3 className="agreement-record-title">{agreement.dest}</h3>
                        </div>
                        <div className="agreement-status-chip">
                          <span className="pulsing-green-dot" />
                          <span>Price Locked</span>
                        </div>
                      </div>

                      {/* Assigned Concierge Agent Box */}
                      <div className="agreement-agent-container">
                        <div className="agreement-agent-avatar-circle">
                          <span>{agreement.agentName ? agreement.agentName.slice(0, 2).toUpperCase() : "YS"}</span>
                        </div>
                        <div className="agreement-agent-details">
                          <div className="agreement-agent-line-1">
                            <span className="agreement-agent-display-name">{agreement.agentName}</span>
                            <span className="agreement-seal-badge">
                              <ShieldCheck size={11} />
                              ★ {agreement.agentTrustScore || 99.4}% SEAL
                            </span>
                            <span className="agreement-rating-pill">
                              ★ {agreement.agentRating || getAgentRating(agreement.agentName)} / 10
                            </span>
                          </div>
                          <div className="agreement-agent-line-2">
                            <span>{agreement.agentRole || "Heritage Itineraries & Price Protection"}</span>
                          </div>
                          <div className="agreement-agent-line-3">
                            <span className="pda-label">Identity PDA:</span>
                            <code className="pda-val">
                              {agreement.agentPda ? `${agreement.agentPda.slice(0, 6)}...${agreement.agentPda.slice(-4)}` : "1xEX...FeBP"}
                            </code>
                            <span className="pda-devnet-tag">Devnet</span>
                          </div>
                        </div>
                      </div>

                      {/* Verified Traveler Review Snippet (Feedback Preview) */}
                      {(() => {
                        const topReview = getTopAgentReview(agreement.agentName);
                        return (
                          <div className="agreement-review-snippet">
                            <div className="review-snippet-header">
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span className="review-author-rating">★ {topReview.rating.toFixed(1)} / 10</span>
                                <span className="review-author-name">{topReview.author}</span>
                                <span className="review-verified-badge">✓ Verified Review</span>
                              </div>
                              {topReview.highlightTag && (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    color: topReview.rating >= 9.0 ? "#2D5A43" : "#B45309",
                                  }}
                                >
                                  {topReview.highlightTag}
                                </span>
                              )}
                            </div>
                            <p className="review-quote-text">&ldquo;{topReview.quote}&rdquo;</p>
                          </div>
                        );
                      })()}

                      {/* Price Lock & Transit Pass Grid */}
                      <div className="agreement-guarantees-grid">
                        <div className="guarantee-box">
                          <span className="guarantee-lbl">GUARANTEED PRICE LOCK</span>
                          <span className="guarantee-val price-green">{agreement.priceLocked}</span>
                          <span className="guarantee-sub">Zero-surge fair rate cap</span>
                        </div>
                        <div className="guarantee-box">
                          <span className="guarantee-lbl">VERIFIED TRANSIT PASS</span>
                          <span className="guarantee-val">{agreement.transitPass}</span>
                          <span className="guarantee-sub">Official commuter pass</span>
                        </div>
                      </div>

                      {/* Certificate & Hash Bar */}
                      <div className="agreement-cert-bar">
                        <div className="cert-copy-group">
                          <span className="cert-label">Certificate:</span>
                          <code className="cert-code-text">{agreement.tx}</code>
                          <button
                            type="button"
                            className="btn-cert-copy"
                            onClick={() => copyCertId(agreement.tx)}
                            title="Copy Certificate ID"
                          >
                            {copiedCertId === agreement.tx ? (
                              <Check size={12} color="#2D5A43" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                        <span className="cert-datetime-text">
                          {agreement.date} · {agreement.time}
                        </span>
                      </div>

                      {/* Footer Actions */}
                      <div className="agreement-actions-bar">
                        {agreement.tx && !agreement.tx.startsWith("CERT-") ? (
                          <a
                            href={`https://explorer.solana.com/tx/${agreement.tx}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-view-explorer"
                          >
                            <ExternalLink size={12} />
                            <span>View on Solana Explorer</span>
                          </a>
                        ) : (
                          <span className="cert-verified-label">
                            <CheckCircle2 size={13} color="#2D5A43" />
                            <span>Cryptographically Verified &amp; Sealed</span>
                          </span>
                        )}

                        <div className="agreement-actions-right">
                          <button
                            type="button"
                            className="btn-agreement-feedback"
                            onClick={() =>
                              handleOpenFeedbackModal(
                                agreement.agentName,
                                agreement.agentRating || getAgentRating(agreement.agentName),
                                agreement.agentTrustScore || 99.4,
                                agreement.agentRole,
                                agreement.dest
                              )
                            }
                            title="Rate this Concierge & read verified traveler reviews"
                          >
                            <Star size={12} fill="#AD8958" />
                            <span>Feedback ({getAgentReviews(agreement.agentName).length})</span>
                          </button>

                          <button
                            type="button"
                            className={`btn-offline-save ${downloadedAgreementId === agreement.id ? "downloaded" : ""}`}
                            onClick={() => handleDownloadOfflineAgreement(agreement)}
                            title="Download verified travel pass directly in PDF"
                          >
                            {downloadedAgreementId === agreement.id ? (
                              <>
                                <Check size={13} color="#2D5A43" />
                                <span>PDF Ready!</span>
                              </>
                            ) : (
                              <>
                                <Download size={13} />
                                <span>Download PDF</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            className="btn-remove-agreement"
                            onClick={() => handleDeleteAgreement(agreement.id)}
                            title="Remove this agreement"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FULL-WIDTH HORIZONTAL SECTION: AI Concierge Agents Used & Assigned ── */}
        <div className="account-agents-card account-agents-card--horizontal scroll-reveal">
          <div className="account-agents-card-header">
            <div className="agreements-title-wrap">
              <div className="agreements-lock-badge" style={{ background: "rgba(37, 99, 235, 0.08)", borderColor: "rgba(37, 99, 235, 0.25)" }}>
                <Bot size={18} color="#2563eb" />
              </div>
              <div>
                <h2 className="agreements-column-title">Real AI Agents on Solana Devnet</h2>
                <p className="agreements-column-sub">
                  Authentic on-chain concierges discovered from the Solana Devnet Agent Registry with verified PDAs &amp; SEAL trust scores.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {refreshAgentsNotice && (
                <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700, background: "rgba(16, 185, 129, 0.1)", padding: "3px 8px", borderRadius: 8 }}>
                  ✓ {refreshAgentsNotice}
                </span>
              )}
              <button
                type="button"
                onClick={handleRefreshAgents}
                disabled={refreshingAgents}
                className="btn-refresh-agents"
                title="Fetch latest verified AI agents from Solana Devnet Registry"
              >
                <RefreshCw size={13} className={refreshingAgents ? "spin-clockwise" : ""} />
                <span>{refreshingAgents ? "Refreshing..." : "Refresh AI Agents"}</span>
              </button>
              <span className="agreements-active-badge" style={{ background: "rgba(37, 99, 235, 0.1)", color: "#1d4ed8", borderColor: "rgba(37, 99, 235, 0.25)" }}>
                {agentsList.length} Concierges
              </span>
            </div>
          </div>

          <div className="agents-used-list agents-used-list--horizontal stagger-children">
            {agentsList.map((agent) => {
              const isActive = activeAgentId === agent.id || activeAgentId === agent.name;
              return (
                <div
                  key={agent.id}
                  className={`agent-used-item-card ${isActive ? "is-active" : ""}`}
                >
                  <div className="agent-item-header">
                    <div className="agent-item-avatar-row">
                      <div className="agent-item-avatar">
                        <span>{agent.shortName.slice(0, 2).toUpperCase()}</span>
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: isActive ? "#10B981" : "#9CA3AF",
                            border: "1.5px solid #FFFFFF",
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span className="agent-item-name">{agent.name}</span>
                          {isActive && (
                            <span style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#2D5A43",
                              background: "rgba(45, 90, 67, 0.12)",
                              padding: "2px 7px",
                              borderRadius: 10,
                            }}>
                              Active Assigned
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.74rem", color: "var(--color-oliva)" }}>
                          {agent.role}
                        </span>
                      </div>
                    </div>

                    <span className="agreement-seal-badge">
                      <ShieldCheck size={11} />
                      ★ {agent.trustScore}% SEAL
                    </span>
                  </div>

                  <p className="agent-item-role">
                    {agent.specialty}
                  </p>

                  <div className="agent-item-meta-row">
                    <span><strong>Trips Verified:</strong> {agent.tripsVerified.toLocaleString()}</span>
                    <span>•</span>
                    <span><strong>Score:</strong> {agent.rating} / 10</span>
                    <span>•</span>
                    <span><strong>Recent:</strong> {agent.lastUsedItinerary}</span>
                  </div>

                  {/* Top Traveler Review Snippet for Agent */}
                  {(() => {
                    const topRev = getTopAgentReview(agent.name);
                    return (
                      <div className="agreement-review-snippet" style={{ margin: "8px 0", background: "rgba(255, 255, 255, 0.95)" }}>
                        <div className="review-snippet-header">
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span className="review-author-rating">★ {topRev.rating.toFixed(1)} / 10</span>
                            <span className="review-author-name">{topRev.author}</span>
                          </div>
                          {topRev.highlightTag && (
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                color: topRev.rating >= 9.0 ? "#2D5A43" : "#B45309",
                              }}
                            >
                              {topRev.highlightTag}
                            </span>
                          )}
                        </div>
                        <p className="review-quote-text">&ldquo;{topRev.quote}&rdquo;</p>
                      </div>
                    );
                  })()}

                  <div className="agent-item-actions-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem" }}>
                      <span className="pda-label">Identity PDA:</span>
                      <code className="pda-val">
                        {`${agent.identityPda.slice(0, 6)}...${agent.identityPda.slice(-4)}`}
                      </code>
                      <button
                        type="button"
                        className="btn-cert-copy"
                        onClick={() => copyCertId(agent.identityPda)}
                        title="Copy Agent Identity PDA"
                      >
                        {copiedCertId === agent.identityPda ? (
                          <Check size={11} color="#2D5A43" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                      <a
                        href={`https://explorer.solana.com/address/${agent.mintAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-explorer"
                        style={{ marginLeft: 4 }}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        className="btn-agreement-feedback"
                        style={{ padding: "5px 12px", fontSize: "0.72rem" }}
                        onClick={() =>
                          handleOpenFeedbackModal(
                            agent.name,
                            agent.rating,
                            agent.trustScore,
                            agent.role,
                            agent.lastUsedItinerary
                          )
                        }
                        title="Read & Submit Traveler Reviews"
                      >
                        <MessageSquare size={11} />
                        <span>Reviews ({getAgentReviews(agent.name).length})</span>
                      </button>

                      <button
                        type="button"
                        className={`btn-set-active-agent ${isActive ? "active" : ""}`}
                        onClick={() => handleSetActiveAgent(agent)}
                      >
                        {isActive ? (
                          <>
                            <Check size={12} />
                            <span>Active Concierge</span>
                          </>
                        ) : (
                          <span>Set as Active</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Seamless Web3 & Solana Devnet Hub Integration ── */}
        <div className="account-web3-section scroll-reveal">
          <div className="web3-hub-card scroll-reveal-scale">
            <div className="web3-hub-header">
              <div className="web3-hub-title-col">
                <span className="web3-eyebrow">SOLANA DEVNET HUB · DECENTRALIZED IDENTITY</span>
                <h3 className="web3-title">Phantom &amp; Web3 Wallet Connection</h3>
                <p className="web3-sub">
                  Connect your Solana Devnet wallet to sign tamper-proof cultural travel itineraries and inspect on-chain tourist protection agreements.
                </p>
              </div>
              <div className="web3-wallet-button-col">
                <WalletMultiButton />
              </div>
            </div>

            <div className="web3-cluster-bar">
              <div className="cluster-stat">
                <span className="cluster-label">CLUSTER STATUS</span>
                <span className="cluster-val green">
                  <span className="pulsing-green-dot" />
                  Devnet Healthy (400ms)
                </span>
              </div>

              <div className="cluster-stat">
                <span className="cluster-label">RPC ENDPOINT</span>
                <span className="cluster-val font-mono">api.devnet.solana.com</span>
              </div>

              <div className="cluster-stat">
                <span className="cluster-label">COMMITMENT</span>
                <span className="cluster-val font-mono">confirmed</span>
              </div>

              <div className="cluster-stat">
                <span className="cluster-label">TOURISM PROGRAM ID</span>
                <div className="program-id-copy-row">
                  <span className="cluster-val font-mono">A7yU8i...VSzN</span>
                  <button
                    type="button"
                    className="btn-cluster-copy"
                    onClick={copyProgramId}
                    title="Copy Program ID"
                  >
                    {copiedProgramId ? <Check size={12} color="#2D5A43" /> : <Copy size={12} />}
                  </button>
                  <a
                    href="https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cluster-link"
                    title="View on Solana Explorer"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Signature Architectural Pre-Footer Matching Main Site ── */}
      <section className="editorial-prefooter scroll-reveal" style={{ borderBottom: "1px solid rgba(101, 39, 51, 0.18)" }}>
        {/* Top Wave Transition */}
        <div className="editorial-prefooter__curve-wrap" aria-hidden="true">
          <svg
            className="editorial-prefooter__curve-svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,0 C360,50 1080,50 1440,0 L1440,80 L0,80 Z"
              fill="var(--color-sabbia)"
            />
          </svg>
        </div>

        <div className="editorial-prefooter__inner">
          {/* Left: Large Editorial Statement & Quick Links */}
          <div className="editorial-prefooter__left scroll-reveal-left">
            <h2 className="editorial-prefooter__title">India, thoughtfully yours.</h2>
            <Link href="/" className="editorial-prefooter__plan-link">
              <span>EXPLORE ITINERARIES</span>
              <span className="editorial-plan-arrow">→</span>
            </Link>

            <div className="editorial-prefooter__cols">
              {/* Column 1: PLATFORM */}
              <div className="editorial-nav-col">
                <span className="editorial-col-heading">PLATFORM</span>
                <ul className="editorial-col-list">
                  <li>
                    <Link href="/" className="editorial-link-btn">
                      Itinerary Planner
                    </Link>
                  </li>
                  <li>
                    <Link href="/?tab=fairPrice" className="editorial-link-btn">
                      Fair Price Checker
                    </Link>
                  </li>
                  <li>
                    <Link href="/?tab=safety" className="editorial-link-btn">
                      Tourist Shield
                    </Link>
                  </li>
                  <li>
                    <Link href="/?tab=agents" className="editorial-link-btn">
                      Solana Concierges
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: ACCOUNT */}
              <div className="editorial-nav-col">
                <span className="editorial-col-heading">ACCOUNT HUB</span>
                <ul className="editorial-col-list">
                  <li>
                    <span className="editorial-link-btn active">
                      Personal Preferences
                    </span>
                  </li>
                  <li>
                    <span className="editorial-link-btn active">
                      Travel Agreements ({savedAgreements.length})
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="editorial-link-btn"
                      onClick={handleDownloadAllOffline}
                    >
                      Offline Remote Passes
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: CONCIERGES */}
              <div className="editorial-nav-col">
                <span className="editorial-col-heading">CONCIERGES</span>
                <ul className="editorial-col-list">
                  <li>
                    <span className="editorial-link-btn">
                      Arjun · Heritage Guide
                    </span>
                  </li>
                  <li>
                    <span className="editorial-link-btn">
                      Touristमित्र · Municipal
                    </span>
                  </li>
                  <li>
                    <span className="editorial-link-btn">
                      Kavya · Safe Transit
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Signature Architectural Line-Art (Pure Artwork with Matching Site Background) */}
          <div className="editorial-prefooter__right scroll-reveal-right" aria-hidden="true">
            <img
              src="/images/art/taj-mahal.png"
              alt="Taj Mahal Architectural Artwork"
              className="editorial-prefooter__art"
            />
          </div>
        </div>
      </section>

      {/* ── Minimal Editorial Footer Bar ── */}
      <footer className="minimal-editorial-footer" role="contentinfo">
        <div className="footer-single-bar-container">
          <div className="footer-status-pill">
            <span className="status-dot-live" />
            <span className="status-label">Now in India</span>
            <span className="status-time">[{currentTimeStr || "Live IST"}]</span>
          </div>
          <div className="footer-copy-text">
            Shubh Yatra (शुभ यात्रा) © 2026 YatraSetu · Certified on Solana Devnet · All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── Invite User Modal ── */}
      {showInviteModal && (
        <div className="account-modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="account-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title">Invite Travel Companion</h3>
            <p className="dialog-sub">
              Invite a fellow traveler or family member to co-manage itineraries and transit pass attestations.
            </p>
            <div style={{ margin: "18px 0" }}>
              <label className="account-field-label">Companion Email Address</label>
              <input
                type="email"
                className="account-field-input"
                placeholder="companion@example.com"
                autoFocus
              />
            </div>
            <div className="dialog-actions-row">
              <button
                type="button"
                className="account-btn-save-change"
                onClick={() => {
                  setShowInviteModal(false);
                  setSaveStatus("Invitation sent successfully!");
                  setTimeout(() => setSaveStatus(""), 3000);
                }}
              >
                Send Invite
              </button>
              <button
                type="button"
                className="account-btn-cancel"
                onClick={() => setShowInviteModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tour Modal ── */}
      {showTourModal && (
        <div className="account-modal-backdrop" onClick={() => setShowTourModal(false)}>
          <div className="account-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title">Welcome to YatraSetu Account Hub</h3>
            <p className="dialog-sub">
              Here you can configure your personalized travel preferences, inspect verified travel agreements authenticated by Solana concierges, view your connected Solana Devnet identity, and sync offline itineraries.
            </p>
            <div style={{ margin: "16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Custom time format (24h/12h) &amp; live time zone sync</span>
              </div>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Multi-lingual support across 11 Indian and global languages</span>
              </div>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Tamper-proof travel agreements with assigned Solana Concierge agents</span>
              </div>
              <div className="tour-feature-item">
                <Check size={16} color="#652733" />
                <span>Decentralized Web3 wallet attestation on Solana Devnet</span>
              </div>
            </div>
            <div className="dialog-actions-row">
              <button
                type="button"
                className="account-btn-save-change"
                onClick={() => setShowTourModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ── AI Concierge Feedback & Traveler Reviews Modal ── */}
      <AgentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        agentName={feedbackModalData.agentName}
        agentRating={feedbackModalData.agentRating}
        agentTrustScore={feedbackModalData.agentTrustScore}
        agentRole={feedbackModalData.agentRole}
        itineraryTitle={feedbackModalData.itineraryTitle}
      />

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="account-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="account-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title" style={{ color: "#991B1B" }}>
              Delete Account &amp; Wipe All Data?
            </h3>
            <p className="dialog-sub">
              This will permanently delete your personal profile, all certified travel agreements ({savedAgreements.length}), assigned concierges, custom reviews, and offline passes. Once deleted and refreshed, all saved and clicked items will remain completely cleared.
            </p>
            <div className="dialog-actions-row" style={{ marginTop: 24 }}>
              <button
                type="button"
                className="account-btn-delete-account"
                onClick={handleDeleteAccount}
              >
                Confirm Delete Everything
              </button>
              <button
                type="button"
                className="account-btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
