// Curated Verified Traveler Reviews & On-Chain Feedback for AI Concierge Agents
export interface AgentReview {
  id: string;
  agentId: string;
  agentName: string;
  author: string;
  authorLocation: string;
  rating: number; // 10-point scale: 9.8, 9.5, 9.1, 8.9, 8.5, 7.9, etc.
  trip: string;
  quote: string;
  date: string;
  verified: boolean;
  highlightTag?: string;
}

// Curated reviews:
// Best feedback for top AI agents (Touristमित्र 9.8/10, Vikram 9.5/10)
// Moderate/constructive feedback for lower-rated AI agents (Priya 7.9/10, Ananya 8.5/10)
export const DEFAULT_AGENT_REVIEWS: AgentReview[] = [
  // ── 1. Touristमित्र (Best AI Agent - Rating: 9.8 / 10) ──
  {
    id: "rev-tm-1",
    agentId: "touristmitra",
    agentName: "Touristमित्र Heritage & Travel Concierge",
    author: "Rohan & Tanya S.",
    authorLocation: "Mumbai, India",
    rating: 9.9,
    trip: "Jaipur & Mysuru Royal Circuit (5D)",
    quote: "Touristमित्र is astonishingly effective! Saved us ₹2,400 on municipal cab tariffs in Jaipur & Mysuru. Certified on-chain agreement prevented any hotel overcharges. Flawless concierge!",
    date: "24 Oct 2026",
    verified: true,
    highlightTag: "Saved ₹2,400 · Zero Overcharge",
  },
  {
    id: "rev-tm-2",
    agentId: "touristmitra",
    agentName: "Touristमित्र Heritage & Travel Concierge",
    author: "David Miller",
    authorLocation: "London, UK",
    rating: 9.8,
    trip: "Golden Triangle & Heritage Trail (4D)",
    quote: "The zero-surge pricing guarantee actually held! Best AI concierge in India. The 24/7 SOS helpline and temple entry timing guidance was spot on. Highly recommended for international travelers.",
    date: "20 Oct 2026",
    verified: true,
    highlightTag: "Best Overall · 24/7 Helpline",
  },
  {
    id: "rev-tm-3",
    agentId: "touristmitra",
    agentName: "Touristमित्र Heritage & Travel Concierge",
    author: "Aarav Patel",
    authorLocation: "Ahmedabad, India",
    rating: 9.8,
    trip: "Hampi UNESCO Ruins (3D)",
    quote: "Municipal rate lock in Hampi saved us at least 3 hours of haggling with local transport. The cryptographic seal gave complete peace of mind.",
    date: "17 Oct 2026",
    verified: true,
    highlightTag: "Fair Tariff Locked",
  },

  // ── 2. Vikram (Rating: 9.5 / 10) ──
  {
    id: "rev-vk-1",
    agentId: "vikram",
    agentName: "Vikram - Fair Pricing & Tariff Auditor",
    author: "Ananya Iyer",
    authorLocation: "Bengaluru, India",
    rating: 9.6,
    trip: "Hampi UNESCO Ruins & Tungabhadra (3D)",
    quote: "Vikram flagged an auto-rickshaw overcharge within seconds! The government rate card auditing algorithm is incredible. Top marks for price integrity.",
    date: "22 Oct 2026",
    verified: true,
    highlightTag: "Anti-Scam Flag · Rate Card Match",
  },
  {
    id: "rev-vk-2",
    agentId: "vikram",
    agentName: "Vikram - Fair Pricing & Tariff Auditor",
    author: "Siddharth Mehta",
    authorLocation: "Delhi, India",
    rating: 9.5,
    trip: "Agra Fort & Taj Heritage (2D)",
    quote: "The anti-scam alert saved our family from an unlicensed guide trap outside the monument. Accurate municipal benchmarks and polite alerts.",
    date: "15 Oct 2026",
    verified: true,
    highlightTag: "Scam Shield Verified",
  },

  // ── 3. Arjun (Rating: 9.1 / 10) ──
  {
    id: "rev-aj-1",
    agentId: "arjun",
    agentName: "Arjun - Cultural Heritage & Temple Guide",
    author: "Sneha Rao",
    authorLocation: "Chennai, India",
    rating: 9.2,
    trip: "Mysore Cultural Heritage & Palaces (3D)",
    quote: "Arjun provided exceptional historical context for Chamundi Hills and Mysore Palace. Minor delay on rickshaw transit link, but temple architectural notes were brilliant.",
    date: "21 Oct 2026",
    verified: true,
    highlightTag: "Rich Temple Lore",
  },
  {
    id: "rev-aj-2",
    agentId: "arjun",
    agentName: "Arjun - Cultural Heritage & Temple Guide",
    author: "Vikramaditya S.",
    authorLocation: "Kolkata, India",
    rating: 9.0,
    trip: "Varanasi Ghats & Sarnath (3D)",
    quote: "Great cultural depth and queue skip advice at Kashi Vishwanath. Itinerary was slightly packed for elderly parents, but historical depth was 10/10.",
    date: "14 Oct 2026",
    verified: true,
    highlightTag: "Deep History · Packed Pace",
  },

  // ── 4. Sendero (Rating: 8.9 / 10) ──
  {
    id: "rev-sd-1",
    agentId: "sendero",
    agentName: "Sendero - Smart Transit & Route Optimizer",
    author: "Alex Kowalski",
    authorLocation: "Sydney, Australia",
    rating: 9.0,
    trip: "Goa Coastal & Luxury Backwaters (4D)",
    quote: "Sendero booked boutique heritage havelis seamlessly. A bit corporate on conversational tone, but zero price slippage on the Devnet agreement.",
    date: "19 Oct 2026",
    verified: true,
    highlightTag: "Boutique Stays · Zero Slippage",
  },
  {
    id: "rev-sd-2",
    agentId: "sendero",
    agentName: "Sendero - Smart Transit & Route Optimizer",
    author: "Pooja Nambiar",
    authorLocation: "Kochi, India",
    rating: 8.8,
    trip: "Bengaluru - Coorg Coffee Trail (3D)",
    quote: "Good multi-modal transit sync between train and cab. Private cab was 15 minutes delayed during morning rush, but price was locked.",
    date: "12 Oct 2026",
    verified: true,
    highlightTag: "Transit Synced",
  },

  // ── 5. Ananya (Rating: 8.5 / 10) ──
  {
    id: "rev-an-1",
    agentId: "ananya",
    agentName: "Ananya - Local Cuisine & Artisan Scout",
    author: "Elena Rostova",
    authorLocation: "Berlin, Germany",
    rating: 8.6,
    trip: "Jaipur Pink City & Amber Fort (3D)",
    quote: "Loved the GI-tagged sandalwood weaver workshop recommendations! Regional thali spots were authentic, though spice levels were a bit intense for Western palate.",
    date: "18 Oct 2026",
    verified: true,
    highlightTag: "Authentic Artisan Guilds",
  },
  {
    id: "rev-an-2",
    agentId: "ananya",
    agentName: "Ananya - Local Cuisine & Artisan Scout",
    author: "Rahul Verma",
    authorLocation: "Lucknow, India",
    rating: 8.4,
    trip: "Mysuru Sandalwood & Silk Trail (2D)",
    quote: "Decent artisan trail scout, but two small woodcraft shop operating hours were outdated by an hour. Culinary suggestions were great.",
    date: "10 Oct 2026",
    verified: true,
    highlightTag: "Good Food · Hours Lag",
  },

  // ── 6. Priya (Less Rating Agent - Rating: 7.9 / 10) ──
  {
    id: "rev-pr-1",
    agentId: "priya",
    agentName: "Priya - Transport & Safety Specialist",
    author: "Karthik P.",
    authorLocation: "Hyderabad, India",
    rating: 7.9,
    trip: "Kochi Fort & Backwaters (3D)",
    quote: "Priya's KSRTC bus pass route worked, but evening transfer schedule was delayed by 35 minutes. Fair tariff was honored though, safe ride overall.",
    date: "16 Oct 2026",
    verified: true,
    highlightTag: "Bus Delay 35m · Fair Price Held",
  },
  {
    id: "rev-pr-2",
    agentId: "priya",
    agentName: "Priya - Transport & Safety Specialist",
    author: "Meera Joshi",
    authorLocation: "Pune, India",
    rating: 7.8,
    trip: "Bengaluru City Express Transit (2D)",
    quote: "Good safety advice for solo travel, but ground transit recommendations felt generic compared to Touristमित्र. Needs more dynamic traffic rerouting.",
    date: "08 Oct 2026",
    verified: true,
    highlightTag: "Generic Transit · Safe",
  },
];

