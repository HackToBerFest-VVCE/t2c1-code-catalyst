# ProofTrip — Tourism AI Agent on Solana

ProofTrip helps tourists plan verified trips by discovering AI agents registered on the Solana blockchain via the Metaplex Agent Registry. Travellers generate itineraries, verify an agent's on-chain identity, and commit a tamper-evident itinerary hash to Solana Devnet — proving which agent produced the plan and that the plan hasn't been altered since.

---

## Features

| Feature | Description |
|---|---|
| 🗺️ Travel Planner | Day-by-day AI itinerary with costs; Mysuru, Goa, Delhi, Bangalore, Jaipur built-in |
| 🤖 Travel Agents | Discover real agents from Metaplex Agent Registry (Solana Devnet) |
| ✅ Identity Verification | On-chain PDA check against the official Metaplex registry program |
| 🔐 Itinerary Commitment | SHA-256 hash stored on Devnet via Anchor program |
| 💰 Fair Price Checker | Compare tourist service quotes against reference benchmarks |
| 🧾 Expense Tracker | Budget tracking with category breakdown and spending analytics |
| 🛡️ Scam Checker | Pattern-based analysis of suspicious tourist offers |
| 🚨 Safety & Emergency | Emergency numbers and travel advisories for Indian destinations |
| 🔎 Verification | Detect itinerary tampering by SHA-256 hash comparison |

---

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, React 18
- **Blockchain**: Solana (Devnet), Anchor/Rust, `@coral-xyz/anchor`, `@solana/web3.js`
- **Agent Registry**: Metaplex Agent Registry program (`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`) & REST API (`api.metaplex.com/v1/agents`)
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare via Solana Wallet Standard)
- **Styling**: Custom CSS design system (DM Sans, yellow/dark theme matching reference)
- **Optional AI**: OpenAI GPT-4o-mini for itineraries and receipt OCR

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js App (web/)                                          │
│  ┌──────────────┐  ┌─────────────────────────────────────┐  │
│  │  Frontend UI │  │  API Routes                          │  │
│  │  - Dashboard │  │  /api/agents        ← Metaplex API  │  │
│  │  - Planner   │  │  /api/agents/verify ← Solana Devnet │  │
│  │  - Agents    │  │  /api/planner       ← Static/OpenAI │  │
│  │  - Price     │  │  /api/price         ← Benchmark DB   │  │
│  │  - Expenses  │  │  /api/scam          ← Pattern match  │  │
│  │  - Safety    │  │  /api/safety        ← Reference DB   │  │
│  │  - Verify    │  │  /api/receipt       ← Vision AI/OCR  │  │
│  └──────────────┘  └─────────────────────────────────────┘  │
└──────────┬──────────────────────┬───────────────────────────┘
           │ Wallet Adapter       │ Anchor Client
           ▼                      ▼
    ┌──────────────┐      ┌──────────────────────────────────┐
    │ Phantom /    │      │ Solana Devnet                     │
    │ Solflare     │      │ Program: A7yU8i4…VSzN            │
    └──────────────┘      │ - commit_itinerary instruction   │
                          │ - TripCommitment account          │
                          │   traveler + agent_asset          │
                          │   + itinerary_hash + destination  │
                          └──────────────────────────────────┘
```

**On-chain only**: itinerary hash (32 bytes), traveler pubkey, agent asset pubkey, destination label (≤64 bytes), timestamp.  
**Off-chain**: full itinerary content, personal information, receipts, expense records.

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- A Solana wallet extension (Phantom or Solflare) set to **Devnet**

### Install & Run

```bash
cd web
cp .env.example .env.local   # fill in values as needed
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_TOURISM_PROGRAM_ID` | ✅ | Deployed Anchor program ID on Devnet (`A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN`) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Solana RPC (defaults to `https://api.devnet.solana.com`) |
| `SOLANA_RPC_URL` | No | Server-side RPC for verification |
| `OPENAI_API_KEY` | No | Enables dynamic GPT-4o-mini itineraries and vision receipt OCR |

---

## Devnet Programs & On-Chain Addresses

- **Tourism Anchor Program ID**: `A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN`
  - **Explorer**: [View Tourism Program on Solana Explorer](https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet)
  - **Instruction**: `commit_itinerary(agent_asset: Pubkey, itinerary_hash: [u8; 32], destination: String)`
  - **Account**: `TripCommitment` — stores traveler, agent asset, 32-byte hash, destination, timestamp

