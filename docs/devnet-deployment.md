# Devnet deployment

The current workspace does not include Rust, Anchor, or the Solana CLI. Run these steps on a machine with the Solana toolchain installed.

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
