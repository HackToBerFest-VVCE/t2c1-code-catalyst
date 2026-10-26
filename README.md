# Touristमित्र (ProofTrip)

Travel assistant and price protection platform for tourists in India, built with Next.js and Solana.

- **Event:** HackToBerFest 2026 (VVCE)
- **Team:** Code Catalyst
- **Members:** Suresh Kishor Savant, Gahana B G

---

## Overview

Touristमित्र helps travelers explore India safely by providing AI-assisted itinerary planning, verified local travel concierges, fair price checks to prevent overcharging, emergency contacts, and tamper-proof digital trip agreements certified on Solana Devnet.

---

## Features

- **Trip Planner:** Custom 5-step itinerary planner for destinations across India (Mysuru, Jaipur, Hampi, Goa, Kerala, Varanasi, Ladakh, and more).
- **Verified AI Concierges:** Discovers and validates tourism agents on Solana Devnet via PDA checks against the Metaplex Agent Registry.
- **On-Chain Trip Attestation:** Generates a SHA-256 hash of the finalized itinerary and stores the commitment on Solana Devnet through an Anchor smart contract.
- **Fair Price Checker:** Compares quoted prices for auto-rickshaws, taxis, guides, and entry tickets against benchmark rates with clear guidance.
- **Scam Detection:** Rule-based heuristic checker that warns users about common tourist scams (e.g., closed monument claims, forced shopping stops).
- **Safety Hub:** Quick access to verified regional emergency helplines (112, 1363 tourist helpline, 108 ambulance, highway patrol).
- **Multi-Language Support:** Instant interface localization for 14 Indian and international languages.
- **Offline Pass & Email Dispatch:** Exportable offline HTML travel kits and formatted email delivery.

---

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, CSS Modules
- **Blockchain:** Solana Devnet, Anchor (`@coral-xyz/anchor`), `@solana/web3.js`
- **Wallet Support:** Solana Wallet Adapter (Phantom, Solflare)
- **Identity Standard:** Metaplex Agent Registry PDA derivation
- **Testing:** Custom automated verification test suite

---

## On-Chain Contracts (Solana Devnet)

- **Trip Commitment Program:** [`A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN`](https://explorer.solana.com/address/A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN?cluster=devnet)
- **Metaplex Agent Registry:** [`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`](https://explorer.solana.com/address/1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p?cluster=devnet)

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Solana wallet extension (Phantom or Solflare) configured for Devnet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HackToBerFest-VVCE/t2c1-code-catalyst.git
   cd t2c1-code-catalyst
   ```

2. Go to the web project directory:
   ```bash
   cd web
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing

Run the automated verification test suite (covers RPC health, contract executability, PDA checks, pricing logic, and tamper detection):

```bash
cd web
npm test
```

To run a production build:

```bash
cd web
npm run build
```