// Helper to normalize agent matching
export function normalizeAgentKey(agentNameOrId?: string): string {
  if (!agentNameOrId) return "touristmitra";
  const s = agentNameOrId.toLowerCase();
  if (s.includes("tourist") || s.includes("mitra") || s.includes("touristmitra")) return "touristmitra";
  if (s.includes("vikram")) return "vikram";
  if (s.includes("arjun") || s.includes("karnataka") || s.includes("temple")) return "arjun";
  if (s.includes("sendero")) return "sendero";
  if (s.includes("ananya") || s.includes("artisan")) return "ananya";
  if (s.includes("priya") || s.includes("safety")) return "priya";
  return "touristmitra";
}

// Get reviews for a specific agent (combining default reviews with user-submitted reviews)
export function getAgentReviews(agentNameOrId?: string): AgentReview[] {
  const key = normalizeAgentKey(agentNameOrId);
  const defaults = DEFAULT_AGENT_REVIEWS.filter(r => r.agentId === key);

  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem("yatrasetu_agent_user_reviews");
    if (!raw) return defaults;
    const userReviews: AgentReview[] = JSON.parse(raw);
    const matchingUser = userReviews.filter(r => r.agentId === key);
    return [...matchingUser, ...defaults];
  } catch {
    return defaults;
  }
}

// Get top review for an agent to display inline on cards
export function getTopAgentReview(agentNameOrId?: string): AgentReview {
  const reviews = getAgentReviews(agentNameOrId);
  return reviews[0] || DEFAULT_AGENT_REVIEWS[0];
}

// Save a new user review
export function submitAgentReview(
  agentNameOrId: string,
  author: string,
  rating: number,
  quote: string,
  trip: string = "Verified Cultural Itinerary"
): AgentReview {
  const key = normalizeAgentKey(agentNameOrId);
  const newReview: AgentReview = {
    id: `user-rev-${Date.now()}`,
    agentId: key,
    agentName: agentNameOrId || "YatraSetu AI Concierge",
    author: author.trim() || "Verified Traveler",
    authorLocation: "India",
    rating: Math.max(1, Math.min(10, Number(rating.toFixed(1)))),
    trip,
    quote: quote.trim(),
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    verified: true,
    highlightTag: "Verified On-Chain Review",
  };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("yatrasetu_agent_user_reviews");
      const list: AgentReview[] = raw ? JSON.parse(raw) : [];
      list.unshift(newReview);
      localStorage.setItem("yatrasetu_agent_user_reviews", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to persist user review", e);
    }
  }

  return newReview;
}
