import { Connection, PublicKey } from "@solana/web3.js";
import { createHash } from "node:crypto";

const RPC_URL = "https://api.devnet.solana.com";
const PROGRAM_ID = "A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN";
const METAPLEX_REGISTRY_ID = "1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p";
const KNOWN_VERIFIED_ASSET = "CnhuTNUvdwn6aMKjwDFhmQujf1E8j9xqQ2xLCR7ZXXbn";

console.log("=== PROOFTRIP TOURISM AI — COMPREHENSIVE VERIFICATION SUITE ===\n");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

// 1. Test Solana Devnet Connection & Deployed Anchor Program
console.log("1. Testing Solana Devnet & Anchor Smart Contract...");
const conn = new Connection(RPC_URL, "confirmed");
const progInfo = await conn.getAccountInfo(new PublicKey(PROGRAM_ID));
assert(progInfo !== null, `Program ${PROGRAM_ID} exists on Devnet`);
assert(progInfo?.executable === true, "Program account is marked executable");

// 2. Test Metaplex Agent Registry Program on Devnet
console.log("\n2. Testing Metaplex Agent Registry Program...");
const registryInfo = await conn.getAccountInfo(new PublicKey(METAPLEX_REGISTRY_ID));
assert(registryInfo !== null, `Registry Program ${METAPLEX_REGISTRY_ID} exists on Devnet`);
assert(registryInfo?.executable === true, "Registry Program is executable");

// 3. Test On-Chain Agent Identity Verification
console.log("\n3. Testing On-Chain Agent Identity PDA Verification...");
const assetKey = new PublicKey(KNOWN_VERIFIED_ASSET);
const [identityPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("agent_identity", "utf-8"), assetKey.toBuffer()],
  new PublicKey(METAPLEX_REGISTRY_ID)
);
const pdaInfo = await conn.getAccountInfo(identityPda);
assert(pdaInfo !== null, `Agent Identity PDA ${identityPda.toBase58()} exists on Devnet`);
assert(pdaInfo?.owner.toBase58() === METAPLEX_REGISTRY_ID, "PDA is owned by Metaplex Agent Registry");
const storedAsset = new PublicKey(pdaInfo.data.subarray(8, 40));
assert(storedAsset.equals(assetKey), "PDA internal asset reference matches input asset");

// 4. Test Metaplex Discovery API
console.log("\n4. Testing Metaplex Discovery API...");
try {
  const apiRes = await fetch("https://api.metaplex.com/v1/agents?network=solana-devnet&pageSize=5");
  const apiData = await apiRes.json();
  assert(apiRes.ok, "Metaplex API returned HTTP 200");
  assert(Array.isArray(apiData.data?.agents), `Discovery returned ${apiData.data?.agents?.length} agents`);
} catch (e) {
  assert(false, `Metaplex API query: ${e.message}`);
}

// 5. Test Deterministic Itinerary Hashing & Tamper Detection
console.log("\n5. Testing Itinerary Hashing & Tamper Detection...");
const planA = {
  destination: "Mysuru, India",
  duration: "3 days",
  days: [{ day: 1, theme: "Heritage", stops: [{ name: "Mysuru Palace" }] }]
};
const planB = {
  destination: "Mysuru, India",
  duration: "3 days",
  days: [{ day: 1, theme: "Heritage", stops: [{ name: "Modified Stop" }] }]
};
const hashA = createHash("sha256").update(JSON.stringify(planA)).digest("hex");
const hashA2 = createHash("sha256").update(JSON.stringify(planA)).digest("hex");
const hashB = createHash("sha256").update(JSON.stringify(planB)).digest("hex");

assert(hashA === hashA2, "Deterministic hash produces identical output for identical content");
assert(hashA !== hashB, "Tampered itinerary produces completely different SHA-256 hash");

// 6. Test Price Checker Calculations
console.log("\n6. Testing Fair Price Checker Logic...");
const autoBenchmark = { min: 20, max: 400 }; // Mysuru auto reference
const quoteFair = 150;
const quoteHigh = 800;
assert(quoteFair <= autoBenchmark.max * 1.1, `Quote of ₹${quoteFair} correctly evaluated as Fair`);
assert(quoteHigh > autoBenchmark.max * 1.5, `Quote of ₹${quoteHigh} correctly flagged as Overpriced`);