- **Metaplex Agent Registry Program ID**: `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`
  - **Explorer**: [View Metaplex Agent Registry on Solana Explorer](https://explorer.solana.com/address/1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p?cluster=devnet)
  - **Identity PDA**: `[b"agent_identity", asset_pubkey.as_ref()]`

---

## Demo Steps

1. **Open the app** at `http://localhost:3000`
2. **Travel Planner** → Enter "Mysuru, India" → Select duration & budget → Click "Generate Itinerary"
3. **Travel Agents** → Click "Discover Agents" → Select an agent → "Verify Identity" (verifies on Devnet against Metaplex Agent Registry)
4. **Commit Itinerary** → Connect Phantom (Devnet) → "Commit Hash on Devnet" → Approve transaction
5. **Saved Itineraries** → View confirmed transaction signature and on-chain SHA-256 hash → "View on Explorer"
6. **Fair Price Checker** → Check quotes for auto-rickshaw or taxi in Mysuru against benchmarks
7. **Expense Tracker** → Log expenses and view categorized budget burn-down
8. **Scam Checker** → Paste suspicious tourist tout messages to get risk flags & guidance
9. **Safety & Emergency** → Lookup emergency numbers (Police 100, Ambulance 108, Tourist Helpline 1800-11-1363)

---

## Automated Verification & Testing

ProofTrip includes a 14-point automated test suite checking real Devnet RPCs, smart contract executability, PDA derivations, REST APIs, and hashing logic:

```bash
cd web
npm test
```

Expected output:
```
=== PROOFTRIP TOURISM AI — COMPREHENSIVE VERIFICATION SUITE ===
1. Testing Solana Devnet & Anchor Smart Contract...
  ✓ [PASS] Program A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN exists on Devnet
  ✓ [PASS] Program account is marked executable
2. Testing Metaplex Agent Registry Program...
  ✓ [PASS] Registry Program 1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p exists on Devnet
  ✓ [PASS] Registry Program is executable
3. Testing On-Chain Agent Identity PDA Verification...
  ✓ [PASS] Agent Identity PDA exists on Devnet
  ✓ [PASS] PDA is owned by Metaplex Agent Registry
  ✓ [PASS] PDA internal asset reference matches input asset
4. Testing Metaplex Discovery API...
  ✓ [PASS] Metaplex API returned HTTP 200
  ✓ [PASS] Discovery returned active agents
5. Testing Itinerary Hashing & Tamper Detection...
  ✓ [PASS] Deterministic hash produces identical output for identical content
  ✓ [PASS] Tampered itinerary produces completely different SHA-256 hash
6. Testing Fair Price Checker Logic...
  ✓ [PASS] Quote of ₹150 correctly evaluated as Fair
  ✓ [PASS] Quote of ₹800 correctly flagged as Overpriced
7. Testing Tourist Scam Checker Patterns...
  ✓ [PASS] Scam checker flags 'landmark closed', 'family shop redirect', and 'upfront payment'
======================================================
TEST SUMMARY: 14 / 14 checks passed (100%)
======================================================
```

Production build validation:
```bash
npm run build
```

---

## Known Limitations

- **Agent discovery**: The Metaplex Agent Registry on Devnet has no pre-classified tourism category tags. Many registered agents are development/test entries. ProofTrip shows transparent metadata relevance scoring rather than misrepresenting them as certified guides.
- **Verification**: If an asset's Agent Identity PDA was never initialized on Devnet, ProofTrip explains that the asset lacks a registered identity rather than fabricating success.
- **Receipt OCR**: Requires `OPENAI_API_KEY` for vision processing; manual entry fallback is provided.
- **Static itinerary data**: Without `OPENAI_API_KEY`, itineraries use the curated local database (Mysuru, Goa, Delhi, Bengaluru, Jaipur).
- **Price data**: Reference benchmarks are estimates from 2024-2025 travel guides — not live pricing.
- **Devnet only**: All blockchain operations use Solana Devnet.

---

## Registry Integrity Notice

The Solana AI Agent Registry (Metaplex) provides **verifiable on-chain identity** — it does not certify tourism expertise, commercial licenses, or itinerary truth. ProofTrip uses registry verification to prove *which agent identity created the plan* and that the plan's *hash is immutable on Solana*, establishing accountability without overstating blockchain trust.
