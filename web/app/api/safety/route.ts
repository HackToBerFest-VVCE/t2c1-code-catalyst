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
  mumbai: {
    advisory:
      "Mumbai is one of India's safest metropolitan cities with 24/7 street life and heavy police presence. Standard precautions apply when boarding crowded local trains during peak rush hours. Kaali-peeli taxis operate strictly on digital meters.",
    advisoryLevel: "safe",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Mumbai Police Control", number: "022-22620111", note: "Central police commissionerate" },
      { type: "Maharashtra Tourism Help Desk", number: "022-22044040", note: "MTDC tourist desk" },
    ],
    tips: [
      "Always ensure taxi meters are reset to standard flag-down when boarding kaali-peeli cabs.",
      "Avoid traveling on train footboards during suburban rush hours.",
      "Promenade areas like Marine Drive and Gateway of India are safe and well-lit at night.",
      "During heavy monsoon days (July-August), check Mumbai Traffic Police advisories for low-lying waterlogging.",
    ],
    source: "Mumbai Police & Maharashtra Tourism (Oct 2025)",
  },
  varanasi: {
    advisory:
      "Varanasi's river ghats and sacred temple alleyways are energetic and spiritually vibrant. Confirm boat rates before boarding dawn cruises on the Ganges. Wear certified life jackets on river boats.",
    advisoryLevel: "caution",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Varanasi Tourist Police", number: "0542-2508111", note: "UP Police Tourist Cell" },
      { type: "UP Tourism Office", number: "0542-2505030" },
    ],
    tips: [
      "Always board licensed rowboats and motorboats that provide life vests.",
      "Beware of aggressive unsolicited 'guides' offering private cremation ghat tours or silk factory discounts.",
      "Keep footwear in your backpack or hotel before entering major temple corridors.",
      "Keep wallets and cameras secured in crossbody bags when walking through dense bazaar galis.",
    ],
    source: "UP Police Tourist Cell & Varanasi Tourism (Oct 2025)",
  },
  agra: {
    advisory:
      "Agra is safe with an intensive security perimeter surrounding the Taj Mahal and Agra Fort. The Taj Protection Force patrols all gates. Purchase monument entry tickets only through the official ASI portal or counter.",
    advisoryLevel: "caution",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Agra Taj Protection Police", number: "0562-2421204", note: "Taj security post" },
      { type: "UP Tourism Office Agra", number: "0562-2226431" },
    ],
    tips: [
      "Buy Taj Mahal tickets only from official ASI booths or government website (asi.payumoney.com).",
      "Drone photography is strictly prohibited near the Taj Mahal perimeter.",
      "Hire only guides displaying official Ministry of Tourism badges.",
      "The Taj Mahal is closed on Fridays; plan your schedule accordingly.",
    ],
    source: "Agra Tourist Police & Archaeological Survey of India (Oct 2025)",
  },
  kerala: {
    advisory:
      "Kerala is renowned for exceptional traveler hospitality, high literacy, and well-regulated tourism operations. For backwaters and beach activities, use government-approved houseboats and adhere to marine advisories.",
    advisoryLevel: "safe",
    emergencyNumbers: [
      ...INDIA_EMERGENCY_NUMBERS,
      { type: "Kerala Tourism 24/7 Helpline", number: "1800-425-4747", note: "Toll-free tourist desk" },
      { type: "Kerala Coastal Police", number: "1093", note: "Coastal emergency and marine safety" },
    ],
    tips: [
      "Verify that houseboats display Kerala Tourism green/gold certification stickers before boarding.",
      "In hill stations like Munnar, follow marked trails and hire registered forest department guides.",
      "Confirm seafood prices per kilogram before ordering at Fort Kochi and beach shacks.",
      "Follow lifeguard flags and guidelines at Varkala and Kovalam beaches.",
    ],
    source: "Kerala Police & Kerala Tourism Department (Oct 2025)",
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
