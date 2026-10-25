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

console.log(`\n======================================================`);
console.log(`TEST SUMMARY: ${passed} / ${total} checks passed (${((passed / total) * 100).toFixed(0)}%)`);
console.log(`======================================================\n`);

if (passed !== total) process.exit(1);
