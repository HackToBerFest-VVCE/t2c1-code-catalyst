# Tourism AI Agent Registry

Tourism planner that discovers Solana-registered AI agents and produces verifiable itinerary records.
It uses the Metaplex Agent Registry for agent identity and service discovery.
Trip content stays off-chain; Solana stores a compact commitment linking the itinerary to the selected agent.
The prototype targets Solana Devnet and is designed for a focused hackathon demonstration.

## Current status

The repository now includes the initial web demo: agent discovery, wallet connection, direct Devnet identity verification, and a guarded itinerary-hash commitment flow. The Anchor program still needs to be deployed before the final transaction can succeed.

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

For deployment prerequisites and the Devnet sequence, see [docs/devnet-deployment.md](docs/devnet-deployment.md).

## Troubleshooting agent discovery

The search box accepts a destination for itinerary context, but the registry first searches agent names. If no agent matches the destination, the web app automatically falls back to active travel agents. Restart the web app or redeploy the latest `main` commit after pulling changes.
