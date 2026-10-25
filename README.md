# Touristमत्रम् AI (ProofTrip)

> **Team Code Catalyst — HackToBerFest 2026 (VVCE)**  
> **Team Members:** Suresh Kishor Savant, Gahana B G  
> **Track:** Web3, AI & Smart Tourism Infrastructure on Solana  

---

## 🌟 About Touristमत्रम् AI

**Touristमत्रम् AI** is an AI-powered cultural tourism intelligence and price protection platform built on the **Solana Blockchain**. It bridges trusted tourism AI agents with travellers across India, providing curated itineraries, tamper-evident digital certificates, authentic fair price benchmarks, anti-scam audits, and emergency safety support.

### 🎯 Key Objectives:
- **Democratize Travel Planning**: AI-curated day-by-day routes tailored to budget, crowd vibe, and party style.
- **Eliminate Tourist Overcharging**: Municipal fair-fare benchmark engine against tout price gauging.
- **Verify AI Concierge Authenticity**: Live on-chain identity verification via the **Solana Agent Registry (Metaplex)**.
- **Cryptographic Itinerary Immutability**: SHA-256 hashed travel agreements anchored on Solana Devnet.
- **Remote Travel Preparedness**: Self-contained offline emergency pass downloads and direct Gmail itinerary dispatch.

---

## 🚀 Core Features

| Feature | Description |
|---|---|
| 🗺️ **5-Step Custom Travel Planner** | Interactive customizer for Mysuru, Jaipur, Agra, Goa, Kerala, Varanasi, Ladakh, Srinagar and more with real-time budget burn-down. |
| 🤖 **Verified Solana Agent Concierges** | Discover and verify AI tourism agents registered on Solana Devnet via PDA checks. |
| 🔐 **On-Chain Digital Attestation** | Commit SHA-256 tamper-evident travel agreements to our Anchor smart contract on Solana Devnet. |
| 💰 **Fair Price Benchmark Engine** | Live comparison of auto-rickshaws, cabs, guides, and entry tickets against government/fair market rates. |
| 🛡️ **Tourist Scam & Tout Auditor** | Heuristic pattern analyzer to detect "closed monument", forced detour, and upfront scam attempts. |
| 🚨 **24/7 Safety & Emergency Hub** | Direct access to National Emergency (112), Tourist Helpline (1363), and medical SOS (108). |
| 🌐 **14 Regional & Global Languages** | Instant localization in Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, French, German, Spanish, Japanese, Arabic, and Russian. |
| 📴 **Offline Remote Travel Kit** | Zero-dependency standalone HTML pass with emergency SOS, transit vouchers, and rate cards for zero-connectivity zones. |
| ✉️ **Gmail Itinerary Dispatch** | Direct formatted email delivery with full schedule, vouchers, and tamper-verification details. |
| 🛂 **Traveler Persona & Visa Advisory** | Automatic custom pathways for Indian citizens vs. foreign international visitors (with e-Visa guidelines). |

---

## 🛠️ Technology Stack

- **Frontend & App Framework**: Next.js 14 (App Router), TypeScript, React 18, Lucide Icons
- **Blockchain & Smart Contracts**: Solana Devnet, Rust, Anchor Framework (`@coral-xyz/anchor`, `@solana/web3.js`)
- **Agent Identity Standard**: Metaplex Agent Registry (`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`) & Solana Agent Registry
- **Wallet Standard**: Solana Wallet Adapter supporting Phantom, Solflare, and Backpack
- **Email Dispatch**: Resend API & Responsive HTML Itinerary Templating
- **Styling**: Luxury Editorial Dark/Gold Tourism UI with DM Sans & Inter typography

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Web Client                              │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │     Frontend UI       │  │             API Routes                │  │
│  │  • Custom Planner     │  │  • /api/agents        (Agent Network) │  │
│  │  • Agent Directory    │  │  • /api/agents/verify (Solana Devnet) │  │
│  │  • Fair Price Checker │  │  • /api/planner       (Itinerary AI)  │  │
│  │  • Expense Tracker    │  │  • /api/price         (Fare DB)       │  │
│  │  • Safety & Helplines │  │  • /api/scam          (Pattern Audit) │  │
│  │  • Digital Verifier   │  │  • /api/send-itinerary (Dispatch)     │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
└───────────────┬─────────────────────────────────┬──────────────────────┘
                │ Solana Wallet Standard          │ Anchor RPC Client
                ▼                                 ▼
      ┌──────────────────┐             ┌─────────────────────────────┐
      │ Phantom/Solflare │             │        Solana Devnet        │
      │  Devnet Wallet   │             │ Program: A7yU8i4…VSzN       │
      └──────────────────┘             │  • commit_itinerary()       │
                                       │  • TripCommitment PDA       │
                                       │    [agent, hash, traveler]  │
                                       └─────────────────────────────┘
```

---

## 📜 On-Chain Programs & Devnet Deployments

- **Tourism Anchor Smart Contract**: [`A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN`](https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet)
  - **Instruction**: `commit_itinerary(agent_asset: Pubkey, itinerary_hash: [u8; 32], destination: String)`
  - **Account Structure**: `TripCommitment` (stores traveler pubkey, agent asset, 32-byte SHA-256 hash, destination string, timestamp)
- **Metaplex Agent Registry**: [`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`](https://explorer.solana.com/address/1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p?cluster=devnet)
  - **Identity PDA Derivation**: `[b"agent_identity", asset_pubkey.as_ref()]`

---

## 💻 Installation & Quickstart

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- Solana Wallet (Phantom / Solflare) configured to **Devnet**

### Steps to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/HackToBerFest-VVCE/t2c1-code-catalyst.git
cd t2c1-code-catalyst

# 2. Navigate to the web application directory
cd web

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local

# 5. Run development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing & Verification Suite

A 14-point test suite is included to verify Devnet RPCs, smart contract executability, PDA derivations, REST APIs, and hashing logic:

```bash
cd web
npm test
```

Production build test:
```bash
npm run build
```

---

## 👥 Team & Submission Credits

- **Team Name**: Code Catalyst
- **Event**: HackToBerFest 2026 (Vidyavardhaka College of Engineering)
- **Team Members**:
  - **Suresh Kishor Savant**
  - **Gahana B G**
