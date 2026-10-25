// ─── Official Government of India Visa Requirements & Country Rules ───────────

export type VisaCategory = "visa_free" | "visa_on_arrival" | "evisa" | "regular_visa";

export interface CountryVisaRule {
  country: string;
  code: string;
  flag: string;
  category: VisaCategory;
  categoryLabel: string;
  validitySummary: string;
  processingTime: string;
  feesSummary: string;
  notes: string;
}

export const COUNTRY_VISA_RULES: Record<string, CountryVisaRule> = {
  "nepal": {
    country: "Nepal",
    code: "NP",
    flag: "🇳🇵",
    category: "visa_free",
    categoryLabel: "Visa-Free Freedom of Movement",
    validitySummary: "Indefinite stay for tourism, work, or residence",
    processingTime: "Immediate at immigration border",
    feesSummary: "Free (₹0)",
    notes: "Under the 1950 Indo-Nepal Friendship Treaty, Nepali citizens do not require a visa or passport to enter India. Any valid government-issued photo ID (Voter ID Card or National ID) is accepted.",
  },
  "bhutan": {
    country: "Bhutan",
    code: "BT",
    flag: "🇧🇹",
    category: "visa_free",
    categoryLabel: "Visa-Free Freedom of Movement",
    validitySummary: "Indefinite stay for tourism, study, or residence",
    processingTime: "Immediate at immigration border",
    feesSummary: "Free (₹0)",
    notes: "Under the 1949 India-Bhutan Treaty, Bhutanese nationals may enter and travel within India freely without a visa. Valid Bhutanese passport or Voter Identity Card required at immigration checkpoints.",
  },
  "japan": {
    country: "Japan",
    code: "JP",
    flag: "🇯🇵",
    category: "visa_on_arrival",
    categoryLabel: "Visa on Arrival (VoA) & e-Visa Eligible",
    validitySummary: "60 Days Double Entry",
    processingTime: "On arrival at 6 major international airports or 72 hrs online",
    feesSummary: "₹2,000 (~$25) at airport VoA counter",
    notes: "Japanese nationals can obtain a Visa on Arrival directly at Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and Kolkata international airports, or apply for an online e-Visa in advance.",
  },
  "south korea": {
    country: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    category: "visa_on_arrival",
    categoryLabel: "Visa on Arrival (VoA) & e-Visa Eligible",
    validitySummary: "60 Days Double Entry",
    processingTime: "On arrival at 6 major international airports or 72 hrs online",
    feesSummary: "₹2,000 (~$25) at airport VoA counter",
    notes: "South Korean passport holders are eligible for Visa on Arrival at Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and Kolkata airports, as well as the 30-day/1-year online e-Visa.",
  },
  "united arab emirates": {
    country: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    category: "visa_on_arrival",
    categoryLabel: "Visa on Arrival (VoA) & e-Visa Eligible",
    validitySummary: "60 Days Double Entry",
    processingTime: "On arrival at 6 major airports or 72 hrs online",
    feesSummary: "₹2,000 (~$25) at airport counter",
    notes: "UAE nationals who have previously obtained an e-Visa or paper visa for India are eligible for Visa on Arrival at 6 designated airports. Online e-Visa is always available.",
  },
  "united states": {
    country: "United States",
    code: "US",
    flag: "🇺🇸",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online prior to departure",
    feesSummary: "$25 (30-day peak) / $10 (off-peak) / $40 (1-year)",
    notes: "US citizens can easily apply online via the official Government portal. Biometrics will be captured upon arrival at the Indian international airport.",
  },
  "united kingdom": {
    country: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online prior to departure",
    feesSummary: "$25 (30-day peak) / $40 (1-year)",
    notes: "UK passport holders are fully eligible for the official Indian e-Visa program across all designated airports and seaports.",
  },
  "canada": {
    country: "Canada",
    code: "CA",
    flag: "🇨🇦",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online prior to departure",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Canadian citizens can apply for Tourist e-Visa online. Minimum 6 months passport validity required.",
  },
  "australia": {
    country: "Australia",
    code: "AU",
    flag: "🇦🇺",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online prior to departure",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Australian passport holders can apply online at least 4 days prior to travel date.",
  },
  "germany": {
    country: "Germany",
    code: "DE",
    flag: "🇩🇪",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "German passport holders eligible for online e-Visa with direct approval via email.",
  },
  "france": {
    country: "France",
    code: "FR",
    flag: "🇫🇷",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "French nationals can apply online. Biometrics captured at Indian immigration counter on arrival.",
  },
  "singapore": {
    country: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "48 to 72 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Singaporean passport holders have streamlined e-Visa clearance at all 29 designated international airports.",
  },
  "switzerland": {
    country: "Switzerland",
    code: "CH",
    flag: "🇨🇭",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Swiss citizens can apply online via the official portal with passport copy and white-background photo.",
  },
  "italy": {
    country: "Italy",
    code: "IT",
    flag: "🇮🇹",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Italian citizens eligible for all e-Tourist visa categories.",
  },
  "spain": {
    country: "Spain",
    code: "ES",
    flag: "🇪🇸",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Spanish citizens eligible for online e-Visa.",
  },
  "netherlands": {
    country: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Dutch passport holders eligible for online e-Visa.",
  },
  "russia": {
    country: "Russia",
    code: "RU",
    flag: "🇷🇺",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Russian citizens eligible for Indian e-Tourist visa online.",
  },
  "thailand": {
    country: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "48 to 72 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Thai citizens can apply online at indianvisaonline.gov.in.",
  },
  "malaysia": {
    country: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "48 to 72 hours online",
    feesSummary: "Free (special reciprocal fee waiver) or $25",
    notes: "Malaysian passport holders are eligible for Indian e-Tourist visa online.",
  },
  "indonesia": {
    country: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "48 to 72 hours online",
    feesSummary: "Gratis / $25 depending on category",
    notes: "Indonesian citizens eligible for online e-Visa.",
  },
  "new zealand": {
    country: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "New Zealand citizens can apply online up to 120 days in advance of arrival.",
  },
  "brazil": {
    country: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "$25 (30-day) / $40 (1-year)",
    notes: "Brazilian citizens eligible for online e-Visa. Yellow fever vaccination certificate required.",
  },
  "south africa": {
    country: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    category: "evisa",
    categoryLabel: "Indian e-Visa (Tourist / Business / Medical)",
    validitySummary: "30-Day Double Entry, 1-Year Multiple Entry",
    processingTime: "72 to 96 hours online",
    feesSummary: "Gratis (Reciprocal agreement) or nominal bank processing",
    notes: "South African passport holders are eligible for gratis e-Tourist visa online.",
  },
};

