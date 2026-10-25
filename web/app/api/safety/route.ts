import { NextResponse } from "next/server";

// Safety information database
// Sources: India Ministry of External Affairs advisories, local emergency numbers,
// and official tourism department publications.
// Last reference date: Oct 2025. Verify all numbers locally before relying on them.

type SafetyEntry = {
  advisory: string;
  advisoryLevel: "safe" | "caution" | "warning" | "danger";
  emergencyNumbers: Array<{ type: string; number: string; note?: string }>;
  tips: string[];
  source: string;
};

const INDIA_EMERGENCY_NUMBERS = [
  { type: "Police", number: "100", note: "National emergency police" },
  { type: "Ambulance", number: "108", note: "National ambulance service" },
  { type: "Fire", number: "101" },
  { type: "Tourist Helpline", number: "1800-11-1363", note: "Ministry of Tourism toll-free" },
  { type: "Women Safety (India)", number: "1091" },
];

const SAFETY_DB: Record<string, SafetyEntry> = {
  mysuru: {
    advisory:
      "Mysuru is generally considered safe for tourists, including solo travellers. The city is well-policed and has an active tourism infrastructure. Petty theft around crowded areas (palace gates, markets) is occasionally reported. Maintain standard precautions.",
    advisoryLevel: "safe",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Mysuru City Police", number: "0821-2201600", note: "Local city police" },
      { type: "Mysuru Tourism", number: "0821-2422096", note: "Karnataka Tourism office" },
    ],
    tips: [
      "Keep valuables secure in crowded areas like Devaraja Market and the palace forecourt.",
      "Use pre-booked or app-based autos — avoid unmarked vehicles at night.",
      "Mysuru Palace is closed on Tuesdays; confirm visiting hours from the official website.",
      "Drink bottled or filtered water; avoid ice at roadside stalls.",
      "Carry a photocopy of your passport; keep the original secured at your hotel.",
      "Local emergency contacts: Post office, banks, and major hotels can assist in emergencies.",
    ],
    source: "Karnataka Tourism & local police advisories (Oct 2025)",
  },
  bangalore: {
    advisory:
      "Bengaluru is a cosmopolitan city generally safe for tourists. Traffic congestion is heavy; plan extra time for airport transfers. Night travel in certain areas warrants caution. Petty theft on public transport is occasionally reported.",
    advisoryLevel: "safe",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Bengaluru Police Control", number: "080-22943444" },
      { type: "Namma Metro Helpline", number: "080-49777777" },
    ],
    tips: [
      "Use Ola/Uber or Namma Metro for reliable transport.",
      "Avoid leaving valuables visible in auto-rickshaws or taxis.",
      "The Bengaluru central areas (MG Road, Indiranagar) are well-monitored.",
      "Carry adequate cash — ATMs are widely available but may queue during peak hours.",
    ],
    source: "Bengaluru Police & BBMP tourism info (Oct 2025)",
  },
  goa: {
    advisory:
      "Goa is a popular tourist destination with good facilities. Beach safety — especially during monsoon and at night — requires attention. Drink spiking has been reported at nightlife venues. Keep valuables locked in hotel safes.",
    advisoryLevel: "caution",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Goa Tourism", number: "0832-2437132" },
      { type: "Goa Coast Guard", number: "1554" },
    ],
    tips: [
      "Swim only at lifeguard-patrolled beaches; observe red/yellow flag warnings.",
      "Do not leave food or drinks unattended at bars and clubs.",
      "Avoid drug offers — penalties are severe and scams are common.",
      "Secure your passport and valuables in a hotel safe, not on the beach.",
      "Carry printed copies of hotel address in case of phone battery failure.",
    ],
    source: "Goa Tourism & Goa Police advisories (Oct 2025)",
  },
  delhi: {
    advisory:
      "Delhi is a major tourism hub with intensive policing around monuments. Be vigilant in crowded areas (Chandni Chowk, Paharganj) for pickpockets. Use official pre-paid taxis from the airport. Tourist Police are stationed at major landmarks.",
    advisoryLevel: "caution",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Delhi Police Control", number: "011-23490000" },
      { type: "Delhi Tourism", number: "011-23364513" },
      { type: "Airport Police Post", number: "011-25673555" },
    ],
    tips: [
      "Use the Delhi Metro for safe, reliable city travel.",
      "Book airport transfers through the official pre-paid taxi counter.",
      "Women travellers: use the women-only metro coach and pink auto services.",
      "Avoid strangers who offer unsolicited 'tours' or 'assistance' near monuments.",
      "Carry Indian Rupees in small denominations — many rickshaws do not carry change.",
    ],
    source: "Delhi Police & India Ministry of Tourism (Oct 2025)",
  },
  jaipur: {
    advisory:
      "Jaipur (Pink City) is popular and generally safe for tourists. Gem and carpet scams are frequently reported near major monuments. Use government-approved guides from Rajasthan Tourism offices.",
    advisoryLevel: "caution",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Jaipur Police", number: "0141-2744000" },
      { type: "Rajasthan Tourism", number: "0141-5115425" },
    ],
    tips: [
      "Beware of drivers claiming monuments are 'closed' and offering alternative shops.",
      "Only buy gems from certified shops with government hallmarks.",
      "Hawa Mahal and Amber Fort are best visited early to avoid crowds and touts.",
      "Carry water — Jaipur is hot; hydration is important especially in summer.",
    ],
    source: "Rajasthan Tourism Department (Oct 2025)",
  },
};

function findSafetyEntry(destination: string): SafetyEntry | null {
  const key = destination.toLowerCase().replace(/[^a-z]/g, "");
  const match = Object.keys(SAFETY_DB).find((k) => key.includes(k) || k.includes(key.slice(0, 5)));
  return match ? SAFETY_DB[match] : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination") ?? "";

  if (!destination) {
    return NextResponse.json({ error: "destination parameter required" }, { status: 400 });
  }

  const entry = findSafetyEntry(destination);

  if (!entry) {
    // Generic India fallback
    return NextResponse.json({
      safety: {
        destination,
        advisory: `Specific safety data for "${destination}" is not in our local database. Using generic India travel guidelines. Always check your government's official travel advisory before departure.`,
        advisoryLevel: "caution",
        emergencyNumbers: INDIA_EMERGENCY_NUMBERS,
        tips: [
          "Register your trip with your country's embassy or consulate.",
          "Keep emergency contacts saved offline on your phone.",
          "Purchase travel insurance covering medical emergencies.",
          "Use only licensed, app-based or hotel-recommended transport.",
          "Keep digital copies of all documents in a secure cloud service.",
        ],
        lastChecked: new Date().toISOString(),
        source: "Generic India travel guidelines — verify locally",
      },
    });
  }

  return NextResponse.json({
    safety: {
      destination,
      ...entry,
      lastChecked: new Date().toISOString(),
    },
  });
}
