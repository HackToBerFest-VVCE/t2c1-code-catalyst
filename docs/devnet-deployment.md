# Devnet deployment

The project is configured for the deployed Devnet program `A7yU8i4YBUmnR5fZUxxC88ytFe59XkZGvqN1tj34VSzN`. Run these steps only when redeploying or upgrading it.

```powershell
solana config set --url devnet
solana-keygen new
solana airdrop 2

# From the repository root
anchor build
anchor keys list
# Copy the generated tourism_registry address into:
# - programs/tourism_registry/src/lib.rs (`declare_id!`)
# - Anchor.toml (`[programs.devnet]`)

anchor build
anchor deploy --provider.cluster devnet
anchor idl init --provider.cluster devnet <PROGRAM_ID>
```

After deployment, configure the web app:

```powershell
Copy-Item web/.env.example web/.env.local
# Set NEXT_PUBLIC_TOURISM_PROGRAM_ID=<PROGRAM_ID>
cd web
npm install
npm run dev
```

The browser flow intentionally refuses to claim success until `NEXT_PUBLIC_TOURISM_PROGRAM_ID` is set. This prevents a demo from presenting a local or placeholder address as a real Devnet deployment.
