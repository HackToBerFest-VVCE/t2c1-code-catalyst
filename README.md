# Tourism AI Agent Registry

Tourism planner that discovers Solana-registered AI agents and produces verifiable itinerary records.
It uses the Metaplex Agent Registry for agent identity and service discovery.
Trip content stays off-chain; Solana stores a compact commitment linking the itinerary to the selected agent.
The prototype targets Solana Devnet and is designed for a focused hackathon demonstration.

## Current status

This repository contains the validated architecture and the first Anchor program interface. The web client and registry adapter are the next implementation slices.

## Verified registry integration

The integration uses the documented Metaplex flow:

- discover agents through the Metaplex indexed agent API or DAS;
- resolve the selected agent's registration URI and service metadata;
- verify the agent identity PDA on Solana before displaying it as registered;
- store only an itinerary hash, agent asset address, and public metadata in the project program.

Registry identity does not prove itinerary accuracy, local expertise, or service quality.

## Development target

- Solana Devnet
- Anchor/Rust program
- Next.js and TypeScript client
- Solana wallet adapter
- Metaplex `mpl-agent-registry` SDK and DAS/API discovery

See [docs/architecture.md](docs/architecture.md) for the validated design and staged plan.
