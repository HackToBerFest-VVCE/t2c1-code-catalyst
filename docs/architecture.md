# Validated architecture

## User flow

1. The traveler enters destination, dates, interests, and budget.
2. The off-chain planner produces a structured itinerary.
3. The client discovers candidate agents from the Metaplex indexed directory.
4. The client verifies the chosen agent identity on Solana and reads its registration document.
5. The traveler connects a wallet and signs a Devnet transaction committing the itinerary hash.
6. The client shows the transaction signature and provides a verification view.

## On-chain data

The Anchor program stores a `TripCommitment` account containing:

- traveler public key;
- selected Metaplex Core agent asset public key;
- SHA-256 hash of a canonical itinerary JSON document;
- creation timestamp;
- optional public destination label.

It does not store names, exact plans, passport details, model prompts, or private preferences.

## Registry boundary

The Metaplex Agent Registry supplies the agent identity and registration metadata. Discovery is indexed and may lag recent transactions; the selected identity must be checked against Solana state before use. The registry is not treated as a guide license, content validator, or booking system.

## Staged implementation

1. Anchor commitment instruction and account (current slice).
2. TypeScript canonicalization/hash helper and registry adapter.
3. Wallet-connected web page for discovery, verification, and commit.
4. Devnet demo with a registered planning agent and explorer links.
5. Add feedback only after confirming the exact supported registry instruction and account flow.