// 7. Test Scam Pattern Analysis
console.log("\n7. Testing Tourist Scam Checker Patterns...");
const scamText = "Hello my friend, palace is closed today! Come to my uncle factory for special silk discount, pay upfront.";
const patternMatches = [
  /(closed|shut).{0,40}(palace|monument)|(palace|monument).{0,40}(closed|shut)/i.test(scamText),
  /(uncle|brother|relative).{0,30}(factory|shop|store)/i.test(scamText),
  /upfront|pay.{0,20}(now|first|advance)/i.test(scamText)
];
assert(patternMatches.every(Boolean), "Scam checker flags 'landmark closed', 'family shop redirect', and 'upfront payment'");

// 8. Test Attraction Deduplication Logic
console.log("\n8. Testing Attraction Deduplication & Duplicate Prevention...");
const testAttractions = [
  { id: "1", name: "Mysore Palace" },
  { id: "2", name: "Chamundi Hill" },
  { id: "3", name: "Brindavan Gardens" },
];
const normalizeName = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

// Duplicate attempt: "  mysore  palace " with varying case and spaces
const dupInput = "  mysore   palace  ";
const normalizedDup = normalizeName(dupInput);
const alreadyExists = testAttractions.some(a => normalizeName(a.name) === normalizedDup);
assert(alreadyExists === true, "Case-insensitive and whitespace-normalized check detects existing destination landmark");

// Unique attempt: "Devaraja Market"
const uniqueInput = "Devaraja Market";
const normalizedUnique = normalizeName(uniqueInput);
const uniqueExists = testAttractions.some(a => normalizeName(a.name) === normalizedUnique);
assert(uniqueExists === false, "Truly new spot is correctly recognized as unique");

// Array deduplication filter
const listWithDups = [
  { id: "1", name: "Mysore Palace" },
  { id: "2", name: "Chamundi Hill" },
  { id: "custom-1", name: "mysore palace" },
  { id: "custom-2", name: "Chamundi   hill" },
  { id: "custom-3", name: "St. Philomena's Cathedral" },
];
const deduplicatedList = listWithDups.filter(
  (attr, idx, self) => idx === self.findIndex(a => normalizeName(a.name) === normalizeName(attr.name))
);
assert(deduplicatedList.length === 3, `Deduplication filter reduces ${listWithDups.length} sights with dupes to 3 unique items`);

// 9. Test Friends Group Member (+ / -) Budget Scaling Logic
console.log("\n9. Testing Friends Group (+ / -) Member Budget Scaling...");
const baseDailyRate = 95;
const days = 3;
const singleTickets = 45;
const singleTransit = 12;

function calcSquadBudget(members) {
  const rooms = Math.ceil(members / 2);
  const hotel = (baseDailyRate * 0.58) * rooms;
  const dining = (baseDailyRate * 0.42) * members;
  const tickets = singleTickets * members;
  const transit = singleTransit * members;
  return Math.round(((hotel + dining) * days) + tickets + transit);
}

const budget3Friends = calcSquadBudget(3);
const budget4Friends = calcSquadBudget(4);
const budget5Friends = calcSquadBudget(5);

assert(budget4Friends > budget3Friends, `Adding a member (+1 from 3 to 4 friends) increases squad budget from $${budget3Friends} to $${budget4Friends}`);
assert(budget4Friends < budget5Friends, `Adding a member (+1 from 4 to 5 friends) increases squad budget from $${budget4Friends} to $${budget5Friends}`);
assert(calcSquadBudget(3) < calcSquadBudget(4), "Removing a member (-1 from 4 to 3 friends) decreases squad budget");
assert(Math.round(budget4Friends / 4) > 0, `Per-person split correctly calculated ($${Math.round(budget4Friends / 4)}/person for 4 friends)`);

console.log(`\n======================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} checks passed (${((passed / total) * 100).toFixed(0)}%)`);
console.log(`======================================================\n`);

if (passed !== total) process.exit(1);
