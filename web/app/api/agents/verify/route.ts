import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

// Official Metaplex Agent Registry program ID (Devnet & Mainnet)
const MPL_AGENT_REGISTRY_PROGRAM = "1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p";

function deriveIdentityPda(assetPublicKey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("agent_identity", "utf-8"), assetPublicKey.toBuffer()],
    new PublicKey(MPL_AGENT_REGISTRY_PROGRAM)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset");

  if (!asset) {
    return NextResponse.json({ error: "asset parameter required" }, { status: 400 });
  }

  let assetKey: PublicKey;
  try {
    assetKey = new PublicKey(asset);
  } catch {
    return NextResponse.json({ error: "Invalid asset public key" }, { status: 400 });
  }

  const rpc = process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
  const connection = new Connection(rpc, "confirmed");

  try {
    const [identityPda, bump] = deriveIdentityPda(assetKey);

    // Fetch the on-chain agent identity PDA account
    const identityAccount = await connection.getAccountInfo(identityPda);

    if (!identityAccount) {
      // Check if the underlying asset exists on Devnet
      const assetAccount = await connection.getAccountInfo(assetKey);
      return NextResponse.json({
        registered: false,
        reason: assetAccount
          ? "Asset exists on Devnet, but no Metaplex Agent Identity PDA has been registered for it."
          : "Asset account does not exist on Solana Devnet.",
        assetExists: !!assetAccount,
        identityPda: identityPda.toBase58(),
        bump,
        programId: MPL_AGENT_REGISTRY_PROGRAM,
      });
    }

    // Verify program ownership
    const isOwner = identityAccount.owner.toBase58() === MPL_AGENT_REGISTRY_PROGRAM;
    if (!isOwner) {
      return NextResponse.json({
        registered: false,
        reason: "Account exists but is not owned by the Metaplex Agent Registry program.",
        identityPda: identityPda.toBase58(),
        actualOwner: identityAccount.owner.toBase58(),
      });
    }

    // AgentIdentityV1 layout: 8 bytes discriminator + 32 bytes asset pubkey
    let storedAssetMatches = false;
    if (identityAccount.data.length >= 40) {
      const storedAsset = new PublicKey(identityAccount.data.subarray(8, 40));
      storedAssetMatches = storedAsset.equals(assetKey);
    }

    return NextResponse.json({
      registered: true,
      identityPda: identityPda.toBase58(),
      assetPublicKey: asset,
      bump,
      dataLength: identityAccount.data.length,
      storedAssetMatches,
      programId: MPL_AGENT_REGISTRY_PROGRAM,
      cluster: "solana-devnet",
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Verification RPC call failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 }
    );
  }
}