export const OFFICIAL_GOV_VISA_URL = "https://indianvisaonline.gov.in/evisa/tvoa.html";
export const OFFICIAL_GOV_HOME_URL = "https://indianvisaonline.gov.in/";

export const MANDATORY_FOREIGN_DOCUMENTS = [
  {
    id: "passport",
    title: "Original Passport",
    required: true,
    desc: "Must have at least 6 months validity from arrival date in India and at least 2 blank pages for stamping by Bureau of Immigration officers.",
    badge: "Mandatory · 6 Months Validity",
  },
  {
    id: "photo",
    title: "Digital Photograph (Strict Specifications)",
    required: true,
    desc: "Recent color photo against a pure white background. Format: JPEG (10 KB to 1 MB). Dimensions: minimum 350x350 pixels (equal aspect ratio). Full face, eyes open, neutral expression, no glare on spectacles.",
    badge: "Strict: White Background JPEG",
  },
  {
    id: "passport_bio",
    title: "Passport Bio Page Scan",
    required: true,
    desc: "Clear PDF format scan (10 KB to 300 KB) displaying your photograph, personal particulars (name, date of birth, nationality), and passport expiry.",
    badge: "Mandatory PDF Scan",
  },
  {
    id: "tickets",
    title: "Confirmed Return / Onward Flight Ticket",
    required: true,
    desc: "Confirmed booking out of India within your authorized visa stay period (demanded at airline check-in & immigration desk).",
    badge: "Mandatory for Clearance",
  },
  {
    id: "funds",
    title: "Proof of Financial Solvency",
    required: true,
    desc: "International debit/credit card or recent bank statement demonstrating sufficient funds for the duration of travel in India.",
    badge: "Financial Proof",
  },
  {
    id: "health",
    title: "Yellow Fever Certificate (If Applicable)",
    required: false,
    desc: "Original Yellow Fever vaccination card required only if arriving from or transiting through Yellow Fever endemic countries in Africa or Latin America.",
    badge: "Route Specific",
  },
];

export function getCountryVisaRule(countryQuery: string): CountryVisaRule {
  const clean = countryQuery.trim().toLowerCase();
  if (COUNTRY_VISA_RULES[clean]) {
    return COUNTRY_VISA_RULES[clean];
  }
  // Search partial matches
  for (const [key, rule] of Object.entries(COUNTRY_VISA_RULES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return rule;
    }
  }
  // Generic e-Visa eligible fallback for 165+ nations
  return {
    country: countryQuery.trim() || "International Visitor",
    code: "INTL",
    flag: "🌐",
    category: "evisa",
    categoryLabel: "Indian e-Visa (165+ Countries Eligible)",
    validitySummary: "30-Day Double Entry, 1-Year or 5-Year Multiple Entry",
    processingTime: "72 to 96 hours online via indianvisaonline.gov.in",
    feesSummary: "$25 to $40 USD depending on duration & season",
    notes: "Most foreign nationals are eligible for the Government of India Online e-Visa program. Apply at least 4 business days before your scheduled flight.",
  };
}
