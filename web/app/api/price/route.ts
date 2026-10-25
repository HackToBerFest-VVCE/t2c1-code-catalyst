import { NextResponse } from "next/server";

// ─── Static reference price data ───────────────────────────────────────────
// Based on published travel guides, tourism department pages, and community
// travel reports. These are reference benchmarks — not live prices.
// Source: India Tourism, Lonely Planet, travel blogs (2024-2025 estimates)

type PriceRef = {
  minINR: number;
  maxINR: number;
  source: string;
  notes: string;
};

const PRICE_DB: Record<string, Record<string, PriceRef>> = {
  "Auto-rickshaw": {
    default: { minINR: 20, maxINR: 30, source: "Karnataka meter rates", notes: "Per km, metered rate" },
    mysuru: { minINR: 20, maxINR: 400, source: "Mysuru travel reports 2024", notes: "Short hop ₹20–80; airport run ₹250–400" },
    bengaluru: { minINR: 25, maxINR: 600, source: "BBMP meter rate 2024", notes: "Minimum ₹25; meter thereafter" },
    delhi: { minINR: 25, maxINR: 500, source: "Delhi auto rates 2024", notes: "Metered; typical city trip ₹80–200" },
    mumbai: { minINR: 21, maxINR: 400, source: "Mumbai auto meter rate 2024", notes: "₹21 flag fall; per km ~₹14.51" },
    goa: { minINR: 50, maxINR: 600, source: "Goa tourism board 2024", notes: "No meter; negotiate fixed rate" },
    jaipur: { minINR: 20, maxINR: 350, source: "Jaipur auto fares 2024", notes: "Negotiable; use app for fair rate" },
  },
  "Taxi / Cab": {
    default: { minINR: 10, maxINR: 20, source: "Ola/Uber per-km range", notes: "Per km; surge pricing may apply" },
    mysuru: { minINR: 300, maxINR: 1800, source: "Mysuru taxi estimates 2024", notes: "City trips ₹300–600; full day ₹1200–1800" },
    bengaluru: { minINR: 100, maxINR: 2000, source: "Ola/Uber Bengaluru 2024", notes: "Airport: ₹600–1000; city: ₹100–400" },
    delhi: { minINR: 200, maxINR: 2500, source: "Delhi cab rates 2024", notes: "Airport pre-paid ₹300–600; typical trip ₹200–600" },
    goa: { minINR: 400, maxINR: 3000, source: "Goa taxi union rates 2024", notes: "Fixed-rate; no meter" },
    jaipur: { minINR: 200, maxINR: 2000, source: "Jaipur cab estimates 2024", notes: "Full day ₹1200–1800" },
  },
  "Hotel room (budget)": {
    default: { minINR: 600, maxINR: 1800, source: "Booking.com average India 2024", notes: "Per night, budget category" },
    mysuru: { minINR: 700, maxINR: 2000, source: "Mysuru budget hotels 2024", notes: "Basic AC room near city centre" },
    bengaluru: { minINR: 800, maxINR: 2500, source: "Bengaluru budget hotels 2024", notes: "Per night budget; central areas" },
    delhi: { minINR: 800, maxINR: 3000, source: "Delhi budget hotel rates 2024", notes: "Paharganj area benchmark" },
    goa: { minINR: 1000, maxINR: 4000, source: "Goa budget stays 2024", notes: "Peak season higher" },
  },
  "Hotel room (mid-range)": {
    default: { minINR: 2000, maxINR: 6000, source: "Booking.com India mid-range 2024", notes: "Per night, 3-star category" },
    mysuru: { minINR: 2500, maxINR: 6000, source: "Mysuru 3-star hotels 2024", notes: "Breakfast may be included" },
    bengaluru: { minINR: 3000, maxINR: 8000, source: "Bengaluru 3-star 2024", notes: "City centre" },
    delhi: { minINR: 3000, maxINR: 9000, source: "Delhi 3-star hotels 2024", notes: "Connaught Place area" },
    goa: { minINR: 3000, maxINR: 12000, source: "Goa resorts 2024", notes: "Beach areas; peak season premium" },
  },
  "Restaurant meal": {
    default: { minINR: 80, maxINR: 600, source: "Zomato/Google average India 2024", notes: "Per person, single meal" },
    mysuru: { minINR: 80, maxINR: 500, source: "Mysuru dining estimates 2024", notes: "Local thali ₹80–150; restaurant ₹200–500" },
    bengaluru: { minINR: 150, maxINR: 800, source: "Bengaluru restaurant avg 2024", notes: "Mid-range restaurant per person" },
    delhi: { minINR: 100, maxINR: 1000, source: "Delhi dining avg 2024", notes: "Varies widely by area and cuisine" },
    goa: { minINR: 200, maxINR: 1500, source: "Goa restaurant estimates 2024", notes: "Seafood restaurants higher" },
  },
  "Entry ticket": {
    default: { minINR: 20, maxINR: 600, source: "ASI & state tourism boards", notes: "Varies widely by site" },
    mysuru: { minINR: 70, maxINR: 200, source: "Mysuru Palace official 2024", notes: "Palace adult ₹70; combo tickets available" },
    delhi: { minINR: 35, maxINR: 600, source: "ASI Delhi monuments 2024", notes: "Red Fort ₹35 Indian / ₹500 foreign" },
    agra: { minINR: 50, maxINR: 1300, source: "ASI Agra 2024", notes: "Taj Mahal ₹50 Indian / ₹1300 foreign" },
  },
  "Tour guide (half-day)": {
    default: { minINR: 500, maxINR: 1500, source: "India tourism guide rates 2024", notes: "Half day (3–4 hours)" },
    mysuru: { minINR: 500, maxINR: 1200, source: "Mysuru tourist guides 2024", notes: "Licensed guides; negotiate before" },
    delhi: { minINR: 800, maxINR: 2000, source: "Delhi guide rates 2024", notes: "Licensed: ₹800–1500; private may charge more" },
  },
  "Tour guide (full-day)": {
    default: { minINR: 1000, maxINR: 3000, source: "India tourism guide rates 2024", notes: "Full day (6–8 hours)" },
    mysuru: { minINR: 1000, maxINR: 2500, source: "Mysuru tourist guides 2024", notes: "Licensed full-day rates" },
    delhi: { minINR: 1500, maxINR: 4000, source: "Delhi guide rates 2024", notes: "Includes all major monuments" },
  },
  "Bicycle rental": {
    default: { minINR: 50, maxINR: 200, source: "India travel estimates 2024", notes: "Per day" },
    mysuru: { minINR: 80, maxINR: 200, source: "Mysuru cycle rental estimates", notes: "Per day; check condition before rent" },
    goa: { minINR: 100, maxINR: 300, source: "Goa bicycle rentals 2024", notes: "Per day" },
  },
  "Bus ticket": {
    default: { minINR: 10, maxINR: 500, source: "KSRTC / state bus rates 2024", notes: "Depends on distance and class" },
    mysuru: { minINR: 10, maxINR: 150, source: "KSRTC city/suburban rates", notes: "City bus ₹10–30; KSRTC outstation ₹50–150" },
  },
  "Train ticket": {
    default: { minINR: 20, maxINR: 3000, source: "Indian Railways 2024", notes: "Sleeper to AC classes; depends on route" },
    mysuru: { minINR: 60, maxINR: 800, source: "IR Mysuru routes 2024", notes: "Mysuru–Bengaluru ₹60–250 by class" },
  },
};

