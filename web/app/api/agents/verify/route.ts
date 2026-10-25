import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

const MPL_AGENT_REGISTRY_PROGRAM = "AGentzDhMq5LoFxYJ5R2J8GNwSCY8BqrEMJmqHfBX9er";

function deriveIdentityPda(assetPublicKey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("agent_identity"), assetPublicKey.toBuffer()],
    new PublicKey(MPL_AGENT_REGISTRY_PROGRAM)
  );
  return pda;
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
    const identityPda = deriveIdentityPda(assetKey);

    // Check whether the asset account itself exists on Devnet
    const assetAccount = await connection.getAccountInfo(assetKey);
    if (!assetAccount) {
      return NextResponse.json({
        registered: false,
        reason: "Asset account does not exist on Devnet",
        identityPda: identityPda.toBase58(),
      });
    }

    // Check whether the registry PDA exists
    const identityAccount = await connection.getAccountInfo(identityPda);
    if (!identityAccount) {
      return NextResponse.json({
        registered: false,
        reason: "No agent identity PDA found for this asset on Devnet",
        assetExists: true,
        identityPda: identityPda.toBase58(),
      });
    }

    return NextResponse.json({
      registered: true,
      identityPda: identityPda.toBase58(),
      assetPublicKey: asset,
      dataLength: identityAccount.data.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Verification RPC call failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 }
    );
  }
}
