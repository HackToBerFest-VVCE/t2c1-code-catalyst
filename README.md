# ProofTrip — Tourism AI Agent on Solana

ProofTrip helps tourists plan verified trips by discovering AI agents registered on the Solana blockchain via the Metaplex Agent Registry. Travellers generate itineraries, verify an agent's on-chain identity, and commit a tamper-evident itinerary hash to Solana Devnet — proving which agent produced the plan and that the plan hasn't been altered since.

---

## Features

| Feature | Description |
|---|---|
| 🗺️ Travel Planner | Day-by-day AI itinerary with costs; Mysuru, Goa, Delhi, Bangalore, Jaipur built-in |
| 🤖 Travel Agents | Discover real agents from Metaplex Agent Registry (Solana Devnet) |
| ✅ Identity Verification | On-chain PDA check against the registry program |
| 🔐 Itinerary Commitment | SHA-256 hash stored on Devnet via Anchor program |
| 💰 Fair Price Checker | Compare tourist service quotes against reference benchmarks |
| 🧾 Expense Tracker | Budget tracking with receipt upload and OCR (needs OpenAI key) |
| 🛡️ Scam Checker | Pattern-based analysis of suspicious offers |
| 🚨 Safety & Emergency | Emergency numbers and travel advisories for Indian destinations |
| 🔎 Verification | Detect itinerary tampering by hash comparison |

---

## Technology Stack

- **Frontend**: Next.js 15, TypeScript, React 19
- **Blockchain**: Solana (Devnet), Anchor/Rust, `@coral-xyz/anchor`, `@solana/web3.js`
- **Agent Registry**: Metaplex Agent Registry (`api.metaplex.com/v1/agents`)
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare)
- **Styling**: Custom CSS design system (DM Sans, yellow/dark theme)
- **Optional AI**: OpenAI GPT-4o-mini for itineraries and receipt OCR

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js App (web/)                                          │
│  ┌──────────────┐  ┌─────────────────────────────────────┐  │
│  │  Frontend UI │  │  API Routes                          │  │
│  │  - Dashboard │  │  /api/agents        ← Metaplex API  │  │
│  │  - Planner   │  │  /api/agents/verify ← Solana RPC    │  │
│  │  - Agents    │  │  /api/planner       ← Static/OpenAI │  │
│  │  - Price     │  │  /api/price         ← Static DB      │  │
│  │  - Expenses  │  │  /api/scam          ← Pattern match  │  │
│  │  - Safety    │  │  /api/safety        ← Static DB      │  │
│  │  - Verify    │  │  /api/receipt       ← OpenAI Vision  │  │
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
| `NEXT_PUBLIC_TOURISM_PROGRAM_ID` | ✅ | Deployed Anchor program ID on Devnet |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Solana RPC (defaults to `api.devnet.solana.com`) |
| `SOLANA_RPC_URL` | No | Server-side RPC for verification |
| `OPENAI_API_KEY` | No | Enables AI itineraries and receipt OCR |

---

## Devnet Program

- **Program ID**: `A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN`
- **Network**: Solana Devnet
- **Explorer**: [View on Solana Explorer](https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet)
- **Instruction**: `commit_itinerary(agent_asset, itinerary_hash[32], destination)`
- **Account**: `TripCommitment` — stores traveler, agent asset, 32-byte hash, destination, timestamp

The program source is in `programs/tourism_registry/src/lib.rs` and was deployed via [Solana Playground](https://beta.solpg.io/).

---

## Demo Steps

1. **Open the app** at `http://localhost:3000`
2. **Travel Planner** → Enter "Mysuru" or another destination → Click "Generate Itinerary"
3. **Travel Agents** → Click "Discover Agents" → Select any agent → "Verify Identity"
4. **Back to Planner** → Connect Phantom (Devnet) → "Commit Hash on Devnet" → Approve in Phantom
5. **Saved Itineraries** → View the transaction signature and hash → "View on Explorer"
6. **Fair Price Checker** → Enter a quoted price for an auto-rickshaw ride in Mysuru → Check
7. **Safety & Emergency** → Enter "Mysuru" → View emergency numbers and advisories

---

## Testing

```bash
cd web
npm run type-check   # TypeScript type check
npm run build        # Production build check
npm run lint         # ESLint
```

---

## Known Limitations

- **Agent discovery**: The Metaplex Agent Registry Devnet has no pre-classified tourism agents. All registered agents are development/test entries. The app shows them honestly with relevance scoring, not as verified tourism services.
- **Verification fallback**: If the agent identity PDA is not found (Devnet registration incomplete), the app shows a clear error and does not proceed with commitment.
- **Receipt OCR**: Requires `OPENAI_API_KEY` server-side. Without it, manual entry is needed.
- **Static itinerary data**: Without `OPENAI_API_KEY`, itineraries use a static database covering Mysuru, Goa, Delhi, Bengaluru, Jaipur. Other destinations use a generic template.
- **Price data**: Reference benchmarks are estimates from 2024-2025 travel guides — not live pricing.
- **Devnet only**: All blockchain operations use Solana Devnet. No real SOL is required.
- **Local state**: Saved itinerary records and expenses are in-memory only (page refresh clears them). Persistent storage would require a database.

---

## Registry Integrity Notice

The Solana AI Agent Registry (Metaplex) provides **on-chain identity** — it does not certify tourism expertise, service quality, or the accuracy of any itinerary. ProofTrip uses registry verification to prove *which agent produced a plan* and that the plan *hasn't been altered*, not to endorse any agent's recommendations.