const USD_TO_INR = 83.5;
const EUR_TO_INR = 90.0;
const GBP_TO_INR = 106.0;

function toINR(amount: number, currency: string): number {
  if (currency === "INR") return amount;
  if (currency === "USD") return amount * USD_TO_INR;
  if (currency === "EUR") return amount * EUR_TO_INR;
  if (currency === "GBP") return amount * GBP_TO_INR;
  return amount;
}

function fromINR(amount: number, currency: string): number {
  if (currency === "INR") return amount;
  if (currency === "USD") return amount / USD_TO_INR;
  if (currency === "EUR") return amount / EUR_TO_INR;
  if (currency === "GBP") return amount / GBP_TO_INR;
  return amount;
}

function findRef(service: string, destination: string): PriceRef | null {
  const serviceData = PRICE_DB[service];
  if (!serviceData) return null;
  const destKey = destination.toLowerCase().replace(/[^a-z]/g, "");
  const matched = Object.keys(serviceData).find(
    (k) => k !== "default" && destKey.includes(k)
  );
  return serviceData[matched ?? "default"] ?? null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      service?: string;
      destination?: string;
      quotedPrice?: number;
      currency?: string;
      details?: string;
    };
    const { service = "", destination = "", quotedPrice = 0, currency = "INR" } = body;

    const ref = findRef(service, destination);

    if (!ref) {
      return NextResponse.json({
        result: {
          quotedPrice,
          referenceMin: 0,
          referenceMax: 0,
          currency,
          verdict: "unknown",
          message: `No reference price data available for "${service}" in "${destination}". We can only check prices for common tourist services in major Indian destinations.`,
          source: "N/A",
          confidence: "low",
        },
      });
    }

    const quotedINR = toINR(quotedPrice, currency);
    const refMin = ref.minINR;
    const refMax = ref.maxINR;

    let verdict: "fair" | "slightly_high" | "overpriced" | "unknown";
    let message: string;

    const ratio = quotedINR / refMax;
    if (ratio <= 1.1) {
      verdict = "fair";
      message = `₹${quotedINR.toFixed(0)} is within the typical range (₹${refMin}–₹${refMax}) for ${service} in this area. ${ref.notes}.`;
    } else if (ratio <= 1.5) {
      verdict = "slightly_high";
      message = `₹${quotedINR.toFixed(0)} is slightly above the typical range (₹${refMin}–₹${refMax}). You may be able to negotiate. ${ref.notes}.`;
    } else {
      verdict = "overpriced";
      message = `₹${quotedINR.toFixed(0)} is significantly above the typical range (₹${refMin}–₹${refMax}). Consider negotiating or finding an alternative. ${ref.notes}.`;
    }

    return NextResponse.json({
      result: {
        quotedPrice,
        referenceMin: parseFloat(fromINR(refMin, currency).toFixed(2)),
        referenceMax: parseFloat(fromINR(refMax, currency).toFixed(2)),
        currency,
        verdict,
        message,
        source: ref.source,
        confidence: "medium — reference benchmarks, not live pricing",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Price check failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 }
    );
  }
}
